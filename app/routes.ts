import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/auth/login.tsx"),
  route("signup", "routes/auth/signup.tsx"),
  route("docs/*", "docs/page.tsx"),
  route("api/search", "docs/search.ts"),
  route("api/og-image", "routes/api/og-image.tsx"),
] satisfies RouteConfig;
