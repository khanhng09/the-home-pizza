import type { SchemaTypeDefinition } from 'sanity';
import { localeBlockContent } from './objects/locale-block-content';
import { localeString } from './objects/locale-string';
import { localeText } from './objects/locale-text';
import { storyPost } from './documents/story-post';

export const schemaTypes: SchemaTypeDefinition[] = [localeString, localeText, localeBlockContent, storyPost];
