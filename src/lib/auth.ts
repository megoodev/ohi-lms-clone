import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./db";
import { Resend } from "resend";
import { admin, emailOTP } from "better-auth/plugins";
const resend = new Resend(process.env.RESEND_API_KEY);
export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp }) {
        await resend.emails.send({
          from: "LMS <onboarding@resend.dev>",
          to: [email],
          subject: "lms - verify your email",
          html: `<p>Your OTP is <Strong>${otp}</Strong></p>`,
        });
      },
    }),
    admin(),
  ],
});
