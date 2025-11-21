"use client";
import { ReactNode, useEffect, useState } from "react";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DraggableSyntheticListeners,
  rectIntersection,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { singelurCourseType } from "@/data/admin/get-singlur-course";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { Card } from "@/components/ui/card";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderLessons, ReordingChapters } from "../actions/actions";
import { Separator } from "@/components/ui/separator";
import NewChapterModal from "./NewChapterModal";
import NewLessonModal from "./NewLessonModal";
import DeleteChapterModal from "./DeleteChapterModal";
import DeleteLessonModal from "./DeleteLessonModal";

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  data: {
    type: "chapter" | "lesson";
    chapteId?: string;
  };
  className?: string;
}

const CourseStrucutre = ({ data }: { data: singelurCourseType }) => {
  const inaitialState =
    data?.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      order: chapter.position,
      isOpen: true,
      lessons: chapter.lessons?.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.position,
      })),
    })) || [];
  const [items, setItems] = useState(inaitialState);

  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems = data?.chapters.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        order: chapter.position,
        isOpen:
          prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true,
        lessons: chapter.lessons?.map((lesson) => ({
          id: lesson.id,
          title: lesson.title,
          order: lesson.position,
        })),
      }));
      return updatedItems;
    });
  }, [data]);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || over.id === active.id) {
      return;
    }
    const activeId = active.id;
    const overId = over.id;
    const overType = over.data.current?.type as "chapter" | "lesson";
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;
    if (activeType === "chapter") {
      let targetChapterId = null;
      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }
      if (!targetChapterId) {
        toast.error("could not datermine the chapter for reordaring");
        return;
      }
      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);
      if (oldIndex === -1 || newIndex === -1) {
        toast.error("could not found chapter old/new index for reordaring");
        return;
      }
      const reordedLocalChapter = arrayMove(items, oldIndex, newIndex);
      const updateChapterForState = reordedLocalChapter.map(
        (chapter, index) => ({
          ...chapter,
          order: index + 1,
        })
      );
      const previousItems = [...items];
      setItems(updateChapterForState);
      if (courseId) {
        const chaptersToUpdate = updateChapterForState.map((chapter) => ({
          id: chapter.id,
          position: chapter.order,
        }));
        const reorderchaptersPromise = ReordingChapters(
          courseId,
          chaptersToUpdate
        );
        toast.promise(reorderchaptersPromise, {
          loading: "Reordring Chapters...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error("Failed to reordring chapters");
          },
          error: () => {
            setItems(previousItems);
            return "Failed to ordring chapters";
          },
        });
      }
    }
    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = active.data.current?.chapteId ?? null;
      const overChapterId = over.data.current?.chapteId ?? null;

      if (!chapterId || chapterId !== overChapterId) {
        toast.error(
          "lesson move between diffrante chaptes or invalid chapter Id is not allowed"
        );
        return;
      }
      const chapterIndex = items.findIndex(
        (chapter) => chapter.id === chapterId
      );
      if (chapterId === -1) {
        toast.error("could not find chapter for lesson");
        return;
      }
      const chapterToUpdate = items[chapterIndex];

      const oldIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === activeId
      );
      const newIndex = chapterToUpdate.lessons.findIndex(
        (lesson) => lesson.id === overId
      );
      if (newIndex === -1 || oldIndex === -1) {
        toast.error("could not find lesson for reordring");
        return;
      }
      const reordedLessons = arrayMove(
        chapterToUpdate.lessons,
        oldIndex,
        newIndex
      );
      const updatedLessonForState = reordedLessons.map((lesson, index) => ({
        ...lesson,
        order: index + 1,
      }));
      const newItems = [...items];
      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lessons: updatedLessonForState,
      };
      const previousItems = [...items];
      setItems(newItems);
      if (courseId) {
        const lessonsToUpdate = updatedLessonForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.order,
        }));
        const reorderLessonsPromise = reorderLessons(
          chapterId,
          lessonsToUpdate,
          courseId
        );
        toast.promise(reorderLessonsPromise, {
          loading: "Reordring Lessons...",
          success: (result) => {
            if (result.status === "success") return result.message;
            throw new Error(result.message);
          },
          error: () => {
            setItems(previousItems);
            return "Failed to ordring lessons";
          },
        });
      }
    }
  }

  function SortableItem({ children, data, id, className }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: id, data: data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }
  const toggleChapter = (id: string) => {
    setItems(
      items.map((chapter) =>
        chapter.id === id ? { ...chapter, isOpen: !chapter.isOpen } : chapter
      )
    );
  };
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Chapters</h1>
        <NewChapterModal courseId={data.id} />
      </div>
      <Separator className="my-3" />
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items} strategy={verticalListSortingStrategy}>
          {items.map((chapter) => (
            <SortableItem
              className="mb-3"
              data={{ type: "chapter", chapteId: chapter.id }}
              id={chapter.id}
              key={chapter.id}
            >
              {(listeners) => (
                <Card className="p-2">
                  <Collapsible
                    open={chapter.isOpen}
                    onOpenChange={() => toggleChapter(chapter.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="cursor-grap opacity-60 hover:opacity-100"
                          {...listeners}
                        >
                          <GripVertical />
                        </Button>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="icon">
                            {chapter.isOpen ? (
                              <ChevronDown className="size-4" />
                            ) : (
                              <ChevronRight className="size-4" />
                            )}
                          </Button>
                        </CollapsibleTrigger>
                        <p>{chapter.title}</p>
                      </div>
                      <DeleteChapterModal
                        chapterId={chapter.id}
                        courseId={data.id}
                      />
                    </div>
                    <Separator className="my-2" />
                    <CollapsibleContent>
                      <SortableContext
                        items={chapter.lessons.map((lesson) => lesson.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {chapter.lessons.map((lesson) => (
                          <SortableItem
                            key={lesson.id}
                            className="mb-3"
                            data={{ type: "lesson", chapteId: chapter.id }}
                            id={lesson.id}
                          >
                            {(lessonListeners) => (
                              <div className="flex justify-between items-center p-2 hover:bg-accent rounded-sm">
                                <div className="flex items-center gap-2">
                                  <Button
                                    size="icon"
                                    variant="ghost"
                                    {...lessonListeners}
                                  >
                                    <GripVertical className="size-4" />
                                  </Button>
                                  <FileText className="size-4" />
                                  <Link
                                    href={`/admin/courses/${data.id}/${chapter.id}/${lesson.id}`}
                                  >
                                    {lesson.title}
                                  </Link>
                                </div>
                                <DeleteLessonModal
                                  chapterId={chapter.id}
                                  courseId={data.id}
                                  lessonId={lesson.id}
                                />
                              </div>
                            )}
                          </SortableItem>
                        ))}
                      </SortableContext>
                    </CollapsibleContent>
                  </Collapsible>
                  <NewLessonModal courseId={data.id} chapterId={chapter.id} />
                </Card>
              )}
            </SortableItem>
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default CourseStrucutre;
