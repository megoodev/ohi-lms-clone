import RenderDescription from "@/components/editor/RenderDescription";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { getIndividualCourse } from "@/data/course/get-course";
import {
  IconBook2,
  IconCategory,
  IconChartArrowsVertical,
  IconChartBar,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { CheckIcon, ChevronDown } from "lucide-react";
import Image from "next/image";
import EnrollmentButton from "./_components/EnrollmentButton";
import { checkIfCourseBought } from "@/data/user/user-is-enrolled";
import Link from "next/link";

type Params = Promise<{ slug: string }>;

const slugRoute = async ({ params }: { params: Params }) => {
  const { slug } = await params;
  const course = await getIndividualCourse(slug || "");
  const isEnrolled = await checkIfCourseBought(course.id);
    
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 my-12">
      <div className="order-1 lg:col-span-2 ">
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            priority
            fill
            className="object-cover"
            alt="thambnail-url"
            src={`https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${course.fileKey}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        </div>
        <div className="mt-8 space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              {course.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed line-clamp-2">
              {course.smallDescription}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <Badge className="flex items-center gap-1 px-3 py-1">
              <IconChartBar className="size-4" />
              <span>{course.level}</span>
            </Badge>
            <Badge>
              <IconClock className="size-4" />
              <span>{course.duration} hours</span>
            </Badge>
            <Badge>
              <IconCategory className="size-4" />
              <span>{course.category}</span>
            </Badge>
          </div>
          <Separator className="my-6" />
          <div className="space-y-4">
            <h2 className="text-3xl font-semibold reacking-tight">
              Course Description
            </h2>
            <RenderDescription json={JSON.parse(course.description)} />
          </div>
        </div>
        <div className="mt-12 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-semibold reacking-tight">
              Course Content
            </h2>
            <div>
              {course.chapters.length} Chapters |{" "}
              {course.chapters.reduce(
                (total, chapter) => total + chapter.lessons.length,
                0
              ) || 0}{" "}
              Lessons
            </div>
          </div>
          <div className="space-y-12">
            {course.chapters.map((chapter, index) => (
              <Collapsible key={index} defaultOpen={index == 0}>
                <Card className="p-0 gap-0 border-2 overflow-hidden transition-all duration-200 hover:shadow-md">
                  <CollapsibleTrigger>
                    <div>
                      <CardContent className="p-6 hover:bg-muted/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <p className="flex items-center justify-center bg-primary/10 rounded-full leading-tight size-8 text-primary font-semibold">
                              {index + 1}
                            </p>
                            <div className="">
                              <h3 className="text-xl font-semibold text-left">
                                {chapter.title}
                              </h3>
                              <p className="text-xs text-muted-foreground mt-1 text-left">
                                {chapter.lessons.length} lesson
                                {chapter.lessons.length > 1 ? "s" : ""}
                              </p>
                            </div>
                          </div>
                          <div className=" flex gap-3 items-center ">
                            <Badge variant="outline" className="text-xs">
                              {" "}
                              {chapter.lessons.length} lesson
                              {chapter.lessons.length > 1 ? "s" : ""}{" "}
                            </Badge>
                            <ChevronDown />
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t bg-muted/20">
                      <div className="p-6 pt-6 space-y-3">
                        {chapter.lessons.map((lesson, index) => (
                          <div
                            key={index}
                            className="flex gap-4 rounded-lg p-3 hover:bg-accent transition-colors items-center "
                          >
                            <div className="flex items-center justify-center size-8 rounded-full bg-background border-2 border-primary/20">
                              <IconPlayerPlay className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                            </div>
                            <div className="flex-1">
                              <h3>{lesson.title}</h3>
                              lesson {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
      <div className="col-span-1 order-2">
        <div className="sticky top-20">
          <Card className="py-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-medium">Price:</span>
                <span className="text-2xl font-bold text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(course.price)}
                </span>
              </div>
              <div className="mb-6 space-y-3 rounded-lg bg-muted p-4">
                <h4 className="font-medium">what you will get:</h4>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconClock className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Course Duration</p>
                      <p className="text-sm text-muted-foreground">
                        {course.duration} hours
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconChartArrowsVertical className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Difficulty Level</p>
                      <p className="text-sm text-muted-foreground">
                        {course.level}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconCategory className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Category</p>
                      <p className="text-sm text-muted-foreground">
                        {course.category}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <IconBook2 className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Total lessons</p>
                      <p className="text-sm text-muted-foreground">
                        {course.chapters.reduce(
                          (total, chapter) => total + chapter.lessons.length,
                          0
                        ) || 0}{" "}
                        Lessons
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6 space-y-3">
                <h4 className="font-medium">This course include:</h4>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2  text-sm">
                    <div className="rounded-full p-1 bg-primary/10 text-green-500">
                      <CheckIcon className="size-4" />
                    </div>
                    <span>Full lifetime access</span>
                  </li>
                  <li className="flex items-center gap-2  text-sm">
                    <div className="rounded-full p-1 bg-primary/10 text-green-500">
                      <CheckIcon className="size-4" />
                    </div>
                    <span>Access on mobile and desktop</span>
                  </li>
                  <li className="flex items-center gap-2  text-sm">
                    <div className="rounded-full p-1 bg-primary/10 text-green-500">
                      <CheckIcon className="size-4" />
                    </div>
                    <span>Certificate of completion</span>
                  </li>
                </ul>
              </div>
              {isEnrolled ? (
                <Link
                  href={`/dashboard/${course.slug}`}
                  className={buttonVariants({ className: "w-full" })}
                >
                  Watch Course
                </Link>
              ) : (
                <EnrollmentButton courseId={course.id} />
              )}

              <p className="text-muted-foreground text-center mt-1">
                30-day mony-back guarantee
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default slugRoute;

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug || "");
  return {
    title: `${course.title} — LMS`,
    description: course.smallDescription || "",
  };
}

