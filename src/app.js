import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { globalLimiter } from "./middlewares/ratelimit.middlewares.js"

const app = express()

app.set("trust proxy", 1);


// ---------------------- CORS ----------------------
// to use the middleware app.use() likhna parta hai (middleware ko activate karne ke liye)
// CORS allow karta hai ki frontend backend ko access kare
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://cholochitro-exe.onrender.com"
    ],
    credentials: true
}));



// ---------------------- Middlewares ----------------------
// middleware mean bich me kuch cheak karna ko middleware bolta hai

// Parse JSON body
// for documentation https://expressjs.com/en/5x/api.html#express.json
app.use(express.json({ limit: "16kb" }))

// Parse URL-encoded data (forms)
// extended (true) mean nested objects allow hote hain
app.use(express.urlencoded({ extended: true, limit: "16kb" }))

// Public folder for images, css, static files
// yahan se static files directly serve hoti hain
app.use(express.static("public"))

// Cookie parser - cookies ko read karne ke liye use hota hai
app.use(cookieParser())

// app.get() me 4 components: err, req, res, next

app.use(globalLimiter);




// ---------------------- Routes Import ----------------------
// yaha saare routes import kiye ja rahe hain
import userRouter from "./routes/user.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"
import tweetRouter from "./routes/tweet.routes.js"
import subscriptionRouter from "./routes/subscription.routes.js"
import videoRouter from "./routes/video.routes.js"
import commentRouter from "./routes/comment.routes.js"
import likeRouter from "./routes/like.routes.js"
import playlistRouter from "./routes/playlist.routes.js"
import dashboardRouter from "./routes/dashboard.routes.js"



// ---------------------- Routes Declaration ----------------------
// yaha ham bata rahe hain ki kaunsa router kis URL par chalega

app.use("/api/v1/healthcheck", healthcheckRouter)

app.use("/api/v1/users", userRouter)
// Example: http://localhost:8000/api/v1/users/register

app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)



// ---------------------- Export ----------------------
export { app }
