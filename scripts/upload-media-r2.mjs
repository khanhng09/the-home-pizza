/**
 * Uploads `public/images`, `public/videos` and `public/illustrations` to the Cloudflare R2 bucket
 * that `NEXT_PUBLIC_MEDIA_BASE_URL` points at (see `shared/lib/media.ts`).
 *
 * Run with `yarn media:upload` (add `--dry-run` to only list what would
 * change). Like the image/video scripts this is not a build hook: run it
 * after `yarn images:optimize` / `yarn videos:optimize`, and before the
 * deploy that references the new files.
 *
 * Credentials come from `.env.local` (gitignored):
 *
 *   R2_ACCOUNT_ID         Cloudflare dashboard → R2 → Account details
 *   R2_ACCESS_KEY_ID      R2 → Manage API tokens → "Object Read & Write",
 *   R2_SECRET_ACCESS_KEY  scoped to this one bucket
 *   R2_BUCKET             e.g. the-home-pizza-media
 *
 * It talks to R2's S3-compatible API directly (SigV4 via `node:crypto`)
 * rather than pulling in the AWS SDK or wrangler for ~350 PUTs.
 *
 * Only changed files are sent: one listing of the bucket gives each
 * object's ETag, which for a single-part upload is the MD5 of its bytes,
 * and a local file with the same MD5 is skipped. Re-running after a small
 * asset change therefore costs a handful of Class A operations, not 350.
 *
 * Nothing is ever deleted from the bucket. Objects with no local file are
 * reported at the end so they can be removed by hand in the dashboard —
 * an old HTML page cached in someone's browser may still point at them.
 */
import { createHash, createHmac } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', 'public');
const FOLDERS = ['images', 'videos', 'illustrations'];
const CONCURRENCY = 6;
const DRY_RUN = process.argv.includes('--dry-run');

/** Same policy `netlify.toml` gives these folders, and for the same
 * reason: filenames are not content-hashed, so `immutable` would pin a
 * replaced asset in returning visitors' browsers. To ship a change to an
 * existing file immediately, give it a new name. */
const CACHE_CONTROL = 'public, max-age=604800, stale-while-revalidate=86400';

const CONTENT_TYPES = {
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
};

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET } = process.env;
const missing = Object.entries({ R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET })
  .filter(([, value]) => !value)
  .map(([name]) => name);
if (missing.length) {
  console.error(`Missing ${missing.join(', ')} — add them to .env.local (see the header of this script).`);
  process.exit(1);
}

const HOST = `${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

// --- SigV4 -----------------------------------------------------------------

const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const hmac = (key, data) => createHmac('sha256', key).update(data).digest();

/** RFC 3986 encoding, as SigV4 requires — `encodeURIComponent` leaves
 * `!'()*` alone. */
const encode = (value) =>
  encodeURIComponent(value).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);

async function r2(method, key, { query = {}, body, headers = {} } = {}) {
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const day = amzDate.slice(0, 8);
  const scope = `${day}/auto/s3/aws4_request`;

  const pathname = `/${R2_BUCKET}${key ? `/${key.split('/').map(encode).join('/')}` : ''}`;
  const queryString = Object.keys(query)
    .sort()
    .map((name) => `${encode(name)}=${encode(query[name])}`)
    .join('&');

  const payloadHash = sha256(body ?? '');
  const allHeaders = {
    ...Object.fromEntries(Object.entries(headers).map(([name, value]) => [name.toLowerCase(), value])),
    host: HOST,
    'x-amz-content-sha256': payloadHash,
    'x-amz-date': amzDate,
  };
  const signedHeaders = Object.keys(allHeaders).sort();
  const canonicalRequest = [
    method,
    pathname,
    queryString,
    ...signedHeaders.map((name) => `${name}:${String(allHeaders[name]).trim()}`),
    '',
    signedHeaders.join(';'),
    payloadHash,
  ].join('\n');

  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256(canonicalRequest)].join('\n');
  const signingKey = ['auto', 's3', 'aws4_request'].reduce(hmac, hmac(`AWS4${R2_SECRET_ACCESS_KEY}`, day));
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  const { host, ...sendHeaders } = allHeaders;
  const response = await fetch(`https://${host}${pathname}${queryString ? `?${queryString}` : ''}`, {
    method,
    body,
    headers: {
      ...sendHeaders,
      authorization: `AWS4-HMAC-SHA256 Credential=${R2_ACCESS_KEY_ID}/${scope}, SignedHeaders=${signedHeaders.join(';')}, Signature=${signature}`,
    },
  });
  if (!response.ok) {
    throw new Error(`${method} ${key || R2_BUCKET} → ${response.status} ${await response.text()}`);
  }
  return response;
}

// --- Bucket and local state ------------------------------------------------

/** key → ETag (MD5 hex) for every object under FOLDERS. */
async function listRemote() {
  const objects = new Map();
  for (const folder of FOLDERS) {
    let token;
    do {
      const query = { 'list-type': '2', prefix: `${folder}/` };
      if (token) query['continuation-token'] = token;
      const xml = await (await r2('GET', '', { query })).text();
      for (const [, entry] of xml.matchAll(/<Contents>([\s\S]*?)<\/Contents>/g)) {
        const key = entry.match(/<Key>([\s\S]*?)<\/Key>/)?.[1];
        const etag = entry.match(/<ETag>([\s\S]*?)<\/ETag>/)?.[1];
        if (key && etag) objects.set(decodeXml(key), decodeXml(etag).replaceAll('"', ''));
      }
      token = xml.includes('<IsTruncated>true</IsTruncated>')
        ? decodeXml(xml.match(/<NextContinuationToken>([\s\S]*?)<\/NextContinuationToken>/)?.[1] ?? '')
        : undefined;
    } while (token);
  }
  return objects;
}

function decodeXml(value) {
  return value
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&amp;', '&');
}

async function listLocal() {
  const files = [];
  for (const folder of FOLDERS) {
    const entries = await readdir(path.join(ROOT, folder), { recursive: true, withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isFile()) continue;
      const absolute = path.join(entry.parentPath, entry.name);
      const contentType = CONTENT_TYPES[path.extname(entry.name).toLowerCase()];
      if (!contentType) continue; // .DS_Store and anything else that isn't media
      files.push({ key: path.relative(ROOT, absolute).split(path.sep).join('/'), absolute, contentType });
    }
  }
  return files;
}

// --- Main ------------------------------------------------------------------

const [remote, local] = await Promise.all([listRemote(), listLocal()]);

const pending = [];
for (const file of local) {
  const body = await readFile(file.absolute);
  if (remote.get(file.key) === createHash('md5').update(body).digest('hex')) continue;
  pending.push({ ...file, size: body.length });
}

const totalMB = (pending.reduce((sum, file) => sum + file.size, 0) / 1024 / 1024).toFixed(1);
console.log(`${local.length} local files, ${remote.size} in bucket, ${pending.length} to upload (${totalMB} MB).`);

if (DRY_RUN) {
  for (const file of pending) console.log(`  would upload ${file.key}`);
} else {
  let done = 0;
  const queue = [...pending];
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      for (let file = queue.shift(); file; file = queue.shift()) {
        // Re-read rather than holding every pending file in memory at once.
        const body = await readFile(file.absolute);
        await r2('PUT', file.key, {
          body,
          headers: { 'content-type': file.contentType, 'cache-control': CACHE_CONTROL },
        });
        done += 1;
        console.log(`  [${done}/${pending.length}] ${file.key}`);
      }
    })
  );
}

const localKeys = new Set(local.map((file) => file.key));
const orphans = [...remote.keys()].filter((key) => !localKeys.has(key));
if (orphans.length) {
  console.log(`\n${orphans.length} object(s) in the bucket have no local file (not deleted):`);
  for (const key of orphans) console.log(`  ${key}`);
}
