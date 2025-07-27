import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { DataTable } from "@/components/dashboard/data-table";
import data from "@/components/dashboard/data.json";

export default function MemoriesPage() {
  return (
    <DashboardLayout title="Memories">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <DataTable data={data} />
      </div>
    </DashboardLayout>
  );
}
