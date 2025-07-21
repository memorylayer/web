import * as path from "node:path";
import {
  type MetaData,
  type PageData,
  type Source,
  type VirtualFile,
  loader,
} from "fumadocs-core/source";
import matter from "gray-matter";
import React from "react";

const files = Object.entries(
  import.meta.glob<true, "raw">("/content/docs/**/*", {
    eager: true,
    query: "?raw",
    import: "default",
  }),
);

const virtualFiles: VirtualFile[] = files.flatMap(([file, content]) => {
  const ext = path.extname(file);
  const virtualPath = path.relative(
    "content/docs",
    path.join(process.cwd(), file),
  );

  if (ext === ".mdx" || ext === ".md") {
    const parsed = matter(content);

    return {
      type: "page",
      path: virtualPath,
      data: {
        ...parsed.data,
        content: parsed.content,
      },
    };
  }

  if (ext === ".json") {
    return {
      type: "meta",
      path: virtualPath,
      data: JSON.parse(content) as MetaData,
    };
  }

  return [];
});

// Simple icon mapping using React SVG elements to avoid hydration issues
function getIconElement(icon: string) {
  switch (icon) {
    case 'sparkles':
      return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16", 
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "lucide lucide-sparkles shrink-0",
        'aria-hidden': "true"
      }, [
        React.createElement('path', { key: 1, d: "M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" }),
        React.createElement('path', { key: 2, d: "M20 3v4" }),
        React.createElement('path', { key: 3, d: "M22 5h-4" }),
        React.createElement('path', { key: 4, d: "M4 17v2" }),
        React.createElement('path', { key: 5, d: "M5 18H3" })
      ]);
    
    case 'book-open':
      return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24", 
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "lucide lucide-book-open shrink-0",
        'aria-hidden': "true"
      }, [
        React.createElement('path', { key: 1, d: "M12 7v14" }),
        React.createElement('path', { key: 2, d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" })
      ]);
      
    case 'star':
      return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none", 
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "lucide lucide-star shrink-0",
        'aria-hidden': "true"
      }, [
        React.createElement('polygon', { key: 1, points: "12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" })
      ]);
      
    case 'book':
      return React.createElement('svg', {
        xmlns: "http://www.w3.org/2000/svg",
        width: "16",
        height: "16",
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor", 
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: "lucide lucide-book shrink-0",
        'aria-hidden': "true"
      }, [
        React.createElement('path', { key: 1, d: "M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" })
      ]);
      
    default:
      return undefined;
  }
}

export const source = loader({
  icon(icon) {
    if (!icon) {
      return undefined;
    }

    return getIconElement(icon);
  },
  source: {
    files: virtualFiles,
  } as Source<{
    pageData: PageData & {
      content: string;
    };
    metaData: MetaData;
  }>,
  baseUrl: "/docs",
});
