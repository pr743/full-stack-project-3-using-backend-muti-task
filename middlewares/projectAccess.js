import Project from "../models/Project.js";

export const checkProjectAccess = async (req,res,next)=>{
  try{

    const project = await Project.findById(req.params.projectId);

    if(!project){
      return res.status(404).json({
        message:"Project not found"
      });
    }

     const isMember = project.members.some(
      m => m.user.equals(req.user._id)
    );

    if(!isMember){
      return res.status(403).json({
        message:"You are not a member of this project"
      });
    }

    req.project = project;

    next();

  }catch(error){

    res.status(500).json({
      message:error.message
    });

  }
};