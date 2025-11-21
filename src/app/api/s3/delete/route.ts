import { requireAdmin } from "@/data/admin/require-admin";
import arcjet from "@/lib/arcjet";
import S3 from "@/lib/S3";
import {  fixedWindow } from "@arcjet/next";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
const aj = arcjet
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );
export async function DELETE(request: Request) {
  const session = await requireAdmin();
  try {
    const decision = await aj.protect(request, {
      fingerPrint: session.user.id,
    });
    if (decision.isDenied()) {
      return NextResponse.json({ message: "dudde not good" }, { status: 429 });
    }
    const body = await request.json();
    const key = body.key;
    if (!key) {
      return NextResponse.json({ message: "key is required" }, { status: 400 });
    }
    const command = new DeleteObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: key,
    });
    await S3.send(command);
    return NextResponse.json(
      { message: "File deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "internal server error" },
      { status: 500 }
    );
  }
}
