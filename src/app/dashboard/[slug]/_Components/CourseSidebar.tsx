"use client";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { GetCourseSidebarDataType } from "@/data/course/get-course-sidebar-data";
import { IconPlayerPlay } from "@tabler/icons-react";
import { ChevronDown } from "lucide-react";
import React from "react";
import LessonItem from "./LessonItem";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface iAppProps {
  course: GetCourseSidebarDataType;
}
const CourseSidebar = ({ course }: iAppProps) => {
  const pathname = usePathname();
  const currentLessonId = pathname.split("/").pop();
  const { completedLessons, totalLessons, progressPrecentage } =
    useCourseProgress({
      courseData: course,
    });
  return (
    <div className="flex flex-col h-full">
      <div className="pb-4 pr-4 border-b border-border flex items-center gap-3 justify-start">
        <div className="flex items-center gap-3">
          <div className="size-10 rounde-lg bg-primary/10 flex items-center justify-center shrink-0">
            <IconPlayerPlay className="size-5 text-primary" />
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="leading-tight truncate text-base font-semibold">
            {course.title}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {course.category}
          </p>
        </div>
      </div>
      <div className="space-y-2 p-2">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-medium">
            {completedLessons} / {totalLessons} lessons
          </span>
        </div>
        <Progress value={progressPrecentage} className="h-1.5" />
        <p className="text-xs">{progressPrecentage}% completed</p>
      </div>
      <div className="space-y-3 py-4 pr-4">
        {course.chapters.map((chapter) => (
          <Collapsible key={chapter.id} defaultOpen={chapter.position === 1}>
            <CollapsibleTrigger asChild>
              <Button
                className="w-full flex items-center gap-2 h-auto p-3"
                variant="secondary"
              >
                <div className="shrink-0">
                  <ChevronDown className="size-4 text-primary" />
                </div>

                <div className="flex-1 text-left min-w-0">
                  <p className="font-semibold text-sm truncate text-foreground">
                    {chapter.position} : {chapter.title}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-medium truncate">
                    {chapter.lessons.length} lessons
                  </p>
                </div>
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-3 pl-6 border-l-2 space-y-3">
              {chapter.lessons.map((lesson) => (
                <LessonItem
                  completed={
                    lesson.lessonProgress.find(
                      (progress) => progress.lessonId === lesson.id
                    )?.completed || false
                  }
                  key={lesson.id}
                  slug={course.slug}
                  isActive={lesson.id === currentLessonId}
                  lesson={lesson}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
};

export default CourseSidebar;
