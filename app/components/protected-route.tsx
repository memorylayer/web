import { useAuth } from "@/providers/auth-provider";
import { Navigate, useLocation } from "react-router";
import { Skeleton } from "./ui/skeleton";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  fallback,
  redirectTo = "/auth/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      fallback || (
        <div className="flex h-screen items-center justify-center">
          <div className="space-y-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    // Save the attempted location so we can redirect back after login
    const from = location.pathname + location.search;
    return (
      <Navigate to={`${redirectTo}?from=${encodeURIComponent(from)}`} replace />
    );
  }

  return <>{children}</>;
}
