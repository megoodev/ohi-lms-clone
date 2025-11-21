import S3 from "@/lib/S3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { NextResponse } from "next/server";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { z } from "zod";
const bodySchema = z.object({
  fileName: z.string().min(1, { message: "File name is required" }),
  contentType: z.string().min(1, { message: "Content type is required" }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});


export async function POST(request: Request) {
  try {

    const body = await request.json();
    const validation = bodySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.message },
        { status: 400 }
      );
    }
    const { fileName, contentType, size } = validation.data;

    const uniqekey = `${crypto.randomUUID()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: uniqekey,
      ContentType: contentType,
      ContentLength: size,
    });
    const presignedUrl = await getSignedUrl(S3, command, {
      expiresIn: 3600,
    });
    return NextResponse.json({ presignedUrl, key: uniqekey }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: "something went wrong" },
      { status: 500 }
    );
  }
}
