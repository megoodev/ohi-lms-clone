import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  type FeatureType = { title: string; description: string; icon: string };
  const features: FeatureType[] = [
    {
      title: "Comprehensive Courses",
      description:
        "Access a wide range of carefully curated courses designed  by industry experts.",
      icon: "📚",
    },
    {
      title: "Interactive learning",
      description:
        "Engage with interactive content , quizzes,and assignment to enhance your learning experience.",
      icon: "🎮",
    },
    {
      title: "Progress tracking",
      description:
        "Monitor your progress and achievements with detailed  analytics and  presonalized dashboard.",
      icon: "🧮",
    },
    {
      title: "Community Support",
      description:
        "Join a vibrant Community to learners and instructors to collaborate and share knowledge",
      icon: "👥",
    },
  ];
  return (
    <>
      <section className="py-18">
        <div className="flex items-center flex-col gap-8 text-center">
          <Badge variant={"outline"}>The Future of Online eduction</Badge>
          <h1 className="text-6xl font-bold">
            Elevate your Learning Exprerience{" "}
          </h1>
          <p className="max-w-[570px] text-muted-foreground space-x-1.5">
            Discover a new way to learn with our modern, interactive learning
            management system. Access high-quality courses anytime, anywhere
          </p>
          <div className="flex gap-5">
            <Link href={"/courses"} className={buttonVariants({ size: "lg" })}>
              Explore Courses
            </Link>
            <Link
              href={"/login"}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow text-center    ">
            <CardHeader>
              <div className="text-4xl mb-4">{feature.icon}</div>
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>
    </>
  );
}

export const metadata = {
  title: "LMS — Home",
  description: "Discover courses and start learning with LMS.",
};
