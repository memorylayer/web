import { source } from "@/source";
import type { Route } from "./+types/og";

// Generate SVG string for OG image with web fonts
function generateOGImageSVG(title: string, subtitle?: string): string {
  const titleFontSize = 72;
  const subtitleFontSize = 32;
  const titleY = subtitle ? 280 : 315; // Center vertically if no subtitle
  const subtitleY = 340;

  // Truncate subtitle if it's longer than 45 characters
  const truncatedSubtitle = subtitle && subtitle.length > 45 
    ? `${subtitle.substring(0, 45).trim()}...` 
    : subtitle;

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
      font-family="IBM Plex Mono, 'Courier New', monospace" 
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
        <!-- Use Google Fonts for reliable font loading -->
        <style>
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&amp;display=swap');
        </style>
        
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
        truncatedSubtitle
          ? `
      <!-- Subtitle -->
      <text 
        x="600" 
        y="${titleLines.length > 1 ? subtitleY + 40 : subtitleY}" 
        font-family="IBM Plex Mono, 'Courier New', monospace" 
        font-size="${subtitleFontSize}" 
        font-weight="400" 
        fill="#888888" 
        text-anchor="middle" 
        dominant-baseline="middle"
      >
        ${truncatedSubtitle}
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
    // Generate SVG with web fonts for reliable rendering
    const svg = generateOGImageSVG(title, subtitle);

    // Return SVG response with proper headers
    return new Response(svg, {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
        "Content-Disposition": "inline", // Ensure it displays inline, not as download
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Return error SVG
    const errorSvg = generateOGImageSVG("Memory Layer", "Error generating image");

    return new Response(errorSvg, {
      status: 500,
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "no-cache",
        "Content-Disposition": "inline",
        "X-Content-Type-Options": "nosniff",
      },
    });
  }
}
