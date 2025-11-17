import { Router } from "express";
import {registerUser} from "../controllers/user.controllers.js"

const router = Router()

router.route("/register").post(registerUser)

export default router //jasa name chaihe use name se import kar sakta hu
