import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { MemoriesDataTable } from "@/components/memories";

export default function MemoriesPage() {
  return (
    <DashboardLayout title="Memories">
      <MemoriesDataTable />
    </DashboardLayout>
  );
}
