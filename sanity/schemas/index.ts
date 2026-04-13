import type { SchemaTypeDefinition } from "sanity";
import { post } from "./post";
import { category } from "./category";
import { tag } from "./tag";
import { author } from "./author";
import { intellectualAxis } from "./intellectualAxis";
import { series } from "./series";

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  intellectualAxis,
  series,
  category,
  tag,
  author,
];
