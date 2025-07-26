import { auth } from "@memorylayer/auth/server";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

// Handle all auth-related requests (GET, POST, etc.)
export async function loader({ request }: LoaderFunctionArgs) {
  return auth.handler(request);
}

export async function action({ request }: ActionFunctionArgs) {
  return auth.handler(request);
} 