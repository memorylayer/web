import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { source } from "@/source";
import type { Route } from "./+types/og";

// Cache font data
let fontData: ArrayBuffer | null = null;

function getFontData(): ArrayBuffer {
  if (!fontData) {
    const fontPath = join(process.cwd(), "public/fonts/ibm-plex-mono/IBMPlexMono-Bold.ttf");
    fontData = readFileSync(fontPath);
  }
  return fontData;
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

  // Truncate subtitle if it's longer than 80 characters
  const truncatedSubtitle = subtitle && subtitle.length > 80 
    ? `${subtitle.substring(0, 80).trim()}...` 
    : subtitle;

  try {
    const svg = await satori(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          backgroundImage: `radial-gradient(circle at 25px 25px, rgba(51, 51, 51, 0.1) 2px, transparent 0), 
                           radial-gradient(circle at 75px 75px, rgba(51, 51, 51, 0.1) 2px, transparent 0)`,
          backgroundSize: "100px 100px",
          fontFamily: "IBM Plex Mono",
          padding: "40px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            maxWidth: "1000px",
          }}
        >
          <h1
            style={{
              fontSize: title.length > 20 ? 56 : 72,
              fontWeight: 700,
              color: "#ffffff",
              margin: 0,
              marginBottom: truncatedSubtitle ? 20 : 0,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
              textAlign: "center",
            }}
          >
            {title}
          </h1>
          {truncatedSubtitle && (
            <p
              style={{
                fontSize: 32,
                fontWeight: 400,
                color: "#888888",
                margin: 0,
                lineHeight: 1.2,
                textAlign: "center",
                maxWidth: "800px",
              }}
            >
              {truncatedSubtitle}
            </p>
          )}
        </div>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "IBM Plex Mono",
            data: getFontData(),
            weight: 400,
            style: "normal",
          },
          {
            name: "IBM Plex Mono",
            data: getFontData(),
            weight: 700,
            style: "normal",
          },
        ],
      }
    );

    // Convert SVG to PNG using resvg
    const resvg = new Resvg(svg);
    const pngData = resvg.render();
    const pngBuffer = pngData.asPng();

    return new Response(pngBuffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating OG image:", error);

    // Generate error SVG
    const errorSvg = await satori(
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          fontFamily: "IBM Plex Mono",
        }}
      >
        <h1
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            marginBottom: 20,
          }}
        >
          Memory Layer
        </h1>
        <p
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "#888888",
            margin: 0,
          }}
        >
          Error generating image
        </p>
      </div>,
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: "IBM Plex Mono",
            data: getFontData(),
            weight: 400,
            style: "normal",
          },
          {
            name: "IBM Plex Mono",
            data: getFontData(),
            weight: 700,
            style: "normal",
          },
        ],
      }
    );

    // Convert error SVG to PNG
    const errorResvg = new Resvg(errorSvg);
    const errorPngData = errorResvg.render();
    const errorPngBuffer = errorPngData.asPng();

    return new Response(errorPngBuffer, {
      status: 500,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "no-cache",
      },
    });
  }
}
