import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';
import Company from "../models/companymodel.js"; // correct import

// export const registerCompany = async (req,res)=>{

//     try{

//         const {Companyname} =req.body;
//         // if(!Companyname){
//         //   return  res.status(409).json({
//         //         success:false,
//         //         message:"company is not found"
//         //     })
//         // }
      
//         const existingCompany =await Company.findOne({name:Companyname});
//         if(existingCompany ){
//          return   res.status(401).json({
//                 success:false,
//                 message:"Company is already register on these portal"
//             })
//         }
    
//            const create= await new existingCompany ({
//             name:existingCompany.Companyname,
//             userId:req._id
//            })
//          await create.save()


//          return res.status(201).json({
//       success: true,
//       message: "Company registered successfully",
//       company: create
//          })
        
//     }catch(error){
//         console.log("error during company register is:",error.message);
//       return  res.status(500).json({
//             success:false,
//             message:"Internal server Error",

//         })
//     }

// }
export const registerCompany = async (req, res) => {
    try {
      
        // Handle the trailing space issue
        const {Companyname,description,website,location} = req.body;

        // Validate input
        if (!Companyname) {
            return res.status(400).json({
                success: false,
                message: "Company name is required"
            });
        }

        // Check if company already exists
        const existingCompany = await Company.findOne({ name: Companyname});
        if (existingCompany) {
            return res.status(409).json({
                success: false,
                message: "Company is already registered on this portal"
            });
        }
    
        // Create new company
        const create = new Company({
            name: Companyname,
            description,
            website,
            location,
            userId:req.id   // Use the correct userId
        });
        
        await create.save();
        
        return res.status(201).json({
            success: true,
            message: "Company registered successfully",
            company: create
        });
        
    } catch (error) {
        console.log("error during company register is:", error.message);
        return res.status(500).json({
            success: false,
            message: "Internal server Error",
        });
    }
}





export const getCompany  = async (req,res)=>{

    try{
            
        let userId=req.id;
        //console.log("userid in get company:",userId);
        if(!userId){
       return  res.status(404).json({
             success:false,
             message:"User id is not found",
     
         })
        }
         // FIND ALL COMPANIES OWNED BY USER
    const allCompany = await Company.find({ userId: userId });

    if (!allCompany || allCompany.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No company found for this user",
      });
    }
     return res.status(200).json({
       success: true,
       message: "Company fetch successfully",
       company: allCompany
          })
      }catch(error){
        console.log("error during company register is:",error.message);
        res.status(500).json({
            success:false,
            message:"Internal server Error",

        })
    }
 }




export const getCompanyById  = async (req,res)=>{

    try{

    const companyId=req.params.id;
        if(!companyId){
       return  res.status(404).json({
             success:false,
             message:"companyId  is not found",
     
         })
        }
         // FIND ALL COMPANIES OWNED BY USER
    const singleCompany = await Company.findById(companyId);

    if (!singleCompany) {
      return res.status(404).json({
        success: false,
        message: "No company found",
      });
    }
     return res.status(200).json({
       success: true,
       message: "Company fetch successfully",
       company: singleCompany
          })
      }catch(error){
        console.log("error during company register is:",error.message);
        res.status(500).json({
            success:false,
            message:"Internal server Error",

        })
    }
 }
/////////////////////

export const updateCompany = async (req, res) => {
  try {
    const companyId = req.params.id; 
    const { name, description, website, location, logo } = req.body;
    const file=req.file;
    //idhar cloudinary ka code aayega logo ke liye
    // CHECK IF COMPANY EXISTS
    console.log("Company ID to update:", companyId);
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // BUILD UPDATE OBJECT (only include fields that are present)
    const updateData = {};
    if (name) updateData.name = name;
    if (description) updateData.description = description;
    if (website) updateData.website = website;
    if (location) updateData.location = location;
    if (logo) updateData.logo = logo; // FIXED

    // UPDATE COMPANY
    const updatedCompany = await Company.findByIdAndUpdate(
      req.params.id,
      updateData,
     { new: true } // return updated doc
    );

    if(!updatedCompany){
        return res.status(404).json({   
            success:false,
            message:"Company not found with this id"
        })
    }

    return res.status(200).json({
      success: true,
      message: "Company updated successfully",
      company: updatedCompany,
    });

  } catch (error) {
    console.log("Error during company update:", error.message);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
