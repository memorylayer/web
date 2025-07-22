# MemoryLayer Web App

React Router 7 application with Fumadocs for documentation.

## OG Image Generation

This app includes automatic OG (Open Graph) image generation using Satori. OG images are generated dynamically for better social media sharing.

### How it works

- **Docs Pages**: Automatically use the title and description from MDX frontmatter
- **Other Pages**: Use query parameters `?title=...&subtitle=...`

### Usage Examples

#### For docs content:
```
/api/og?docs=api/memories/create-memory
```

#### For other pages:
```
/api/og?title=About&subtitle=Learn about Memory Layer
/api/og?title=Privacy Policy&subtitle=Data handling and privacy
```

#### Using the OpenGraph component:
```tsx
import { OpenGraph } from "@/components";

export default function MyPage() {
  return (
    <Layout>
      <OpenGraph 
        title="My Page" 
        description="Description of my page"
        url="https://memorylayer.dev/my-page" 
      />
      {/* Your page content */}
    </Layout>
  );
}
```

### Features

- Uses IBM Plex Mono font (loaded locally)
- Dark theme with subtle dot pattern background
- Automatic title/subtitle extraction from docs
- 1200x630 resolution (optimal for social platforms)
- SVG generation with Satori
- Caching headers for performance

### Adding OG images to new routes

1. Import the `OpenGraph` component from `@/components`
2. Add the component to your route's JSX
3. Provide title, description, and optionally url and type

The system will automatically generate beautiful OG images with your IBM Plex Mono fonts for social media sharing.

## OpenGraph Component API

The `OpenGraph` component provides comprehensive SEO metadata including Open Graph tags, Twitter Cards, and standard HTML meta tags.

```tsx
interface OpenGraphProps {
  // Required props
  title: string;                    // Page title
  description: string;              // Page description
  
  // Basic Open Graph
  url?: string;                     // Page URL (defaults to memorylayer.dev)
  type?: "website" | "article" | "book" | "profile"; // Content type
  image?: string;                   // Custom image URL (auto-generates if not provided)
  
  // Image metadata
  imageWidth?: number;              // Image width in pixels (default: 1200)
  imageHeight?: number;             // Image height in pixels (default: 630)
  imageAlt?: string;                // Image alt text for accessibility
  
  // Site metadata
  siteName?: string;                // Site name (default: "Memory Layer")
  locale?: string;                  // Primary locale (default: "en_US")
  alternateLocales?: string[];      // Alternative locales
  
  // Article-specific (when type="article")
  publishedTime?: string;           // ISO 8601 publication date
  modifiedTime?: string;            // ISO 8601 modification date
  author?: string | string[];       // Author name(s)
  section?: string;                 // Article section/category
  tags?: string[];                  // Article tags
  
  // SEO metadata
  keywords?: string[];              // SEO keywords
  canonical?: string;               // Canonical URL (defaults to url)
  robots?: string;                  // Robots directive (default: "index,follow")
  
  // Twitter Card
  twitterSite?: string;             // Twitter site handle (e.g., "@memorylayer")
  twitterCreator?: string;          // Twitter creator handle
  twitterCardType?: "summary" | "summary_large_image" | "app" | "player";
  
  // Browser metadata
  themeColor?: string;              // Browser theme color (default: "#000000")
}
```

### Usage Examples

#### Basic Page
```tsx
<OpenGraph 
  title="About Memory Layer"
  description="Learn about our AI-powered memory management platform"
  url="https://memorylayer.dev/about"
  keywords={["memory", "AI", "knowledge management"]}
  imageAlt="Memory Layer About Page"
/>
```

#### Article/Blog Post
```tsx
<OpenGraph 
  title="How to Use Memory Layer"
  description="Complete guide to getting started with Memory Layer"
  type="article"
  url="https://memorylayer.dev/blog/how-to-use"
  author="Memory Layer Team"
  publishedTime="2024-01-15T10:00:00Z"
  modifiedTime="2024-01-20T15:30:00Z"
  section="Tutorials"
  tags={["tutorial", "guide", "getting-started"]}
  twitterCreator="@memorylayer"
/>
```

#### International Content
```tsx
<OpenGraph 
  title="Política de Privacidad"
  description="Política de privacidad y manejo de datos de Memory Layer"
  url="https://memorylayer.dev/es/privacy"
  locale="es_ES"
  alternateLocales={["en_US", "fr_FR"]}
  robots="index,nofollow"
/>
```

### SEO Features Included

The `OpenGraph` component automatically generates:

**HTML Meta Tags:**
- `<title>` and `<meta name="description">`
- `<meta name="keywords">` (if provided)
- `<meta name="author">` (if provided)
- `<meta name="robots">` (defaults to "index,follow")
- `<meta name="theme-color">` (for mobile browsers)
- `<link rel="canonical">` (prevents duplicate content issues)

**Open Graph Tags:**
- Basic OG tags (title, description, image, type, url)
- Image dimensions and alt text
- Site name and locale information
- Article-specific tags (published time, author, section, tags)

**Twitter Card Tags:**
- Card type (summary_large_image by default)
- Title, description, and image
- Site and creator handles (if provided)
- Image alt text for accessibility

**Benefits for SEO:**
- ✅ Better search engine indexing
- ✅ Rich social media previews
- ✅ Improved accessibility
- ✅ Duplicate content prevention
- ✅ Mobile browser optimization
- ✅ International SEO support

## Development

```bash
bun run dev
```

## Build

```bash
bun run build
```
