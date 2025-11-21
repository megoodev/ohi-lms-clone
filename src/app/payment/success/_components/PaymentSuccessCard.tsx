"use client";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useConfetti from "@/hooks/useConfetti";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const PaymentSuccessCard = () => {
  const { fireConfetti } = useConfetti();
  useEffect(() => {
    fireConfetti();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[325px]">
        <CardContent>
          <div className="w-full flex justify-center">
            <CheckIcon className="size-12 p-2 rounded-full bg-green-500/30 text-green-500" />
          </div>
          <div className="mt-3 text-center sm:mt-5 w-full">
            <h2 className="text-xl  font-semibold">Payment SuccessFully</h2>
            <p className="text-sm mt-2 text-muted-foreground tracking-tight text-balance"></p>
            <Link
              href="/dashboard"
              className={buttonVariants({ className: "w-full" })}
            >
              Go to Dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessCard;
