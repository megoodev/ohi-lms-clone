"use server";
import { requireAdmin } from "@/data/admin/require-admin";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSChemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/zodSchemas";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";
import { fixedWindow, request } from "@arcjet/next";
import arcjet from "@/lib/arcjet";
const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);
export async function EditCourse(
  data: CourseSChemaType,
  id: string
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerPrint: session.user.id,
    });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You have been blocked",
      };
    }
    const validation = courseSchema.safeParse(data);
    if (!validation.success) {
      return {
        status: "error",
        message: "data is not completed",
      };
    }
    await prisma.course.update({
      where: {
        id: id,
      },
      data: {
        ...validation.data,
      },
    });
    return {
      status: "success",
      message: "edit course successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Faield... edit course",
    };
  }
}
export async function ReordingChapters(
  courseId: string,
  chapters: { id: string; position: number }[]
): Promise<ApiResponse> {
  try {

    const updates = chapters.map((chapter) =>
      prisma.chapter.update({
        where: {
          courseId: courseId,
          id: chapter.id,
        },
        data: {
          position: chapter.position,
        },
      })
    );

    await prisma.$transaction(updates);
    revalidatePath(`admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "reordring chapters successfully",
    };
  } catch {
    return {
      message: "Failed to reorder chapters",
      status: "error",
    };
  }
}
export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  try {
 
    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "no lessons provided for reordring",
      };
    }
    const updates = lessons.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      })
    );
    await prisma.$transaction(updates);
    revalidatePath(`admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "reordaring lessons successfully",
    };
  } catch {
    return {
      message: "failed to reorder lessons",
      status: "error",
    };
  }
}

export async function createChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  try {

    const result = chapterSchema.safeParse(values);
    if (!result.success) {
      return {
        message: "invalid data",
        status: "error",
      };
    }
    prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.chapter.create({
        data: {
          courseId: result.data.courseId,
          title: result.data.name,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });
    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
}
export async function createLesson(
  values: LessonSchemaType
): Promise<ApiResponse> {

  try {

    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return {
        message: "invalid data",
        status: "error",
      };
    }
    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          chapterId: result.data.chapterId,
          title: result.data.name,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });
    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to lesson chapter",
    };
  }
}
export async function deleteChapter(
  chapterId: string,
  courseId: string
): Promise<ApiResponse> {

  try {

    const courseWithChapters = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        chapters: {
          select: {
            id: true,
            position: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
    if (!courseWithChapters) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }
    const lessonToDelte = courseWithChapters?.chapters.find(
      (chapter) => chapter.id === chapterId
    );
    if (!lessonToDelte) {
      return {
        status: "error",
        message: "chapter not found in the chapter",
      };
    }

    const remaininglessons = courseWithChapters?.chapters.filter(
      (chapter) => chapter.id !== chapterId
    );

    const updates = remaininglessons?.map((chapter, index) => {
      return prisma.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: index + 1,
        },
      });
    });
    await prisma.$transaction([
      ...updates,
      prisma.chapter.delete({
        where: {
          id: chapterId,
          courseId: courseId,
        },
      }),
    ]);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      message: "chapter deleted successfully",
      status: "success",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to deleted chapter",
    };
  }
}

export async function deleteLesson({
  lessonId,
  chapterId,
  courseId,
}: {
  lessonId: string;
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {

  try {

    const chapterWithLessons = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
      },
      select: {
        lessons: {
          select: {
            id: true,
            position: true,
          },
          orderBy: {
            position: "asc",
          },
        },
      },
    });
    if (!chapterWithLessons) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }
    const lessonToDelte = chapterWithLessons?.lessons.find(
      (lesson) => lesson.id === lessonId
    );
    if (!lessonToDelte) {
      return {
        status: "error",
        message: "Lesson not found in the chapter",
      };
    }

    const remaininglessons = chapterWithLessons?.lessons.filter(
      (lesson) => lesson.id !== lessonId
    );

    const updates = remaininglessons?.map((lesson, index) => {
      return prisma.lesson.update({
        where: {
          id: lesson.id,
        },
        data: {
          position: index + 1,
        },
      });
    });
    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({
        where: {
          id: lessonId,
          chapterId: chapterId,
        },
      }),
    ]);
    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      message: "Lesson deleted successfully",
      status: "success",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to deleted chapter",
    };
  }
}
