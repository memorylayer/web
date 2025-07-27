import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SectionCards } from "@/components/dashboard/section-cards";

export default function Page() {
  return (
    <DashboardLayout title="Dashboard">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
      </div>
    </DashboardLayout>
  );
}
