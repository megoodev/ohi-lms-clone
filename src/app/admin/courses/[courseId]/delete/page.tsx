"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useTransition } from "react";
import { tryCatch } from "@/hooks/trycatch";
import { toast } from "sonner";
import { DeleteCourse } from "./actions/action";
import { redirect, useParams } from "next/navigation";

const DeleteCourseRoute = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [pending, startTransition] = useTransition();


  function onSubmit() {
    startTransition(async () => {
      const { data, error } = await tryCatch(DeleteCourse(courseId));
      if (error) {
        toast.error("an unexpected error occurred,please try again");
        return;
      }
      if (data.status === "success") {
        toast.success(data.message);
        redirect('/admin/courses')
      } else if (data.status === "error") {
        toast.error(data.message);
      }
    });
  }
  return (
    <div className="max-w-xl mx-auto w-full mt-50">
      <Card>
        <CardHeader>
          <CardTitle>Are you sure you want to delete this course?</CardTitle>
          <CardDescription>This action cannot be undone.</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-between">
          <Link
            href={`/admin/courses`}
            className={buttonVariants({ variant: "outline" })}
          >
            Cancel
          </Link>
          <Button variant="destructive" disabled={pending} onClick={onSubmit}>
            {pending ? 'Deleteing...' : 'Delete'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeleteCourseRoute;

