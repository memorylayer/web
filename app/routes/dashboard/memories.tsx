import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { MemoriesDataTable } from "@/components/memories";

export default function MemoriesPage() {
  return (
    <DashboardLayout title="Memories">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <MemoriesDataTable />
      </div>
    </DashboardLayout>
  );
}
