import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

export const getDashboardState = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        message: "Unauthorized no user",
      });

    }

    const userId = req.user._id;
    const project = await Project.countDocuments({
      "members.user": userId,
    });


    const task = await Task.countDocuments({
      assignedTo: userId,
    });


    const member = await User.countDocuments();

    const notifications = 0;


    const projects = await Project.find({
      "members.user": userId,
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("members.user", "name");

    const recentProjects = projects.map((p) => {
      return {
        _id: p._id,
        name: p.name,


        status: p.members.length === 0 ? "Not Started" : "Active",

        team: p.members.length,
      };
    });

    res.status(200).json({
      message: "Dashboard fetched successfully",
      project,
      task,
      member,
      notifications,
      recentProjects,
    });
  } catch (error) {
    console.log("Dashboard Error:", error);
    res.status(500).json({
      message: error.message,
    });
  }
};