import prisma from "@/lib/db";
import { requireUser } from "../user/Require-user";
import { notFound } from "next/navigation";

export async function GetCourseSidebarData(slug: string) {
  const user = await requireUser();
  const data = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      slug: true,
      title: true,
      smallDescription: true,
      category: true,
      status: true,
      description: true,
      level: true,
      chapters: {
        select: {
          id: true,
          position: true,
          title: true,
          lessons: {
            select: {
              position: true,
              id: true,
              title: true,
              thumbnilKey: true,
              videoKey: true,
              description: true,
              lessonProgress: {
                where: {
                  userId: user.id,
                },
                select: {
                  lessonId: true,
                  id: true,
                  completed: true,
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
  });
  if (!data) {
    return notFound();
  }
  const enrollment = prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: data.id,
      },
    },
  });
  if (!enrollment) {
    return notFound();
  }
  return data;
}

export type GetCourseSidebarDataType = Awaited<
  ReturnType<typeof GetCourseSidebarData>
>;
