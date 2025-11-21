"use server";

import { requireAdmin } from "@/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);
export async function DeleteCourse(courseId: string): Promise<ApiResponse> {
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
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });
    revalidatePath("/admin/courses");
    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete course!",
    };
  }
}
