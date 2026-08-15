import { defineField, defineType } from 'sanity';

/** Same as `localeString`, for the longer excerpt field. */
export const localeText = defineType({
  name: 'localeText',
  title: 'Localized text',
  type: 'object',
  fields: [
    defineField({ name: 'vi', title: 'Tiếng Việt', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
    defineField({ name: 'en', title: 'English', type: 'text', rows: 3, validation: (Rule) => Rule.required() }),
  ],
});
