import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BasicEditForm from "./_components/BasicEditForm";
import getSingelurCourse from "../../../../../data/admin/get-singlur-course";
import CourseStrucutre from "./_components/CourseStrucutre";

type Params = Promise<{ courseId: string }>;
const page = async ({ params }: { params: Params }) => {
  const { courseId } = await params;

  const data = await getSingelurCourse(courseId);
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">
        Edit course:{" "}
        <span className="underline  text-primary">{data.title}</span>
      </h1>
      <Tabs defaultValue="basic-info">
        <TabsList className="w-full">
          <TabsTrigger value="basic-info">Basic information</TabsTrigger>
          <TabsTrigger value="course-strucutre">Course Strucutre</TabsTrigger>
        </TabsList>
        <TabsContent value="basic-info">
          <Card>
            <CardHeader>
              <CardTitle>Basic info</CardTitle>
              <CardDescription>
                Provide basic information about the course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <BasicEditForm course={data} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="course-strucutre">
          <Card>
            <CardHeader>
              <CardTitle>Course strucutre</CardTitle>
              <CardDescription>
                Provide basic information about the course
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CourseStrucutre data={data} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default page;

export async function generateMetadata({ params }: { params: Params }) {
  const { courseId } = await params;
  const data = await getSingelurCourse(courseId);
  return {
    title: `Edit ${data.title} — LMS`,
    description: `Edit course ${data.title}`,
  };
}
