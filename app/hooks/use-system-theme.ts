import { useTheme } from "next-themes";
import { useEffect } from "react";

export function useSystemTheme() {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Function to check and update theme based on system preference
    const updateThemeFromSystem = (e: MediaQueryListEvent) => {
      const systemIsDark = e.matches;

      // Always follow system changes regardless of current theme setting
      // This ensures system is the source of truth as requested
      if (systemIsDark) {
        setTheme("dark");
      } else {
        setTheme("light");
      }
    };

    // Initial check and setup
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Set initial theme based on system preference if not already set
    if (theme === "system" || !theme) {
      const systemIsDark = mediaQuery.matches;
      setTheme(systemIsDark ? "dark" : "light");
    }

    // Listen for system theme changes
    mediaQuery.addEventListener("change", updateThemeFromSystem);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", updateThemeFromSystem);
    };
  }, [setTheme, theme]);
}
