"use client";

import RenderDescription from "@/components/editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { GetLessonContentType } from "@/data/course/get-lesson-content";
import { tryCatch } from "@/hooks/trycatch";
import useConstructUrl from "@/hooks/use-construct-url";
import { BookIcon, CheckCircle } from "lucide-react";
import { MarkLessonComplete } from "../actions/action";
import { toast } from "sonner";
import { useState, useTransition } from "react";
import useConfetti from "@/hooks/useConfetti";
import { IconPlayerPlay } from "@tabler/icons-react";
import { Spinner } from "@/components/ui/spinner";

interface iAppProps {
  data: GetLessonContentType;
}

const CourseContent = ({ data }: iAppProps) => {
  const [pending, startTransition] = useTransition();
  const { fireConfetti } = useConfetti();
  const VideoPlayer = ({
    thumbnailKey,
    videoKey,
  }: {
    thumbnailKey: string;
    videoKey: string;
  }) => {
    const VideoUrl = useConstructUrl(videoKey);
    const thumbnailUrl = useConstructUrl(thumbnailKey);

    if (!videoKey) {
      return (
        <div className="anpect-video bg-muted rounded-lg !h-80 flex items-center justify-center flex-col">
          <BookIcon className="size-16 text-primary mx-auto mb-4" />
          <p>This Lesson does not have a Video yet</p>
        </div>
      );
    }
    
    return (
      <div className="aspect-video bg-black rounded-lg relative overflow-hidden">

        <video
          autoPlay
          className="w-full h-fit object-cover"
          controls
          poster={thumbnailKey ? thumbnailUrl : ""}
        >
          <source src={VideoUrl} type="video/mp4" />
          <source src={VideoUrl} type="video/webm" />
          <source src={VideoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  };
  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        MarkLessonComplete(data.id, data.chapter.course.slug)
      );
      if (error) {
        toast.error("an unexpected error occurred,please try again");
        return;
      }
      if (result.status === "success") {
        toast.success(result.message);
        fireConfetti();
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        videoKey={data.videoKey ?? ""}
        thumbnailKey={data.thumbnilKey ?? ""}
      />
      <div className="py-4 border-b">
        {data.lessonProgress.length > 0 ? (
          <>
            <Button
              className="bg-green-500/10 text-green-500"
              variant="outline"
            >
              <CheckCircle className="size-4 mr-2 text-green-500" />
              Completed
            </Button>
          </>
        ) : (
          <>
            <Button variant="outline" onClick={onSubmit}>
              <CheckCircle className="size-4 mr-2 text-green-500" />
              {pending ? "Loading..." : "Mark as complete"}
            </Button>
          </>
        )}
      </div>
      <div className="pt-3 space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
};

export default CourseContent;
