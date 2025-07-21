import { HomeLayout } from "fumadocs-ui/layouts/home";
import { Link } from "react-router";
import type { Route } from "./+types/home";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Memory Layer" },
    { name: "description", content: "Your AI's missing memory layer" },
  ];
}

export default function Home() {
  return (
    <HomeLayout
      nav={{
        title: "Memory Layer",
      }}
    >
      <div className="p-4 flex flex-col items-center justify-center text-center flex-1">
        <h1 className="text-xl font-bold mb-2">Memory Layer</h1>
        <p className="text-fd-muted-foreground mb-4">
          Your AI's missing memory layer
        </p>
        <Link
          className="text-sm bg-fd-primary text-fd-primary-foreground font-medium px-4 py-2.5"
          to="/docs"
        >
          Open Docs
        </Link>
      </div>
    </HomeLayout>
  );
}
