import Activity from "../models/Activity.js";
import Project from "../models/Project.js";

export const getProjectActivity = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isMember = project.members.some(
      (m) => m.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        message: "Not a project member",
      });
    }

    const logs = await Activity.find({
      project: req.params.projectId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({ logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
