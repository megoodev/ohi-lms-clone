import arcjet, {
  shield,
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  slidingWindow,
} from "@arcjet/next";
import "server-only";
export {
  detectBot,
  fixedWindow,
  protectSignup,
  sensitiveInfo,
  slidingWindow,
  shield,
};

export default arcjet({
  key: process.env.ARCJET_KEY as string, // Get your site key from https://app.arcjet.com
  characteristics: ["fingerPrint"],
  rules: [
    // Protect against common attacks with Arcjet Shield. Other rules are
    // added dynamically using `withRule`.
    shield({
      mode: "LIVE", // will block requests. Use "DRY_RUN" to log only
    }),
  ],
});
