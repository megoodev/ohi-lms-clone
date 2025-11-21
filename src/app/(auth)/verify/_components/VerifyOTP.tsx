"use client";
import { useState, useTransition } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter} from "next/navigation";

const VerifyOTP = ({email}: {email: string}) => {
  const [OTpPending, StartOTPTranstion] = useTransition();
  const [otp, setOtp] = useState("");
  const router = useRouter();
  console.log(email);
  console.log(otp);
  async function checkOTP() {
    StartOTPTranstion(async () => {
      await authClient.emailOtp.verifyEmail({
        email: email,
        otp: otp,
        fetchOptions: {
          onSuccess: () => {
            toast.success("verified successfully");
            router.push("/");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Please check your email</CardTitle>
        <CardDescription>
          we have sent a verification email code to your email address please
          open the email and paste the code below
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center">
          <InputOTP
            value={otp}
            onChange={(value: string) => setOtp(value)}
            className="mx-auto gap-2"
            maxLength={6}
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button
          onClick={checkOTP}
          disabled={otp.length !== 6 || OTpPending}
          className="mt-5 w-full"
        >
          Verify Email
        </Button>
      </CardContent>
    </Card>
  );
};

export default VerifyOTP;
