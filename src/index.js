import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config({
    path: './env'
})

connectDB()























// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)//to connect the .env file its need to write the process.env
//         app.on("error", (error) => {
//             console.log(error);
//             throw error;
//         })//https://www.geeksforgeeks.org/node-js/node-js-process-complete-reference/

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listing on port ${process.env.PORT}`);
            
//         })

//     } catch (error) {
//         console.error("ERROR: " , error )
//         throw error
//     }
// })()