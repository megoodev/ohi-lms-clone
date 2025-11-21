'use server'
import { requireAdmin } from "@/data/admin/require-admin";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";
export default async function getSingelurCourse(id: string) {
  const session = await requireAdmin();
  const data = await prisma.course.findUnique({

    where: {
      id: id,
      userId: session.user.id,
      
    },

    select: {

      id: true,
      slug: true,
      title: true,
      smallDescription: true,
      description: true,
      level: true,
      status: true,
      price: true,
      category: true,
      duration: true,
      fileKey: true,
      chapters: {
        select: {
          id: true,
          title: true,
          position: true,
          lessons: {
            select: {
              id: true,
              position: true,
              thumbnilKey: true,
              videoKey: true,
              title: true,
            },
          },
        },
      },
    },
    
  });
  if (!data) {
    return notFound()
  }
  return data;
}
export type singelurCourseType = Awaited<ReturnType<typeof getSingelurCourse>>;

