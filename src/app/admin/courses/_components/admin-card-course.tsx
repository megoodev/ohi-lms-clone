import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { adminCourseType } from "@/data/admin/admin-get-courses";
import useConstructUrl from "@/hooks/use-construct-url";
import {
  Eye,
  MoreVerticalIcon,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface iAppProps {
  data: adminCourseType;
}
const AdminCardCourse = ({ data }: iAppProps) => {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  return (
    <Card className="relative py-0 gap-0 w-full group">
      <div className="absolute top-3 right-3">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="secondary" size="icon">
              <MoreVerticalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                className={"flex items-center gap-2"}
                href={`/admin/courses/${data.id}/edit`}
              >
                <Pencil />
                Edit course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link
                className={"flex items-center gap-2"}
                href={`/courses/${data.slug}`}
              >
                <Eye />
                review
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link
                className={"flex items-center gap-2"}
                href={`/admin/courses/${data.id}/delete`}
              >
                <Trash2 className="text-destructive" />
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Image src={thumbnailUrl} width={600} height={400} alt="thmbnail-url" />
      <CardContent className="p-4">
        <CardTitle className="text-2xl group-hover:text-destructive hover:text-white">
          {data.title}
        </CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2 text-sm">
          {data.smallDescription}
        </CardDescription>
        <div className="flex gap-5 items-center">
          <div className="flex items-center">
            <TimerIcon className="size-4 mr-0.5" />
            {data.duration}
          </div>
          <div className="flex items-center">
            <School className="size-4 mr-0.5" />
            {data.level}
          </div>
        </div>
        <Link
          href={`/admin/courses/${data.id}/edit`}
          className={buttonVariants({ className: "w-full my-2" })}
        >
          Edit course
        </Link>
      </CardContent>
    </Card>
  );
};

export default AdminCardCourse;

export const AdminCourseCardSkeleton = () => {
  return (
    <Card className="relative py-0 gap-0 w-full group">
      <div className="absolute top-3 right-3">
        <Skeleton className="w-9 h-9 rounded-md" />
      </div>

      <Skeleton className="w-full h-48" />

      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-7 w-3/4" />

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
