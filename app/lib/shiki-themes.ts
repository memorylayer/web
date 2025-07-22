import type { ThemeRegistrationAny } from "shiki";

// Import the One Hunter Vercel themes
import vercelDarkTheme from "../../themes/vercel-2024-dark.json";
import vercelLightTheme from "../../themes/vercel-2024-light.json";

// Export themes for direct use with fumadocs-core highlight function
export const oneHunterVercelDark = vercelDarkTheme as ThemeRegistrationAny;
export const oneHunterVercelLight = vercelLightTheme as ThemeRegistrationAny;

// Theme configuration for Fumadocs
export const shikiThemes = {
  light: oneHunterVercelLight,
  dark: oneHunterVercelDark,
} as const;
