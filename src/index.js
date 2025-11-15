import dotenv from "dotenv";
import connectDB from "./db/index.js";
import express from "express"

const app = express()

dotenv.config({
  path: "./env",// it is the location of the .env file
});

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log(error);
      throw error;
    });
  })
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port: ${process.env.PORT}`);//to import something from the .env file it need to write process.env
    });
  })
  .catch((error) => {
    console.log("MONGODB  CONNECTION FAILED!", error);
  });



// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)//to connect the .env file its need to write the process.env
// app.on("error", (error) => {
//     console.log(error);
//     throw error;
// })//https://www.geeksforgeeks.org/node-js/node-js-process-complete-reference/

//         app.listen(process.env.PORT, () => {
//             console.log(`App is listing on port ${process.env.PORT}`);

//         })

//     } catch (error) {
//         console.error("ERROR: " , error )
//         throw error
//     }
// })()
