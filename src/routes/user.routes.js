import { Router } from "express";
import {registerUser} from "../controllers/user.controllers.js"
import { upload } from "../middlewares/multer.middlewares.js"


const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name : "Avatar",
            maxCount: 1
        },
        {
            name : "coverImage",
            maxCount : 1
        }
    ]),
    registerUser
)

export default router //jasa name chaihe use name se import kar sakta hu agar default hai to
