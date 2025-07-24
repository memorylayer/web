import { Auth } from "@/components/auth";
import { Link } from "react-router";

export function meta() {
  return [
    { title: "Sign Up - Memory Layer" },
    { name: "description", content: "Sign up to Memory Layer" },
  ];
}

export default function Signup() {
  const handleAuthSuccess = () => {
    // TODO: Implement redirect logic after successful authentication
    console.log("Authentication successful");
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
            title="Sign up to continue"
            className="w-full"
            onSuccess={handleAuthSuccess}
          />
        </div>
      </main>
    </div>
  );
}
