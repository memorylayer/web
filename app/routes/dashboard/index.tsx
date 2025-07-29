import { ChartAreaInteractive } from "@/components/dashboard/chart-area-interactive";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { SectionCards } from "@/components/dashboard/section-cards";

export default function Page() {
  return (
    <DashboardLayout title="Dashboard">
      <>
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
      </>
    </DashboardLayout>
  );
}
