//professionaly approch
//DB is in another continante

import mongoose, { connect } from "mongoose";
import { DB_NAME } from "../constants.js";
import express from "express";

const connectDB = async () => {
  try {
    let connnectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
    console.log(`\n MONGODB connected !! DB HOST: ${connnectionInstance.connection.host}`);
  } catch (error) {
    console.log("MONGODB Connection error ", error);
    process.exit(1);//need to study
  }
};

export default connectDB