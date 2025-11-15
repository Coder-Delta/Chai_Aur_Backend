import {express} from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use (cors({//to use the middleware app.use() likhna parta hai
    origin: process.env.CROS_ORIGIN,
    credentials: true,
    
}))

//middleware mean bich me kuch cheak karna ko middleware bolta hai
app.use(express.json({limit: "16kb"}))//for documentation https://expressjs.com/en/5x/api.html#express.json
app.use(express.urlencoded({extends: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

//app.get()we get 4 components app.use(err, req, res, next)



export { app }