import { buttonVariants } from "@/components/ui/button";
import { adminGetCourses } from "@/data/admin/admin-get-courses";
import Link from "next/link";
import AdminCardCourse, {
  AdminCourseCardSkeleton,
} from "./_components/admin-card-course";
import EmptyState from "./_components/EmptyState";
import { Suspense } from "react";

const AdminCoursesRoute = () => {

  return (
    <>
      <div className="flex items-center justify-between my-5">
        <h1 className="text-2xl font-bold">Your Course</h1>
        <Link className={buttonVariants()} href={"/admin/courses/create"}>
          Create Course
        </Link>
      </div>
      <div>
        <Suspense fallback={<AdminCourseCardSkeletonArray />}>
          <ReanderCourse />
        </Suspense>
      </div>
    </>
  );
};

export default AdminCoursesRoute;

export const metadata = {
  title: "Admin — Courses — LMS",
  description: "Manage your courses: create, edit, and organize course content.",
};

const ReanderCourse = async () => {
  const data = await adminGetCourses();
  return (
    <div>
      {data.length === 0 ? (
        <EmptyState
          buttonText="Create New Course"
          description="I am not know"
          title="not found any course"
          href={"/admin/courses/create"}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 mt-5">
          {data.map((course) => (
            <AdminCardCourse key={course.id} data={course} />
          ))}
        </div>
      )}
    </div>
  );
};

const AdminCourseCardSkeletonArray = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
};
