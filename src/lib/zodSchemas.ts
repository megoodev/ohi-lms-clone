import { z } from "zod";
export const levelCourse = ["Beginner", "Intermeduate", "Advanced"] as const;
export const statusCourse = ["Draft", "Published", "Archived"] as const;
export const CourseCategories = [
  "Devolepment",
  "Business",
  "Finance",
  "It & Softwere",
  "Office Producivity",
  "Design",
  "Markting",
  "Music",
  "Health & Fitness",
  "Teaching & Academics",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters long" })
    .max(300, { message: "Description must be most 300 characters long" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small description must be at least 3 characters" })
    .max(100, { message: "Description must be most 100 characters long" }),
  fileKey: z.string().min(1, { message: "File is required" }),
  slug: z.string().min(1, { message: "Slug is required" }),
  price: z.coerce
    .number()
    .min(1, { message: "Price must be a positive number" }),
  duration: z.coerce
    .number()
    .min(1, { message: "Duration must be at least 1 hour" })
    .max(500, { message: "Duration must be at most 500 hour" }),
  category: z.enum(CourseCategories, { message: "Category is required" }),
  level: z.enum(levelCourse, { message: "Level is required" }),
  status: z.enum(statusCourse, { message: "Status is required" }),
});

export const chapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  courseId: z.string().uuid({ message: "invalid course id" }),
});

export const lessonSchema = z.object({
  id: z.string().uuid({ message: "invalid lesson id" }).optional(),
  courseId: z.string().uuid({ message: "invalid course id" }),
  chapterId: z.string().uuid({ message: "invalid course id" }),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
  videoKey: z.string().optional(),
  thumbnilKey: z.string().optional(),
  description: z.string().optional(),
});

export type CourseSChemaType = z.infer<typeof courseSchema>;
export type LessonSchemaType = z.infer<typeof lessonSchema>;
export type ChapterSchemaType = z.infer<typeof chapterSchema>;
