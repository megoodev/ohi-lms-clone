"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);
export async function EditLesson(
  values: LessonSchemaType
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
    const result = lessonSchema.safeParse(values);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }
    await prisma.lesson.update({
      where: {
        id: result.data.id,
      },
      data: {
        title: result.data.name,
        videoKey: result.data.videoKey,
        thumbnilKey: result.data.thumbnilKey,
        description: result.data.description,
      },
    });
    revalidatePath(
      `/admin/courses/${result.data.courseId}/${result.data.chapterId}/${result.data.id}`
    );
    return {
      status: "success",
      message: "Lesson edited successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to edit lesson",
    };
  }
}
