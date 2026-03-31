import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },

    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        role: {
          type: String,
          enum: ["manager", "developer", "tester"],
          default: "developer",
        },


        status: {
          type: String,
          enum: ["active", "inprogress", "completed"],
          default: "active",
        }




      },
    ],
  },
  {
    timestamps: true,
  },
);
export default mongoose.model("Project", projectSchema);
