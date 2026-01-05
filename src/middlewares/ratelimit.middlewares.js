import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // max requests per IP
  standardHeaders: true,
  legacyHeaders: false,
});
