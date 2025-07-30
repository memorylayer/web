import { DashboardLayout } from "@/components/dashboard/dashboard-layout";

export default function MemoriesPage() {
  return (
    <DashboardLayout title="Memories">
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Memories
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Memory management functionality coming soon...
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
