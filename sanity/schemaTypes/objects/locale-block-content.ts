import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * Restricted to exactly what `StoryBlock`
 * (`shared/types/story-content.type.ts`) and its serializer
 * (`story-detail-body.tsx`) know how to render: `normal`/`h2`/`h3`
 * paragraph styles, `strong`/`em` decorators, a `link` annotation, and an
 * image block with required alt text and an optional caption. No lists,
 * no other styles — an editor
 * picking a style this array doesn't offer can't produce a block the
 * front end silently drops.
 */
const bodyBlockContent = defineArrayMember({
  type: 'block',
  styles: [
    { title: 'Normal', value: 'normal' },
    { title: 'H2', value: 'h2' },
    { title: 'H3', value: 'h3' },
  ],
  lists: [],
  marks: {
    decorators: [
      { title: 'Strong', value: 'strong' },
      { title: 'Emphasis', value: 'em' },
    ],
    annotations: [
      {
        name: 'link',
        type: 'object',
        title: 'Link',
        fields: [defineField({ name: 'href', title: 'URL', type: 'url', validation: (Rule) => Rule.required() })],
      },
    ],
  },
});

const bodyImageBlock = defineArrayMember({
  type: 'image',
  title: 'Image',
  options: { hotspot: true },
  fields: [
    defineField({ name: 'alt', title: 'Alt text', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'caption', title: 'Caption', type: 'string' }),
  ],
});

/** Mirrors `Localized<StoryBlock[]>` — the article body is authored
 * separately per locale, same as every other content field on the post. */
export const localeBlockContent = defineType({
  name: 'localeBlockContent',
  title: 'Localized body',
  type: 'object',
  fields: [
    defineField({
      name: 'vi',
      title: 'Tiếng Việt',
      type: 'array',
      of: [bodyBlockContent, bodyImageBlock],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'en',
      title: 'English',
      type: 'array',
      of: [bodyBlockContent, bodyImageBlock],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
});
