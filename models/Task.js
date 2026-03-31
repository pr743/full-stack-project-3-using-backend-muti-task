import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    status: {
      type: String,
      enum: ["todo", "in-progress", "done"],
      default: "todo",
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "project",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },


    priority:{
     type:String,
     enum:["low","medium","high"],
     default:"medium" 
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },


  },
  {
    timestamps: true,
  },
);
export default mongoose.model("Task", taskSchema);
