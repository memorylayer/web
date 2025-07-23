import { readFileSync } from "node:fs";
import { join } from "node:path";
import { source } from "@/source";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";
import type { Route } from "./+types/og";

// Cache font and background image data
let fontData: ArrayBuffer | null = null;
let backgroundImageBase64: string | null = null;

function getFontData(): ArrayBuffer {
  if (!fontData) {
    const fontPath = join(
      process.cwd(),
      "public/fonts/ibm-plex-mono/IBMPlexMono-Bold.ttf",
    );
    fontData = readFileSync(fontPath);
  }
  return fontData;
}

function getBackgroundImage(): string {
  if (!backgroundImageBase64) {
    const imagePath = join(process.cwd(), "public/og-background.png");
    const imageBuffer = readFileSync(imagePath);
    backgroundImageBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;
  }
  return backgroundImageBase64;
}

function getTitleAndSubtitle(
  titleParam: string | null,
  subtitleParam: string | null,
  docsPath: string | null,
): { title: string; subtitle: string | undefined } {
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

  return { title, subtitle };
}

function createMainSVG(
  title: string,
  truncatedSubtitle: string | undefined,
  docsPath: string | null,
) {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        justifyContent: "space-between",
        backgroundImage: `url(${getBackgroundImage()})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontFamily: "IBM Plex Mono",
        padding: "80px",
        position: "relative",
      }}
    >
      {/* Top left branding */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        {docsPath && (
          <div
            style={{
              fontSize: 16,
              fontWeight: 400,
              color: "#BBF451",
              letterSpacing: "0.05em",
              opacity: 0.8,
              marginBottom: "8px",
            }}
          >
            Documentation
          </div>
        )}

        <div
          style={{
            fontSize: 32,
            fontWeight: 400,
            color: "#ffffff",
            letterSpacing: "0.1em",
          }}
        >
          Memory Layer
        </div>
      </div>

      {/* Bottom left main content */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          maxWidth: "800px",
        }}
      >
        <h1
          style={{
            fontSize: title.length > 25 ? 52 : title.length > 15 ? 68 : 76,
            fontWeight: 700,
            color: "#ffffff",
            margin: 0,
            marginBottom: truncatedSubtitle ? 32 : 0,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            textShadow: "0 4px 8px rgba(0, 0, 0, 0.5)",
          }}
        >
          {title}
        </h1>
        {truncatedSubtitle && (
          <p
            style={{
              fontSize: 28,
              fontWeight: 400,
              color: "#ffffff",
              margin: 0,
              lineHeight: 1.3,
              maxWidth: "600px",
              opacity: 0.9,
              textShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
            }}
          >
            {truncatedSubtitle}
          </p>
        )}
      </div>
    </div>
  );
}

function createErrorSVG() {
  return (
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
          color: "#BBF451",
          margin: 0,
        }}
      >
        Error generating image
      </p>
    </div>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const titleParam = url.searchParams.get("title");
  const subtitleParam = url.searchParams.get("subtitle");
  const docsPath = url.searchParams.get("docs");

  const { title, subtitle } = getTitleAndSubtitle(
    titleParam,
    subtitleParam,
    docsPath,
  );

  // Truncate subtitle if it's longer than 80 characters
  const truncatedSubtitle =
    subtitle && subtitle.length > 80
      ? `${subtitle.substring(0, 80).trim()}...`
      : subtitle;

  const fontConfig = [
    {
      name: "IBM Plex Mono",
      data: getFontData(),
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "IBM Plex Mono",
      data: getFontData(),
      weight: 700 as const,
      style: "normal" as const,
    },
  ];

  try {
    const svg = await satori(
      createMainSVG(title, truncatedSubtitle, docsPath),
      {
        width: 1200,
        height: 630,
        fonts: fontConfig,
      },
    );

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

    const errorSvg = await satori(createErrorSVG(), {
      width: 1200,
      height: 630,
      fonts: fontConfig,
    });

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
