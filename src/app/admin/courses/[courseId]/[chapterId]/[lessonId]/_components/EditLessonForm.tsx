"use client";
import { adminLessonType } from "@/data/admin/Admin-get-lesson";
import { lessonSchema, LessonSchemaType } from "@/lib/zodSchemas";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import TextEditor from "@/components/editor/TextEditor";
import Uploader from "@/app/(public)/_components/image-uploader/Uploader";
import { Button } from "@/components/ui/button";
import { EditLesson } from "../actions/action";
import { tryCatch } from "@/hooks/trycatch";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { redirect } from "next/navigation";

const EditLessonForm = ({
  data,
  courseId,
  chapterId,
}: {
  data: adminLessonType;
  courseId: string;
  chapterId: string;
}) => {
  const [pending, startTransition] = useTransition();
  const form = useForm<LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    mode: "all",
    defaultValues: {
      id: data.id,
      name: data.title,
      courseId: courseId,
      chapterId: chapterId,
      videoKey: data.videoKey as string,
      thumbnilKey: data.thumbnilKey as string,
      description: data.description as string,
    },
  });

  function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data, error } = await tryCatch(EditLesson(values));
      if (error) {
        toast.error("an unexpected error occurred,please try again");
        return;
      }
      if (data.status === "success") {
        toast.success(data.message);
        redirect(`/admin/courses/${courseId}/edit`);
      } else if (data.status === "error") {
        toast.error(data.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-6 mt-6" onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <TextEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="thumbnilKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Thumbnil image</FormLabel>
              <FormControl>
                <Uploader
                  typeAccept="image"
                  onChange={field.onChange}
                  value={field.value as string}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="videoKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Video</FormLabel>
              <FormControl className="overflow-hidden">
                <Uploader
                  typeAccept="video"
                  onChange={field.onChange}
                  value={field.value as string}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              Saving... <Spinner />
            </>
          ) : (
            <>Save</>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default EditLessonForm;
