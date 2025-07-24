import * as path from "node:path";
import { source } from "@/source";
import { createCompiler } from "@fumadocs/mdx-remote";
import { executeMdxSync } from "@fumadocs/mdx-remote/client";
import type { PageTree } from "fumadocs-core/server";
import { DocsLayout } from "fumadocs-ui/layouts/docs";

import { FeatureCard, FeatureGrid, OpenGraph, ThemeToggle } from "@/components";
import { shikiThemes } from "@/lib/shiki-themes";
import {
  RiBrainFill,
  RiFlashlightFill,
  RiFocusLine,
  RiLightbulbLine,
  RiLinkM,
  RiOrganizationChart,
  RiSparklingLine,
  RiStarLine,
} from "@remixicon/react";
import defaultMdxComponents from "fumadocs-ui/mdx";
import {
  DocsBody,
  DocsDescription,
  DocsPage,
  DocsTitle,
} from "fumadocs-ui/page";
import type { Route } from "./+types/page";

const compiler = createCompiler({
  development: false,
  // Configure rehype plugins for code highlighting with One Hunter Vercel themes
  rehypeCodeOptions: {
    themes: shikiThemes,
  },
});

export async function loader({ params }: Route.LoaderArgs) {
  const slugs = params["*"].split("/").filter((v) => v.length > 0);
  const page = source.getPage(slugs);
  if (!page) throw new Response("Not found", { status: 404 });

  const compiled = await compiler.compileFile({
    path: path.resolve("content/docs", page.path),
    value: page.data.content,
  });

  return {
    page,
    compiled: compiled.toString(),
    tree: source.pageTree,
  };
}

export default function Page(props: Route.ComponentProps) {
  const { page, compiled, tree } = props.loaderData;
  const { default: Mdx, toc } = executeMdxSync(compiled);

  return (
    <DocsLayout
      nav={{
        title: "Memory Layer",
      }}
      tree={tree as PageTree.Root}
    >
      <OpenGraph
        title={page.data.title ?? "Memory Layer"}
        description={page.data.description ?? "Memory Layer Documentation"}
        type="article"
        url={`https://memorylayer.dev${page.url}`}
        image={`/api/og-image?docs=${page.url.replace("/docs/", "")}`}
      />

      <DocsPage toc={toc}>
        <DocsTitle>{page.data.title}</DocsTitle>
        <DocsDescription>{page.data.description}</DocsDescription>
        <DocsBody>
          <Mdx
            components={{
              ...defaultMdxComponents,
              FeatureCard,
              FeatureGrid,
              RiBrainFill,
              RiFocusLine,
              RiSparklingLine,
              RiFlashlightFill,
              RiLinkM,
              RiOrganizationChart,
              RiLightbulbLine,
              RiStarLine,
            }}
          />
        </DocsBody>
      </DocsPage>
    </DocsLayout>
  );
}
