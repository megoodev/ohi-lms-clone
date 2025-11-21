import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PublicCourseType } from "@/data/course/get-all-courses";
import { School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const PublicCardCouese = ({ data }: { data: PublicCourseType }) => {
  const thumbnailUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${data.fileKey}`;
  return (
    <Card className="relative py-0 gap-0 w-full group">
      <Badge variant="secondary" className="absolute top-2 right-2 z-10">
        {data.level}
      </Badge>
      <Image src={thumbnailUrl} width={600} height={400} alt="thmbnail-url" />
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-2xl group-hover:text-destructive hover:text-white">
          <Link href={`/courses/${data.slug}`}>{data.title}</Link>
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2 text-sm">
          {data.smallDescription}
        </CardDescription>

        <div className="flex gap-2 items-center mb-3 ">
          <div className="flex items-center gap-x-1">
            <div className="flex items-center justify-center bg-destructive/10 rounded-lg gap-5 p-0.5">
              <TimerIcon className="size-6 p-1 rounded-md text-primary " />
            </div>
            <p className="text-sm text-muted-foreground">{data.duration}h</p>
          </div>

          <div className="flex items-center gap-x-1">
            <div className="flex items-center justify-center bg-destructive/10 rounded-lg gap-5 p-0.5">
              <School className="size-6 p-1 rounded-md text-primary " />
            </div>
            <p className="text-sm text-muted-foreground">{data.level}</p>
          </div>
        </div>
        <Link
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
          href={`/courses/${data.slug}`}
        >
          Show more
        </Link>
      </CardContent>
    </Card>
  );
};

export default PublicCardCouese;

export const PublicCourseCardSkeleton = () => {
  return (
    <Card className="relative py-0 gap-0 w-full group">
      <Skeleton className="w-full h-48" />

      <CardContent className="p-4 space-y-2.5">
        <Skeleton className="h-7 w-3/4" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        <div className="flex gap-5 items-center">
          <div className="flex items-center">
            <Skeleton className="w-4 h-4 mr-0.5" />
            <Skeleton className="w-12 h-4" />
          </div>
          <div className="flex items-center">
            <Skeleton className="w-4 h-4 mr-0.5" />
            <Skeleton className="w-16 h-4" />
          </div>
        </div>

        <Skeleton className="w-full h-10" />
      </CardContent>
    </Card>
  );
};
