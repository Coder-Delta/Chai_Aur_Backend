import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // only 5 attempts
  message: {
    error: "Too many login attempts. Try again later.",
  },
});