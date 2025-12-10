//index.js
import cookieParser from "cookie-parser";
import express, { urlencoded } from "express";
import cors from 'cors'
const app= express();
import userRoute from "./routes/user.route.js";
import companyRoute from "./routes/company.route.js"
import dotenv from 'dotenv';
dotenv.config({});
import connectDB from "./utils/db.js";

const PORT=process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

const corsOption={
    origin:'http://localhost:5173',
    credentials:true
}

app.use(cors(corsOption));

app.get("/", (req, res) => {
  res.send("Welcome at the Job Portal App");
});

app.use("/api/v1/user",userRoute);
app.use("/api/v1/company",companyRoute);
app.listen(PORT,()=>{
    connectDB();
    console.log(`server is running on ${PORT}`)
})

