//utils/db.js
import mongoose from "mongoose";

const connectDB = async () =>{
    try{
     const mongoUrl = process.env.MONGO_URI;
      
        await mongoose.connect(mongoUrl);
        console.log('mongodb connected successfully');
    }
    catch(error){
         console.log("error is :", error);
    }
}

export default connectDB;