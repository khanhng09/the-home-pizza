import { defineField, defineType } from 'sanity';

/** Mirrors `Localized<string>` in `shared/types/story-content.type.ts` —
 * one field per site locale, both required so a post can't publish half
 * translated. */
export const localeString = defineType({
  name: 'localeString',
  title: 'Localized string',
  type: 'object',
  fields: [
    defineField({ name: 'vi', title: 'Tiếng Việt', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'en', title: 'English', type: 'string', validation: (Rule) => Rule.required() }),
  ],
});
