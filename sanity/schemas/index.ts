import type { SchemaTypeDefinition } from "sanity";
import { post } from "./post";
import { category } from "./category";
import { tag } from "./tag";
import { author } from "./author";

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  category,
  tag,
  author,
];
