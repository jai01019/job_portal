import User from "../models/usermodel.js   ";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


export const registerUser = async (req, res) => {
  try { 
    const { fullname, phone, email, password, role } = req.body;
    if (!fullname || !phone || !email || !password || !role) {
     return res.status(400).json({
        success: false,
        message:
          "please fill all the required detail like fullname, phoneNumber, email, password, role ",
      });
    }
      const unique = await User.findOne({ email: email });
      if (unique) {
        return res.status(400).json({
          success: false,
          message: "User all ready exist with this email",
        });
      }
      const hashedPassword =await bcrypt.hash(password,10);
      const newUser =await new User({
       
        phone,
        email,
        password:hashedPassword,
        role,
         fullname: fullname
      });
    await  newUser.save()


   const tokenData={
    id:newUser._id
   }

     const token= jwt.sign(tokenData,process.env.Secret_Key,{expiresIn:'1d'})

      // await obj.save();
    return  res.status(200)
    .cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:'strict'})
    .json({
        success: true,
        message: "User Register SuccessFully",
        newUser,

        
      });
    }
   catch (error) {
    console.log("Error on registering User is : ", error.message);
  return  res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


  
export const  login = async (req,res)=>{
 try{
 const {email,password,role}=req.body;
      if ( !email || !password || !role) {
     return res.status(400).json({
        success: false,
        message:
          "please fill all the required detail like  email, password, role ",
      });
}
      const user=await User.findOne({email:email});
      if(!user){
      return   res.status(404).json({
      success: false,
      message:"email ",
    });
      }
const isPasswordMatch= await bcrypt.compare(password,user.password)
      if(!isPasswordMatch){
      return  res.status(401).json({
      success: false,
      message:"Invalid email or password",
         })
      }

     if(role !=user.role){
       return  res.status(403).json({
      success: false,
      message: "Role not authorized",
         })
      
     }



      const tokenData={
        id:user._id
      }

      const token= jwt.sign(tokenData,process.env.Secret_Key,{expiresIn:'1d'})
    
     const resIs={
      id:user._id,
       name: user.fullname,
      role:user.role,
      email:user.email,
      phoneNumber: user.phone,
      profile:user.profile,


     }
res.status(200).cookie("token",token,{maxAge:1*24*60*60*1000,httpOnly:true,sameSite:'strict'}).json({
        success: true,
        message: "User login SuccessFully",
        resIs,
      });
  }

  catch(error){
    console.log("error during login is :",error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
}


export const logOut=async (req,res)=>{
  try{
    
    return res.status(200).cookie("token","",{maxAge:0}).json({
      success:true,
      message:"Logout SuccessFully "
    })
  }
  catch(error){
    console.log("error during login is :",error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });

  }
}


export const update = async (req, res) => {
  try {
    const { fullname, phone, password, role, profile } = req.body;
      const file=req.file;
      const userId=req.id;
       const user = await User.findById(userId);
   // const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    
    // Update top-level fields
    if (fullname !== undefined) user.fullname = fullname;
    if (phone !== undefined) user.phone = phone;
    if (role !== undefined) user.role = role;

    // Update password if provided
    if (password !== undefined) {
      user.password = await bcrypt.hash(password, 10);
    }


    // Update profile safely
    if (profile) {
      user.profile = user.profile || {}; // Ensure profile exists

      if (profile.bio !== undefined) user.profile.bio = profile.bio;

      // Normalize skills to array
      if (profile.skills !== undefined) {
        let skillsArray = [];
        if (typeof profile.skills === 'string') {
          skillsArray = profile.skills.split(',').map(s => s.trim()).filter(s => s);
        } else if (Array.isArray(profile.skills)) {
          skillsArray = profile.skills.map(s => s.trim()).filter(s => s);
        }
        user.profile.skills = skillsArray;
      }

      if (profile.resume !== undefined) user.profile.resume = profile.resume;
    }

    await user.save();

    const { password: _, ...safeUser } = user.toObject();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: safeUser,
    });

  } catch (error) {
    console.error("Error during profile update:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};