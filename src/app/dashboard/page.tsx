import { getAllcourses } from "@/data/course/get-all-courses";
import { getEnrolledCourses } from "@/data/course/get-enrolled-courses";
import EmptyState from "../admin/courses/_components/EmptyState";
import PublicCardCouese from "../(public)/courses/_components/PublicCardCouese";

import CourseProgressCard from "./_components/CourseProgressCard";
import { Separator } from "@/components/ui/separator";

const DashboardPage = async () => {
  const [enrolledCourses, courses] = await Promise.all([
    getEnrolledCourses(),
    getAllcourses(),
  ]);

  return (
    <>
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold">Enrolled Course</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to
        </p>
      </div>
      <Separator />
      {enrolledCourses.length === 0 ? (
        <>
          <EmptyState
            buttonText="Browse Courses"
            description="You haven't purchased any courses yet."
            href="/courses"
            title="No courses purchased"
          />
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 ">
          {enrolledCourses.map((enrolled) => (
            <CourseProgressCard key={enrolled.course.id} data={enrolled} />
          ))}
        </div>
      )}
      <section className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Available Course</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you can purchase
        </p>
      </section>
      <Separator />

      {courses.filter(
        (course) =>
          !enrolledCourses.some(
            ({ course: enrolled }) => course.id === enrolled.id
          )
      ).length === 0 ? (
        <div className="flex items-center justify-center flex-1">
          <EmptyState
            buttonText="Browse Courses"
            description="You are avilable all courses"
            href="/courses"
            title="aergeargadz"
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 mt-8">
          {courses
            .filter(
              (course) =>
                !enrolledCourses.some(
                  ({ course: enrolled }) => course.id === enrolled.id
                )
            )
            .map((course) => (
              <PublicCardCouese key={course.id} data={course} />
            ))}
        </div>
      )}
    </>
  );
};

export default DashboardPage;
