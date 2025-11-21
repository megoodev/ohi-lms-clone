import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <Link
        className={`absolute top-5 left-5 ${buttonVariants({
          size: "lg",
          variant: "secondary",
        })}`}
        href={"/"}
      >
        <ArrowLeft /> Back
      </Link>
      <div className="mt-20 flex items-center flex-row justify-center gap-2">
        <Image src="/logo.png" alt="Marshal LMS" width={40} height={40} />
        <h1 className="text-2xl font-bold">Marshal LMS</h1>
      </div>

      <div className="max-w-sm mx-auto mt-10  w-full">
        {children}
      </div>
      <p className="text-center max-w-sm mx-auto mt-5 text-sm text-gray-500">
        By continuing, you agree to our{" "}
        <Link className="text-primary" href={"/terms"}>
          Terms of Service
        </Link>{" "}
        and acknowledge that you have read our{" "}
      </p>
    </>
  );
};

export default layout;
