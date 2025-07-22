import fs from "node:fs";
import path from "node:path";
import { source } from "@/source";
import type { Route } from "./+types/og";

// Generate SVG string for OG image
function generateOGImageSVG(title: string, subtitle?: string): string {
  const titleFontSize = 72;
  const subtitleFontSize = 32;
  const titleY = subtitle ? 280 : 315; // Center vertically if no subtitle
  const subtitleY = 340;

  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Background pattern -->
        <pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="2" fill="#333" opacity="0.1"/>
          <circle cx="75" cy="75" r="2" fill="#333" opacity="0.1"/>
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="#000000"/>
      
      <!-- Dot pattern overlay -->
      <rect width="1200" height="630" fill="url(#dots)"/>
      
      <!-- Main title -->
      <text 
        x="600" 
        y="${titleY}" 
        font-family="IBM Plex Mono" 
        font-size="${titleFontSize}" 
        font-weight="700" 
        fill="#ffffff" 
        text-anchor="middle" 
        dominant-baseline="middle"
        letter-spacing="-0.02em"
      >
        ${title}
      </text>
      
      ${
        subtitle
          ? `
      <!-- Subtitle -->
      <text 
        x="600" 
        y="${subtitleY}" 
        font-family="IBM Plex Mono" 
        font-size="${subtitleFontSize}" 
        font-weight="400" 
        fill="#888888" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${subtitle}
      </text>
      `
          : ""
      }
    </svg>
  `.trim();
}

// Load font file as base64 for SVG embedding
async function getFontDataUri(fontPath: string): Promise<string> {
  try {
    const fullPath = path.join(process.cwd(), "public", fontPath);
    const fontData = fs.readFileSync(fullPath);
    const base64Font = fontData.toString("base64");
    return `data:font/truetype;charset=utf-8;base64,${base64Font}`;
  } catch (_error) {
    console.warn(`Could not load font: ${fontPath}`);
    return "";
  }
}

// Enhanced SVG with embedded fonts for reliable font rendering
async function generateOGImageSVGWithFonts(
  title: string,
  subtitle?: string,
): Promise<string> {
  const [regularFontUri, boldFontUri] = await Promise.all([
    getFontDataUri("fonts/ibm-plex-mono/IBMPlexMono-Regular.ttf"),
    getFontDataUri("fonts/ibm-plex-mono/IBMPlexMono-Bold.ttf"),
  ]);

  const titleFontSize = 72;
  const subtitleFontSize = 32;
  const titleY = subtitle ? 280 : 315;
  const subtitleY = 340;

  // Split long titles into multiple lines if needed
  const maxTitleWidth = 16; // approximate character limit per line
  const titleLines =
    title.length > maxTitleWidth
      ? [title.substring(0, maxTitleWidth), title.substring(maxTitleWidth)]
      : [title];

  const titleSvg = titleLines
    .map(
      (line, index) => `
    <text 
      x="600" 
      y="${titleY + (index * 80) - (titleLines.length > 1 ? 40 : 0)}" 
      font-family="IBM Plex Mono" 
      font-size="${titleFontSize}" 
      font-weight="700" 
      fill="#ffffff" 
      text-anchor="middle" 
      dominant-baseline="middle"
      letter-spacing="-0.02em"
    >
      ${line}
    </text>
  `,
    )
    .join("");

  return `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        ${
          regularFontUri
            ? `
        <style>
          @font-face {
            font-family: 'IBM Plex Mono';
            font-weight: 400;
            src: url('${regularFontUri}') format('truetype');
          }
        </style>`
            : ""
        }
        ${
          boldFontUri
            ? `
        <style>
          @font-face {
            font-family: 'IBM Plex Mono';
            font-weight: 700;
            src: url('${boldFontUri}') format('truetype');
          }
        </style>`
            : ""
        }
        
        <!-- Background pattern -->
        <pattern id="dots" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
          <circle cx="25" cy="25" r="2" fill="#333" opacity="0.1"/>
          <circle cx="75" cy="75" r="2" fill="#333" opacity="0.1"/>
        </pattern>
      </defs>
      
      <!-- Background -->
      <rect width="1200" height="630" fill="#000000"/>
      
      <!-- Dot pattern overlay -->
      <rect width="1200" height="630" fill="url(#dots)"/>
      
      <!-- Title(s) -->
      ${titleSvg}
      
      ${
        subtitle
          ? `
      <!-- Subtitle -->
      <text 
        x="600" 
        y="${titleLines.length > 1 ? subtitleY + 40 : subtitleY}" 
        font-family="IBM Plex Mono" 
        font-size="${subtitleFontSize}" 
        font-weight="400" 
        fill="#888888" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${subtitle}
      </text>
      `
          : ""
      }
    </svg>
  `.trim();
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const titleParam = url.searchParams.get("title");
  const subtitleParam = url.searchParams.get("subtitle");
  const docsPath = url.searchParams.get("docs");

  let title = "Memory Layer";
  let subtitle: string | undefined = "Your AI's missing memory layer";

  // Handle docs content
  if (docsPath) {
    try {
      const slugs = docsPath.split("/").filter((v) => v.length > 0);
      const page = source.getPage(slugs);

      if (page) {
        title = page.data.title || "Memory Layer";
        subtitle = page.data.description || "Documentation";
      }
    } catch (error) {
      console.error("Error loading docs page:", error);
      // Fallback to default values
    }
  }
  // Handle query parameters for other routes
  else if (titleParam) {
    title = titleParam;
    subtitle = subtitleParam || undefined;
  }

  try {
    // Generate SVG with embedded fonts for reliable rendering
    const svg = await generateOGImageSVGWithFonts(title, subtitle);

    // Return SVG response
    return new Response(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Fallback to simple SVG without embedded fonts
    const fallbackSvg = generateOGImageSVG(title, subtitle);

    return new Response(fallbackSvg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  }
}
