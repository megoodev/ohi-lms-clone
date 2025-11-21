import {
  IconBook,
  IconPlaylistX,
  IconShoppingCart,

  IconUsers,
} from "@tabler/icons-react";


import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminGetDashboardStats } from "@/data/admin/admin-get-dashboard-stats";

export async function SectionCards() {
  const { TotalCustomers, totalCourses, totalSignups, totalLessons } =
    await AdminGetDashboardStats();
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-2 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardDescription>Total Signups</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalSignups}
            </CardTitle>
          </div>
          <IconUsers className="size-8 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Registeration users on the plateform
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardDescription>Total customers</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {TotalCustomers}
            </CardTitle>
          </div>
          <IconShoppingCart className="size-8 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Users who have enrolled in courses
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardDescription>Total courses</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalCourses}
            </CardTitle>
          </div>
          <IconBook className="size-8 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Available courses on the plateform
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex items-center justify-between">
          <div>
            <CardDescription>Total lessons</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalLessons}
            </CardTitle>
          </div>
          <IconPlaylistX className="size-8 text-muted-foreground" />
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            total learning content Availbale
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
