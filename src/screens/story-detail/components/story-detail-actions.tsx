'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { IcShare } from '@/shared/components/icons';

/**
 * `localStorage` read through `useSyncExternalStore` rather than seeded
 * into state from an effect.
 *
 * It is an external mutable store, which is exactly what this hook is for:
 * the server snapshot is a flat `false`, so the prerendered HTML always
 * matches the first client render, and React then re-reads on the client
 * without a render-phase state write. Every tab listens to `storage`, so
 * liking a post in one updates the others.
 */
// const likeListeners = new Set<() => void>();

// function subscribeToLikes(onChange: () => void) {
//   likeListeners.add(onChange);
//   window.addEventListener('storage', onChange);
//   return () => {
//     likeListeners.delete(onChange);
//     window.removeEventListener('storage', onChange);
//   };
// }

// function readLike(key: string) {
//   try {
//     return window.localStorage.getItem(key) === '1';
//   } catch {
//     // Private mode or blocked storage — the control still toggles for the
//     // session, it just does not persist.
//     return false;
//   }
// }

// function writeLike(key: string, liked: boolean) {
//   try {
//     if (liked) window.localStorage.setItem(key, '1');
//     else window.localStorage.removeItem(key);
//   } catch {
//     /* see readLike */
//   }
//   // `storage` does not fire in the tab that made the change, so this tab is
//   // notified directly.
//   likeListeners.forEach((listener) => listener());
// }

/**
 * The like/share pair at the end of the article.
 *
 * The only client component on this screen — everything else renders on the
 * server. Both controls are 44px hit areas around the design's 32px glyphs;
 * the row is pulled 6px past the text column so the last icon's *visual*
 * edge still lines up with it, which is where the design puts it.
 *
 * "Like" is deliberately local-only: there is no write path to the content
 * source, so this stores a per-visitor flag and shows no count. A real
 * counter needs a backend of its own (see the comments note in
 * `../constants/story-detail.constant.ts` — it is the same decision).
 */
export function StoryDetailActions({ slug, title }: { slug: string; title: string }) {
  const t = useTranslations('storyDetail.actions');
  const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');

  // const storageKey = `story-like:${slug}`;

  // const liked = useSyncExternalStore(
  //   subscribeToLikes,
  //   useCallback(() => readLike(storageKey), [storageKey]),
  //   () => false
  // );

  // const toggleLike = () => writeLike(storageKey, !liked);

  const share = async () => {
    const url = window.location.href;

    // The native sheet where it exists (every mobile browser that matters),
    // clipboard as the desktop fallback.
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // Dismissing the sheet rejects; fall through to copying rather
        // than leaving the tap with no result.
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setShareState('copied');
      window.setTimeout(() => setShareState('idle'), 2000);
    } catch {
      /* Clipboard denied — nothing useful left to try. */
    }
  };

  return (
    <div className="flex items-center -mr-1.5">
      {/* <button
        type="button"
        onClick={toggleLike}
        aria-pressed={liked}
        aria-label={t(liked ? 'unlike' : 'like')}
        className="flex size-11 cursor-pointer items-center justify-center text-linen transition-colors hover:text-gold"
      >
        {liked ? (
          <IcHeartFilled className="size-8 text-gold" />
        ) : (
          <IcHeart className="size-8" />
        )}
      </button> */}

      <button
        type="button"
        onClick={share}
        aria-label={t('share')}
        className="flex size-11 cursor-pointer items-center justify-center text-linen transition-colors hover:text-gold"
      >
        <IcShare className="size-8" />
      </button>

      {/* Announced to screen readers only — the visual feedback is that the
          browser's own share sheet opened, which a copy-to-clipboard
          fallback has no equivalent for. */}
      <span aria-live="polite" className="sr-only">
        {shareState === 'copied' ? t('copied') : ''}
      </span>
    </div>
  );
}
