import { useSystemTheme } from "@/hooks/use-system-theme";
import { ReactRouterProvider } from "fumadocs-core/framework/react-router";
import { RootProvider } from "fumadocs-ui/provider/base";
import { ThemeProvider } from "next-themes";
import { NuqsAdapter } from "nuqs/adapters/react-router/v7";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import type { Route } from "./+types/root";
import { AuthProvider } from "./providers/auth-provider";
import "./app.css";

export const links: Route.LinksFunction = () => [];

function ThemeWrapper({ children }: { children: React.ReactNode }) {
  useSystemTheme();
  return <>{children}</>;
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex flex-col min-h-screen">
        <ReactRouterProvider>
          <RootProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem={true}
              disableTransitionOnChange={false}
            >
              <AuthProvider>
                <ThemeWrapper>{children}</ThemeWrapper>
              </AuthProvider>
            </ThemeProvider>
          </RootProvider>
        </ReactRouterProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <NuqsAdapter>
      <Outlet />
    </NuqsAdapter>
  );
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  // Special handling for 404 pages
  if (isRouteErrorResponse(error) && error.status === 404) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-8">
          <h1 className="text-7xl text-foreground tracking-tight">404</h1>
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-muted-foreground">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>

          <Link
            className="text-sm bg-fd-primary text-fd-primary-foreground font-medium px-4 py-2.5"
            to="/"
          >
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  // Default error page for other errors
  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
