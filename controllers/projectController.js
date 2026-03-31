import Notification from "../models/Notification.js";
import Project from "../models/Project.js";
import Tenant from "../models/Tenant.js";

export const createProject = async (req, res) => {
  try {
    const { name, description, tenantId } = req.body;

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Access denied: insufficient permissions",
      });
    }

    const tenant = await Tenant.findById(tenantId);

    if (!tenant) {
      return res.status(404).json({
        message: "Tenant not found",
      });
    }

    const project = await Project.create({
      name,
      description,
      tenant: tenantId,
      createdBy: req.user._id,
      members: [
        {
          user: req.user._id,
          role: "manager",
        },
      ],
    });

    res.status(201).json({
      message: "Project created",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const addProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userId, role } = req.body;

    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "only admin can add member",
      });
    }

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    const alreadyMember = project.members.some(
      (m) => m.user.toString() === userId,
    );

    if (alreadyMember) {
      return res.status(400).json({
        message: "User already a project member",
      });
    }

    project.members.push({
      user: userId,
      role: role || "developer",
    });

    await project.save();

    await Notification.create({
      user: userId,
      project: projectId,
      message: `You were added to project "${project.name}"`,
      type: "project_invite",
    });

    res.status(200).json({
      message: "Member added successfully",
      project,
    });
  } catch (error) {
    console.log("ADD MEMBER Error", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjectMember = async (req, res) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId).populate({
      path: "members.user",
      select: "name email  role",
    });

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    res.json({
      members: project.members,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const removeProjectMember = async (req, res) => {
  try {
    const { projectId, userId } = req.params;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "only admin can remove member",
      });
    }

    project.members = project.members.filter(
      (m) => m.user.toString() !== userId,
    );

    await project.save();

    res.json({
      message: "Member removed",
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProjectsByTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;

    const projects = await Project.find({ tenant: tenantId });

    res.status(200).json({
      projects,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.tenant.toString() !== req.user.tenant.toString()) {
      return res.status(403).json({
        message: "Access denied for this tenant",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update project",
      });
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;

    await project.save();

    res.status(200).json({
      project,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({
        message: "Project not found",
      });
    }

    if (project.tenant.toString() !== req.user.tenant.toString()) {
      return res.status(403).json({
        message: "Access denied for this tenant",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete project",
      });
    }

    await project.deleteOne();

    res.status(200).json({
      message: "Project deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
