import { GetCourseSidebarData } from "@/data/course/get-course-sidebar-data";
import { ReactNode } from "react";
import CourseSidebar from "./_Components/CourseSidebar";

interface iAppProps {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}
export default async function layoutSlug({ children, params }: iAppProps) {
  const { slug } = await params;
  const course = await GetCourseSidebarData(slug);

  return (
    <div className="flex flex-1">
      <div className="w-80  border-r border-border shrink-0 min-h-screen">
        <CourseSidebar course={course} />
      </div>
      <div className="flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
