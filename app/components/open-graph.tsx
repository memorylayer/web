import React from "react";

export interface OpenGraphProps {
  title: string;
  description: string;
  url?: string;
  type?: "website" | "article" | "book" | "profile";
  image?: string;
  imageWidth?: number;
  imageHeight?: number;
  imageAlt?: string;
  siteName?: string;
  locale?: string;
  alternateLocales?: string[];
  publishedTime?: string;
  modifiedTime?: string;
  author?: string | string[];
  section?: string;
  tags?: string[];
  keywords?: string[];
  canonical?: string;
  robots?:
    | "index,follow"
    | "noindex,follow"
    | "index,nofollow"
    | "noindex,nofollow"
    | string;
  twitterSite?: string;
  twitterCreator?: string;
  twitterCardType?: "summary" | "summary_large_image" | "app" | "player";
  themeColor?: string;
}

/**
 * Generate OG image URL for any route
 */
export function generateOGImageUrl(title: string, subtitle?: string): string {
  const params = new URLSearchParams();
  params.set("title", title);
  if (subtitle) {
    params.set("subtitle", subtitle);
  }
  return `/api/og?${params.toString()}`;
}

/**
 * Generate comprehensive SEO meta tags including Open Graph and Twitter Cards
 */
export function OpenGraph({
  title,
  description,
  url = "https://memorylayer.dev",
  type = "website",
  image,
  imageWidth = 1200,
  imageHeight = 630,
  imageAlt,
  siteName = "Memory Layer",
  locale = "en_US",
  alternateLocales,
  publishedTime,
  modifiedTime,
  author,
  section,
  tags,
  keywords,
  canonical,
  robots = "index,follow",
  twitterSite,
  twitterCreator,
  twitterCardType = "summary_large_image",
  themeColor = "#000000",
}: OpenGraphProps) {
  const ogImageUrl = image || generateOGImageUrl(title, description);
  const canonicalUrl = canonical || url;

  return (
    <>
      {/* Basic HTML meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords.join(", ")} />}
      {author && (
        <meta
          name="author"
          content={Array.isArray(author) ? author.join(", ") : author}
        />
      )}
      <meta name="robots" content={robots} />
      <meta name="theme-color" content={themeColor} />

      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph meta tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImageUrl} />
      <meta property="og:image:width" content={imageWidth.toString()} />
      <meta property="og:image:height" content={imageHeight.toString()} />
      {imageAlt && <meta property="og:image:alt" content={imageAlt} />}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content={locale} />
      {alternateLocales?.map((altLocale) => (
        <meta
          key={altLocale}
          property="og:locale:alternate"
          content={altLocale}
        />
      ))}

      {/* Article-specific Open Graph tags */}
      {type === "article" && (
        <>
          {publishedTime && (
            <meta property="article:published_time" content={publishedTime} />
          )}
          {modifiedTime && (
            <meta property="article:modified_time" content={modifiedTime} />
          )}
          {author &&
            (Array.isArray(author) ? (
              author.map((auth) => (
                <meta key={auth} property="article:author" content={auth} />
              ))
            ) : (
              <meta property="article:author" content={author} />
            ))}
          {section && <meta property="article:section" content={section} />}
          {tags?.map((tag) => (
            <meta key={tag} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card meta tags */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImageUrl} />
      {imageAlt && <meta name="twitter:image:alt" content={imageAlt} />}
      {twitterSite && <meta name="twitter:site" content={twitterSite} />}
      {twitterCreator && (
        <meta name="twitter:creator" content={twitterCreator} />
      )}
    </>
  );
}

/**
 * Example usage for different content types:
 *
 * Basic page:
 * <OpenGraph
 *   title="About Memory Layer"
 *   description="Learn about our AI-powered memory management platform"
 *   url="https://memorylayer.dev/about"
 *   keywords={["memory", "AI", "knowledge management"]}
 *   imageAlt="Memory Layer About Page"
 * />
 *
 * Article/Blog post:
 * <OpenGraph
 *   title="How to Use Memory Layer"
 *   description="Complete guide to getting started with Memory Layer"
 *   type="article"
 *   url="https://memorylayer.dev/blog/how-to-use"
 *   author="Memory Layer Team"
 *   publishedTime="2024-01-15T10:00:00Z"
 *   modifiedTime="2024-01-20T15:30:00Z"
 *   section="Tutorials"
 *   tags={["tutorial", "guide", "getting-started"]}
 *   twitterCreator="@memorylayer"
 * />
 *
 * With custom settings:
 * <OpenGraph
 *   title="Privacy Policy"
 *   description="Memory Layer privacy policy and data handling practices"
 *   url="https://memorylayer.dev/privacy"
 *   robots="index,nofollow"
 *   twitterCardType="summary"
 *   locale="en_US"
 *   alternateLocales={["es_ES", "fr_FR"]}
 * />
 *
 * Note: OG images are automatically generated at /api/og
 */
