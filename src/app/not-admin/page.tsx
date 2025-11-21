import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, ShieldX } from "lucide-react";
import Link from "next/link";

const NotAdminPAge = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="max-w-md w-full ">
        <CardHeader className="text-center">
          <div className="bg-destructive/10 rounded-full mx-auto p-4 w-fit">
            <ShieldX className="size-16 text-destructive " />
          </div>
          <CardTitle className="text-2xl">access restricted</CardTitle>
          <CardDescription className="max-w-xs mx-auto">
            Hey! you are not admin,which means you cant create any course or
            stuff like that...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link
            href={"/"}
            className={buttonVariants({
              className: "w-full",
            })}
          >
            <ArrowLeft className="mr-1 size-4"/>
            Back to home
          </Link>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotAdminPAge;

export const metadata = {
  title: "Access Restricted — LMS",
  description: "You do not have the required permissions to access this page.",
};
