import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function MemoryUsagePage() {
  return (
    <DashboardLayout title="Memory Usage">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold tracking-tight">Memory Usage</h2>
        <p className="text-muted-foreground">
          Monitor your memory storage and usage statistics.
        </p>
      </div>
      <div className="mt-8 flex items-center justify-center rounded-lg border border-dashed p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium">Coming Soon</h3>
          <p className="text-sm text-muted-foreground">
            Usage analytics and storage metrics will be available here.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
