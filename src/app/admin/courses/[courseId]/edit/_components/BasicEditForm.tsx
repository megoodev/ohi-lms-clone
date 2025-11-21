"use client";
import {
  CourseCategories,
  courseSchema,
  CourseSChemaType,
  levelCourse,
  statusCourse,
} from "@/lib/zodSchemas";

import slugify from "slugify";
import { useForm } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TextEditor from "@/components/editor/TextEditor";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, SparkleIcon } from "lucide-react";

import Uploader from "@/app/(public)/_components/image-uploader/Uploader";
import { useTransition } from "react";
// import { CreateCourse } from "./actions/action";
import { tryCatch } from "@/hooks/trycatch";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { singelurCourseType } from "../../../../../../data/admin/get-singlur-course";
import { EditCourse } from "../actions/actions";

const BasicEditForm = ({ course }: { course: singelurCourseType }) => {
  const [pending, startTransition] = useTransition();
  const form = useForm<CourseSChemaType>({
    resolver: zodResolver(courseSchema) as Resolver<CourseSChemaType>,
    mode: "all",
    defaultValues: {
      title: course.title,
      category: course.category as CourseSChemaType["category"],
      description: course.description,
      duration: Number(course.duration), // Convert to number
      level: course.level as CourseSChemaType["level"],
      fileKey: course.fileKey,
      price: Number(course.price), // Convert to number
      status: course.status as CourseSChemaType["status"],
      slug: course.slug,
      smallDescription: course.smallDescription,
    },
  });

  function onSubmit(values: CourseSChemaType) {
    startTransition(async () => {
      const { data, error } = await tryCatch(EditCourse(values, course.id));
      if (error) {
        toast.error("an unexpected error occurred,please try again");
        return;
      }
      if (data.status === "success") {
        toast.success(data.message);
        form.reset(redirect("/admin/courses"));
      } else if (data.status === "error") {
        toast.error(data.message);
      }
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center flex-rows gap-6">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input placeholder="Slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            onClick={() => {
              const titleValue = form.getValues("title");
              const slug = slugify(titleValue);
              form.setValue("slug", slug, { shouldValidate: true });
            }}
            className="mt-5"
            variant={"secondary"}
          >
            Generate Slug <SparkleIcon className="ml-1" size={16} />
          </Button>
        </div>
        <FormField
          control={form.control}
          name="smallDescription"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Small description</FormLabel>
              <FormControl>
                <Textarea
                  className="min-h-[120px]"
                  placeholder="small description"
                  {...field}
                />
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
              <FormLabel>{field.name}</FormLabel>
              <FormControl>
                <TextEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fileKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File Key</FormLabel>
              <FormControl>
                <Uploader onChange={field.onChange} value={field.value} typeAccept="image" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Price"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Duration"
                    type="number"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={field.name} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {statusCourse.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={field.name} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {CourseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Level</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={field.name} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {levelCourse.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              Editing... <Spinner />
            </>
          ) : (
            <>
              Edit Course <Pencil className="ml-1" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default BasicEditForm;
