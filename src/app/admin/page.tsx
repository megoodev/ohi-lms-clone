import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";

export default function Page() {
  return (
    <>
      <SectionCards />
      <div className="px-2 lg:px-4">
        <ChartAreaInteractive />
      </div>
    </>
  );
}

export const metadata = {
  title: "Admin Dashboard — LMS",
  description: "Administrator dashboard for managing courses and analytics.",
};
