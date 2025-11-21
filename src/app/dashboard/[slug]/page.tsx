import { GetCourseSidebarData } from "@/data/course/get-course-sidebar-data";
import { redirect } from "next/navigation";

interface iAppProps {
  params: Promise<{ slug: string }>;
}
const DashboardSulgPage = async ({ params }: iAppProps) => {
  const { slug } = await params;
  const course = await GetCourseSidebarData(slug);
  const firstChapter = course.chapters[0];
  const firstLesson = firstChapter.lessons[0];
  if (firstLesson) {
    redirect(`/dashboard/${slug}/${firstLesson.id}`);
  }
  return <div className="flex items-center justify-center h-full text-center">
    <h2 className="text-2xl font-bold mb-2">No lessins available</h2>
    <p className="text-muted-foreground">This course does not have any lessons yet!</p>
  </div>;
};

export default DashboardSulgPage;

export async function generateMetadata({ params }: iAppProps) {
  const { slug } = await params;
  const course = await GetCourseSidebarData(slug);
  return {
    title: `Dashboard — ${course.title} — LMS`,
    description: `Course dashboard for ${course.title}`,
  };
}
