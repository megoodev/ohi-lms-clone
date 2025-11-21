"use client";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { EnrolledCoursesType } from "@/data/course/get-enrolled-courses";
import { useCourseProgress } from "@/hooks/use-course-progress";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CourseProgressCard = ({ data }: { data: EnrolledCoursesType }) => {
  const thumbnailUrl = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}/t3.storage.dev/${data.course.fileKey}`;
  const { completedLessons, totalLessons, progressPrecentage } =
    useCourseProgress({ courseData: data.course });
  return (
    <Card className="relative py-0 gap-0 w-full group">
      <Badge variant="secondary" className="absolute top-2 right-2 z-10">
        {data.course.level}
      </Badge>
      <Image src={thumbnailUrl} width={600} height={400} alt="thmbnail-url" />
      <CardContent className="p-4 space-y-2">
        <CardTitle className="text-2xl group-hover:text-destructive hover:text-white">
          <Link
            href={`/courses/${data.course.slug}`}
            className="hover:underline"
          >
            {data.course.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2 text-sm">
          {data.course.smallDescription}
        </CardDescription>
        <div className="space-y-4 mt-5">
          <div className="flex justify-between mb-1 text-sm">
            <p>Progress:</p>
            <p className="font-medium">{progressPrecentage}%</p>
          </div>
          <Progress value={progressPrecentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1">
            {completedLessons} of {totalLessons} lessons completed
          </p>
        </div>
        <Link
          className={buttonVariants({
            variant: "outline",
            className: "w-full",
          })}
          href={`/dashboard/${data.course.slug}`}
        >
          Learning Now!
        </Link>
      </CardContent>
    </Card>
  );
};

export default CourseProgressCard;

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
