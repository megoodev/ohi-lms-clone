"use server";

import { requireUser } from "@/data/user/Require-user";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { stripe } from "@/lib/stripe";
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
export async function enrollmentCourseAction(
  courseId: string
): Promise<ApiResponse> {
  const session = await requireUser();
  // let checkoutUrl: string;
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerPrint: session.id,
    });
    if (decision.isDenied()) {
      return {
        status: "error",
        message: "You have been blocked",
      };
    }
    // create stripe id to user
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
      },
      select: {
        price: true,
        title: true,
        id: true,
        stripePriceId: true,
      },
    });
    if (!course) {
      return {
        status: "error",
        message: "Course not found",
      };
    }
    if (!course.stripePriceId) {
      return {
        status: "error",
        message: "Course price not configured",
      };
    }
    let stripeCustomerId: string;
    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        stripeCustomerId: true,
        id: true,
      },
    });
    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: session.email,
        name: session.name,
        metadata: {
          userId: session.id,
        },
      });
      stripeCustomerId = customer.id;
    }
    await prisma.user.update({
      where: {
        id: session.id,
      },
      data: {
        stripeCustomerId: stripeCustomerId,
      },
    });
    await prisma.enrollment.update({
      where: {
        userId_courseId: {
          courseId: courseId,
          userId: session.id,
        }
      },
      data: {
        userId: session.id,
        courseId: course.id,
        amount: course.price,
        status: "Active",
      },
    });
   
    revalidatePath(`/courses/${course.id}`);
    return {
      status: "success",
      message: `You have been enrolled in ${course.title} successfully`,
    }
  } catch {
    return {
      status: "error",
      message: "Failed to enrollment course",
    };
  }
}
