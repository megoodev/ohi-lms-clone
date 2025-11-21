"use client";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/trycatch";
import React, { useTransition } from "react";
import { enrollmentCourseAction } from "../actions/action";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { redirect } from "next/navigation";

const EnrollmentButton = ({ courseId }: { courseId: string }) => {
  const [pending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const { data, error } = await tryCatch(enrollmentCourseAction(courseId));
      if (error) {
        toast.error("an unexpected error occurred,please try again");
        return;
      }
      if (data.status === "success") {
        redirect(`/payment/success`);
        toast.success(data.message);
      } else if (data.status === "error") {
        toast.error(data.message);
      }
    });
  }
  return (
    <Button onClick={onSubmit} disabled={pending} className="w-full">
      {pending ? (
        <>
          <Spinner />
          Loading ...
        </>
      ) : (
        "Enroll Now!"
      )}
    </Button>
  );
};

export default EnrollmentButton;
