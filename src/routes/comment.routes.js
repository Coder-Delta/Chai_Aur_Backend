import { Router } from "express";
import {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();

/* -------- PUBLIC -------- */
router.get("/:videoId", getVideoComments);

/* -------- PROTECTED -------- */
router.post("/:videoId", verifyJWT, addComment);
router.patch("/c/:commentId", verifyJWT, updateComment);
router.delete("/c/:commentId", verifyJWT, deleteComment);

export default router;