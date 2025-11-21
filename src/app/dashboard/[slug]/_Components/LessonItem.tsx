import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconCheck } from "@tabler/icons-react";
import { Play } from "lucide-react";
import Link from "next/link";
interface iAppProps {
  slug: string;
  isActive?: boolean;
  completed: boolean;
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
}
const LessonItem = ({completed, slug, lesson, isActive }: iAppProps) => {
  return (
    <Link
      className={buttonVariants({
        variant: completed ? "secondary" : "outline",
        className: cn(
          "w-full p-2.5 h-auto justify-start transition-all",
          completed &&
            "bg-green-100 dark:bg-green-800/30 dark:border-green-700 hover:border-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200",
          isActive &&
            !completed &&
            "bg-primary/10 dark:bg-primary/20 border-primar/50 hover:bg-primary/20 dark:hover:bg-primary/30  text-primary"
        ),
      })}
      href={`/dashboard/${slug}/${lesson.id}`}
    >
      <div className="flex items-center gap-2.5 w-full min-w-0">
        <div className="shrink-0">
          {completed ? (
            <div
              className={cn(
                "size-5 rounded-full bg-green-600 dark:bg-green-500 flex items-center justify-center"
              )}
            >
              <IconCheck className={cn("size-2.4")} />
            </div>
          ) : (
            <div
              className={cn(
                "size-5 rounded-full bg-background flex items-center justify-center",
                isActive
                  ? "border-primary bg-primary/10 dark:bg-primary/20"
                  : " border-muted-foreground/60"
              )}
            >
              <Play
                className={cn(
                  "size-2",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
            </div>
          )}
        </div>
        <div className="flex-1  text-left min-w-0 ">
          <p
            className={cn(
              "text-xs font-medium truncate",
              completed
                ? "text-green-800 dark:text-green-200"
                : isActive
                ? "text-primary font-semibold"
                : "text-foreground"
            )}
          >
            {lesson.position}. {lesson.title}
          </p>
          {completed && (
            <p className="text-[10px] text-green-700 dark:text-green-300 font-medium">
              Completed
            </p>
          )}
          {isActive && !completed && (
            <p className="text-[10px] text-primary font-medium">
              Currently Watching
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default LessonItem;
