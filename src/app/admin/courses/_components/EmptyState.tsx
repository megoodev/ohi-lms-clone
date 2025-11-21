import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Ban } from "lucide-react";
import Link from "next/link";

interface iAppProps {
  title: string;
  description: string;
  buttonText: string;
  href: string;
}
const EmptyState = ({ title, description, buttonText, href }: iAppProps) => {
  return (
    <Card className="animate-in fade-in-50 w-full rounded-md border-dashed p-8 text-center">
      <CardContent className="flex flex-col flex-1 items-center justify-center space-y-2">
        <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 ">
          <Ban className="size-10 text-primary" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold">{title}</h2>
        <p className="mb-8 text-center text-sm leading-tight text-muted-foreground">
          {description}
        </p>
        <Link className={buttonVariants({ variant: "outline" })} href={href}>
          {buttonText}
        </Link>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
