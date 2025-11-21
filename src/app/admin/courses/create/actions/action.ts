"use server";

import { courseSchema, CourseSChemaType } from "@/lib/zodSchemas";
import prisma from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { requireAdmin } from "@/data/admin/require-admin";
import { stripe } from "@/lib/stripe";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);
export async function CreateCourse(
  values: CourseSChemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerPrint: session?.user.id,
    });
    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "you have been blocked dur to rate limiting",
        };
      } else {
        return {
          status: "error",
          message: "you are bot! if this is mistake conact our support",
        };
      }
    }
    if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized: Please log in",
      };
    }

    const Validation = courseSchema.safeParse(values);

    if (!Validation.success) {
      return {
        status: "error",
        message: "invalid form data",
      };
    }
    const stripeProduct = await stripe.products.create({
      name: Validation.data.title,
      description: Validation.data.smallDescription,
      default_price_data: {
        currency: "usd",
        unit_amount: Validation.data.price * 100,
      },
    });

    await prisma.course.create({
      data: {
        ...Validation.data,
        userId: session.user.id,
        stripePriceId: stripeProduct.default_price as string,
      },
    });

    return {
      status: "success",
      message: "course created successfully",
    };
  } catch {
    return {
      message: "internal server error",
      status: "error",
    };
  }
}
