import prisma from "@/lib/db";
import { requireUser } from "../user/Require-user";

export async function getEnrolledCourses() {
  const user = await requireUser();
  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      course: {
        select: {
          id: true,
          level: true,
          description: true,
          smallDescription: true,
          category: true,
          duration: true,
          fileKey: true,
          status: true,
          slug: true,
          title: true,
          price: true,
          chapters: {
            select: {
              title: true,
              lessons: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      completed: true,
                      id: true,
                      lessonId: true,
                    },
                  },
                },
                orderBy: {
                  position: "asc",
                },
              },
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });
  return data;
}

export type EnrolledCoursesType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
