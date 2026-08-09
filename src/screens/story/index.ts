export * from './sections/story-intro.section';
export * from './sections/story-list.section';
// Not a section, but a screen-level wrapper `app/page.tsx` composes around
// them — the paper texture has to span every section to stay continuous,
// so it cannot live inside any one of them.
export * from './components/story-backdrop';
