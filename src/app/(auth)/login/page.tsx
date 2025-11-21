"use client";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { GithubIcon, Loader, Send } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const LoginPage = () => {
  const [githubPending, startGithubTranstion] = useTransition();
  const [emailPending, startEmailTranstion] = useTransition();
  const [email, setEmail]= useState('')
  const router = useRouter()
  async function signinwithGitHub() {
    startGithubTranstion(async () => {
      await authClient.signIn.social({
        provider: "github",
        callbackURL: "/",
        fetchOptions: {
          onSuccess: () => {
            toast.success("Login successful");
          },
          onError: (error) => {
            toast.error(error.error.message);
          },
        },
      });
    });
  }
  async function signinWithEmail(){
    startEmailTranstion(async ()=> {
      await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "email-verification",
        fetchOptions: {
          onSuccess: () => {
            toast.success("email sent");
            router.push(`/verify?email=${email}`);
          },
          onError: () => {
            toast.error("error sending email ");
          },
        }
      });
    })
  }
  return (
    <Card className="space-y-4">
      <CardHeader>
        <CardTitle>
          <h1 className="text-xl font-semibold">Welcome Back!</h1>
        </CardTitle>
        <CardDescription>
          {" "}
          <p className="text-sm text-gray-500">
            Login with your GitHub or email account
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={githubPending}
          onClick={() => signinwithGitHub()}
          variant={"outline"}
          className="w-full p-2 text-sm"
        >
          {githubPending ? (
            <>
              <Loader className="animate-spin size-4" />
              <span>Loading...</span>
            </>
          ) : (
            <>
              <GithubIcon />
              SignIn With GitHub
            </>
          )}
        </Button>
        <div className="my-5 relative">
          <hr className="bg-accent" />
          <p className="absolute -top-3 w-full text-center">
            <span className="bg-transparent p-0.5 font-bold text-gray-300">
              Or continue with
            </span>
          </p>
        </div>
        <form className="space-y-5">
          <Label htmlFor="email" className="text-md font-medium">
            Email
          </Label>
          <Input
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            placeholder="m@example.com"
            type="email"
            required
          />
        </form>
        <Button
          disabled={emailPending}
          className="w-full mt-5"
          onClick={signinWithEmail}
      
        >
          {emailPending ? (
            <>
              <Loader className="size-4 animate-spin" /> <span>Loading...</span>
            </>
          ) : (
            <>
              <Send />
              Continue with email
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
