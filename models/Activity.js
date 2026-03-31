import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
{
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  project:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Project",
    required:true
  },

  action:{
    type:String,
    required:true
  },

  details:{
    type:String
  }

},
{timestamps:true}
);

export default mongoose.model("Activity",activitySchema);