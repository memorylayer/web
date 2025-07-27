import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function MemoryLanePage() {
  return (
    <DashboardLayout title="Memory Lane">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Memory Lane</h2>
            <p className="text-muted-foreground">
              Take a journey through your memory timeline.
            </p>
          </div>
          <div className="mt-8 flex items-center justify-center rounded-lg border border-dashed p-8">
            <div className="text-center">
              <h3 className="text-lg font-medium">Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                Memory timeline features will be available here.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
