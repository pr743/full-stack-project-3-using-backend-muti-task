import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

export const getDashboardState = async (req, res) => {
  try {
    const userId = req.user._id;
    const tenantId = req.user.tenant;
    const role = req.user.role;

    let project = 0;
    let task = 0;
    let member = 0;
    let projects = [];


    if (role === "admin") {
      project = await Project.countDocuments({ tenant: tenantId });

      task = await Task.countDocuments({
        project: { $in: await Project.find({ tenant: tenantId }).distinct("_id") },
      });

      member = await User.countDocuments({ tenant: tenantId });

      projects = await Project.find({ tenant: tenantId })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("members.user", "name");
    }


    else {
      project = await Project.countDocuments({
        "members.user": userId,
      });

      task = await Task.countDocuments({
        assignedTo: userId,
      });

      member = 1;

      projects = await Project.find({
        "members.user": userId,
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("members.user", "name");
    }

    const notification = 0;

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