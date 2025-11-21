import PublicCardCouese, {
  PublicCourseCardSkeleton,
} from "./_components/PublicCardCouese";
import { Suspense } from "react";
import { getAllcourses } from "@/data/course/get-all-courses";

export const metadata = {
  title: "Courses — LMS",
  description: "Explore available courses across categories and skill levels.",
};

export default function PublicCourseRoute() {
  return (
    <div className="mt-2 px-2">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold">Explore Courses</h1>
        <p className=" text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your
          learning goals.
        </p>
      </div>
      <Suspense fallback={<PublicCourseCardSkeletonArray />}>
        <RenderCourse />
      </Suspense>
    </div>
  );
}



const RenderCourse = async () => {
  const data = await getAllcourses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-3">
      {data.map((course) => (
        <PublicCardCouese key={course.id} data={course} />
      ))}
    </div>
  );
};

const PublicCourseCardSkeletonArray = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
};
