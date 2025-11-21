import prisma from "@/lib/db";
import {requireAdmin} from "./require-admin";

export async function AdminGetDashboardStats() {
  await requireAdmin();
  const [totalSignups, TotalCustomers, totalCourses, totalLessons] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          enrollment: {
            some: {},
          },
        },
      }),
      prisma.course.count(),
      prisma.lesson.count(),
    ]);
  return {
    totalSignups,
    TotalCustomers,
    totalCourses,
    totalLessons,
  };
}
