import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export async function getIndividualCourse(slug: string) {
  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      title: true,
      description: true,
      slug: true,
      smallDescription: true,
      level: true,
      status: true,
      category: true,
      duration: true,
      fileKey: true,
      id: true,
      price: true,
      chapters: {
        select: {
          position: true,
          title: true,
          lessons: {
            select: {
              title: true,
              position: true,
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
  if (!course) {
    return notFound();
  }
  
  return course;
}
