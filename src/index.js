import dotenv from "dotenv";
import connectDB from "./db/index.js";
import {app} from "../src/app.js"


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


