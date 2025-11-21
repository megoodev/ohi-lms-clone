import { getLessonContent } from "@/data/course/get-lesson-content";
import React, { Suspense } from "react";
import CourseContent from "./_components/CourseContent";
import LessonSkeleton from "./_components/LessonSkeleton";
interface iAppProps {
  params: Promise<{ lessonId: string }>;
}
const LessonRoute = async ({ params }: iAppProps) => {
  const { lessonId } = await params;
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContentData lessonId={lessonId} />;
    </Suspense>
  );
};

export default LessonRoute;

async function LessonContentData({ lessonId }: { lessonId: string }) {
  const data = await getLessonContent(lessonId);
  return <CourseContent data={data} />;
}

export async function generateMetadata({ params }: iAppProps) {
  const { lessonId } = await params;
  const data = await getLessonContent(lessonId);
  return {
    title: `${data.title} — Lesson — LMS`,
    description: data.description ?? "",
  };
}
