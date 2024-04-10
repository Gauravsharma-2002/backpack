import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const DB_CONNECT = async()=>{
   try {
        const connnectionInstance =await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`Sucessfull connection with DB : ${connnectionInstance.connection.host}`);
     //    console.log("you connected it successfully by yourself")
   } catch (error) {
        console.error("Connetion to DB Failed : ",error);
     //    throw error;
        process.exit(1);
   }
}
export default DB_CONNECT;