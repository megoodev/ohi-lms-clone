import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import arcjet, { createMiddleware, detectBot } from "@arcjet/next";

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|login|api/auth|api/upload|uploadthing|t3.storage).*)",
  ],
};

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: ["CATEGORY:SEARCH_ENGINE", "CATEGORY:MONITOR", "CATEGORY:PREVIEW",'STRIPE_WEBHOOK'],
    }),
  ],
});
 async function authMiddleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export default createMiddleware(aj, async (request: NextRequest) => {
  if (request.nextUrl.pathname.startsWith("/admin")) {
    return authMiddleware(request);
  }
  return NextResponse.next();
});




//// old middleware 

// import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth/cookies";

// export async function middleware(request: NextRequest) {
//   const sessionCookie = getSessionCookie(request);

//   // THIS IS NOT SECURE!
//   // This is the recommended approach to optimistically redirect users
//   // We recommend handling auth checks in each page/route
//   if (!sessionCookie) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/admin/:path*"], // Specify the routes the middleware applies to
// };