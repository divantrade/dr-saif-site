import type { SchemaTypeDefinition } from "sanity";
import { post } from "./post";
import { category } from "./category";
import { tag } from "./tag";
import { author } from "./author";
import { intellectualAxis } from "./intellectualAxis";
import { series } from "./series";
import { book } from "./book";

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  intellectualAxis,
  series,
  book,
  category,
  tag,
  author,
];
