import { GetCourseSidebarDataType } from "@/data/course/get-course-sidebar-data";
import { EnrolledCoursesType } from "@/data/course/get-enrolled-courses";
import { useMemo } from "react";

interface iAppProps {
  courseData: GetCourseSidebarDataType | EnrolledCoursesType['course'];
}
interface courseProgressResult {
  totalLessons: number;
  completedLessons: number;
  progressPrecentage: number;
}
export function useCourseProgress({
  courseData,
}: iAppProps): courseProgressResult {
  return useMemo(() => {
    let totalLessons = 0;
    let completedLessons = 0;

    courseData.chapters.forEach((chapter) => {
      chapter.lessons.forEach((lesson) => {
        totalLessons++;
        const isCompleted = lesson.lessonProgress.some(
          (progress) => progress.lessonId === lesson.id && progress.completed
        );
        if (isCompleted) {
          completedLessons++;
        }
      });
    });
    const progressPrecentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return { totalLessons, completedLessons, progressPrecentage };
  }, [courseData]);
}
