import jwt from 'jsonwebtoken'
const isAuthenticate=(req,res,next)=>{
    try{

    const token = req.cookies?.token;
        if(!token){
           return res.status(404).json({
                success:false,
                message:"Unauthenticated User "
            })
        };
        
        const decoded=jwt.verify(token,process.env.Secret_Key);
        
        req.id=decoded.id;
        next()
    }catch (error) {
    console.log("Authentication error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default isAuthenticate;