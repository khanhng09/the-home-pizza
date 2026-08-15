import { defineField, defineType } from 'sanity';

/**
 * Maps 1:1 onto `StoryEntry` in
 * `shared/constants/story-content.constant.ts` (the file this schema
 * replaces). `excerpt`/`body`/`readingMinutes`/`author` are deliberately
 * optional at this level, not required: today, 5 of the site's 6 entries
 * are teaser-only (a title/image announced with no article written yet) —
 * `getStoryArticle` in `shared/lib/story-content.ts` already treats
 * `defined(body)` as the publish gate, and the teaser card renders
 * unlinked instead of pointing at a 404. The custom validation below only
 * blocks the *half* state — an excerpt with no body, or vice versa — which
 * `getStoryArticle` isn't written to handle.
 */
export const storyPost = defineType({
  name: 'storyPost',
  title: 'Story post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'localeString', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title.vi', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published at',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Main image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt text', type: 'localeString', validation: (Rule) => Rule.required() }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'localeText' }),
    defineField({
      name: 'readingMinutes',
      title: 'Reading minutes',
      type: 'number',
      validation: (Rule) => Rule.integer().positive(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'object',
      fields: [
        defineField({ name: 'name', title: 'Name', type: 'string', validation: (Rule) => Rule.required() }),
        defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'localeBlockContent',
      validation: (Rule) =>
        Rule.custom((body, context) => {
          // All-or-nothing: `StoryArticle` (shared/types/story-content.type.ts)
          // requires excerpt/readingMinutes/author whenever there's a body,
          // so a document can't save into a half state the front end's
          // types don't account for.
          const hasAllArticleFields = Boolean(
            context.document?.excerpt && context.document?.readingMinutes && context.document?.author
          );
          const hasAnyArticleField = Boolean(
            context.document?.excerpt || context.document?.readingMinutes || context.document?.author
          );
          if (body && !hasAllArticleFields) return 'A body needs an excerpt, reading time and author too.';
          if (!body && hasAnyArticleField) return 'Add a body, or clear the excerpt/reading time/author fields.';
          return true;
        }),
    }),
  ],
  preview: {
    select: { title: 'title.vi', media: 'mainImage', hasBody: 'body' },
    prepare({ title, media, hasBody }) {
      return { title, subtitle: hasBody ? 'Published article' : 'Teaser only (no body)', media };
    },
  },
});
