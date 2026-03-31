
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";


export const getDashboardState = async (req, res) => {
  try {

    const project = await Project.countDocuments();
    const task = await Task.countDocuments();
    const member = await User.countDocuments();

    const notification = 0;

    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .populate("members.user", "name");

    const recentProjects = projects.map((p) => {
      const members = p.members || [];

      return {
        _id: p._id,
        name: p.name,

        status:
          members.length === 0
            ? "Not Started"
            : members.some((m) => m.status === "inprogress")
              ? "In Progress"
              : members.some((m) => m.status === "completed")
                ? "Completed"
                : "Active",

        team: members.length,
      };
    });

    res.status(200).json({
      message: "Dashboard fetched successfully",
      project,
      task,
      member,
      notification,
      recentProjects,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};  