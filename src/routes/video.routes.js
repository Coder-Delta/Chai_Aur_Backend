import { Router } from "express";
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
} from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";

const router = Router();

/* PUBLIC ROUTES */
router.route("/")
    .get(getAllVideos);

router.route("/:videoId")
    .get(getVideoById);

/* PROTECTED ROUTES */
router.route("/")
    .post(
        verifyJWT,
        upload.fields([
            { name: "videoFile", maxCount: 1 },
            { name: "thumbnail", maxCount: 1 },
        ]),
        publishAVideo
    );

router.route("/:videoId")
    .patch(
        verifyJWT,
        upload.single("thumbnail"),
        updateVideo
    )
    .delete(
        verifyJWT,
        deleteVideo
    );

router.route("/toggle/publish/:videoId")
    .patch(
        verifyJWT,
        togglePublishStatus
    );

export default router;