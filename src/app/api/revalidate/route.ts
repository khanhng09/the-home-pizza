import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { isValidSignature, SIGNATURE_HEADER_NAME } from '@sanity/webhook';

/**
 * Sanity calls this on every `storyPost` publish (configured as a GROQ-
 * filtered webhook in the project's manage console — see the deploy
 * notes). The signature is HMAC-verified against `SANITY_REVALIDATE_SECRET`
 * rather than compared as a plain shared secret, so a leaked URL alone
 * isn't enough to trigger a revalidation.
 *
 * `{ expire: 0 }`, not `'max'`: per Next's own docs, a webhook-driven
 * revalidation is exactly the case that calls for immediate expiry rather
 * than stale-while-revalidate — an editor hitting Publish should not have
 * the next visitor served the pre-publish version while a background
 * fetch catches up.
 */
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json({ message: 'Missing SANITY_REVALIDATE_SECRET' }, { status: 500 });
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  const body = await request.text();

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
  }

  revalidateTag('story', { expire: 0 });
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
