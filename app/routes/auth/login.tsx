import { Auth } from "@/components/auth";
import { Link, useNavigate, useSearchParams } from "react-router";

export function meta() {
  return [
    { title: "Sign In - Memory Layer" },
    { name: "description", content: "Sign in to Memory Layer" },
  ];
}

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleAuthSuccess = () => {
    // Redirect to the page they were trying to access, or dashboard
    const from = searchParams.get("from") || "/dashboard";
    navigate(from, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-4 border-b">
        <Link to="/" className="text-lg font-semibold hover:opacity-80">
          Memory Layer
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Auth
            title="Sign in to continue"
            className="w-full"
            onSuccess={handleAuthSuccess}
          />
        </div>
      </main>
    </div>
  );
}
