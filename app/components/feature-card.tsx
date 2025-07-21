import type { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

export function FeatureCard({
  icon,
  title,
  description,
  className = "",
}: FeatureCardProps) {
  return (
    <div
      className={`border border-fd-border p-6 bg-fd-card hover:bg-fd-accent/50 transition-colors ${className}`}
    >
      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        <span className="text-xl flex items-center">{icon}</span>
        <span>{title}</span>
      </h3>
      <p className="text-fd-muted-foreground">{description}</p>
    </div>
  );
}

interface FeatureGridProps {
  children: ReactNode;
  className?: string;
}

export function FeatureGrid({ children, className = "" }: FeatureGridProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 my-8 ${className}`}>
      {children}
    </div>
  );
}
