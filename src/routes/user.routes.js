import { Router } from "express";
import {registerUser,loginUser, logoutUser, refereshAccessToken} from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js"
import { verifyJWT } from "../middlewares/auth.middlewares.js";



const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "avatar",
            maxCount: 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT,logoutUser)//verify is a middleware
router.route("/refresh-token").post(refereshAccessToken)

export default router //jasa name chaihe use name se import kar sakta hu agar default hai to
