"use client";

/**
 * Sanity Studio configuration.
 * Mounted at {@link studioBasePath} (`/studio/saif`) on the Next.js host.
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { apiVersion, dataset, projectId, studioBasePath } from "./sanity/env";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "saif-studio",
  title: "موقع أ.د. سيف الدين عبد الفتاح — التحرير",
  basePath: studioBasePath,
  projectId,
  dataset,
  schema: { types: schemaTypes },
  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title("المحتوى")
          .items([
            S.listItem()
              .title("المقالات")
              .child(
                S.documentTypeList("post")
                  .title("المقالات")
                  .defaultOrdering([
                    { field: "publishedAt", direction: "desc" },
                  ])
              ),
            S.divider(),
            S.listItem()
              .title("المحاور الفكرية")
              .child(
                S.documentTypeList("intellectualAxis")
                  .title("المحاور الفكرية (٧)")
                  .defaultOrdering([
                    { field: "axisNumber", direction: "asc" },
                  ])
              ),
            S.listItem()
              .title("السلاسل")
              .child(
                S.documentTypeList("series")
                  .title("السلاسل")
                  .defaultOrdering([
                    { field: "displayOrder", direction: "asc" },
                  ])
              ),
            S.divider(),
            S.listItem()
              .title("التصنيفات (قديمة — لـ SEO)")
              .child(S.documentTypeList("category").title("التصنيفات")),
            S.listItem()
              .title("الوسوم")
              .child(S.documentTypeList("tag").title("الوسوم")),
            S.listItem()
              .title("الكتّاب")
              .child(S.documentTypeList("author").title("الكتّاب")),
          ]),
    }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});
