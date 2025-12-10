import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
fullname:{
  type:String,
  required:true  
},
phone:{
    type:String,
    required:true,
    unique:true,
},
email:{
    type:String,
    required:true,
    unique:true,
},
password:{
    type:String,
    required:true,
},
role:{
   type:String,
   enum:['student','recruiter'],
   required:true
},
profile:{
    bio:{type:String},
    skills:[{type:String}],
    resume:{type:String},
    resumeOriginalName:{type:String},
    company:{type:mongoose.Schema.Types.ObjectId,   ref:'Company'},

},
},{timestamps:true});
const User=mongoose.model("user",userSchema);
export default User