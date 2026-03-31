import Activity from "../models/Activity.js";
import Notification from "../models/Notification.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { getIO } from "../socket/socket.js";

export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedUserId, priority } =
      req.body;

    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(400).json({
        message: "Project not found",
      });
    }


    const isMember = project.members.some(
      (m) => m.user.toString() === assignedUserId
    );

    if (!isMember) {
      return res.status(400).json({
        message: "Assigned user is not a project member",
      });
    }

    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignedTo: assignedUserId,
      priority,
      createdBy: req.user._id,
    });

    await Activity.create({
      user: req.user._id,
      project: projectId,
      action: "CREATE_TASK",
      details: `Task "${title}" created`,
    });

    await Notification.create({
      user: assignedUserId,
      project: projectId,
      message: `You have been assigned a new task "${title}"`,
      type: "task_assign",
    });

    const io = getIO();

    io.to(projectId.toString()).emit("activity", {
      action: "CREATE_TASK",
      message: `Task "${title}" created`,
    });

    io.to(assignedUserId.toString()).emit("notification", {
      message: `New task assigned: ${title}`,
    });

    res.status(201).json({
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.log("CREATE TASK ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTasksByProject = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");

    res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.log("GET TASKS ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email")
      .populate("project", "name");


    res.status(200).json({
      tasks
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const task = await Task.findByIdAndUpdate(
      req.params.taskId,
      { status },
      { new: true },
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await Activity.create({
      user: req.user._id,
      project: task.project,
      action: "UPDATE_TASK",
      details: `Task status changed to "${status}"`,
    });

    const io = getIO();

    io.to(task.project.toString()).emit("activity", {
      action: "UPDATE_TASK",
      message: `Task updated`,
    });

    res.status(200).json({
      task,
    });
  } catch (error) {
    console.log("UPDATE TASK ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    await task.deleteOne();

    await Activity.create({
      user: req.user._id,
      project: task.project,
      action: "DELETE_TASK",
      details: `Task deleted`,
    });

    const io = getIO();

    io.to(task.project.toString()).emit("activity", {
      action: "DELETE_TASK",
      message: `Task deleted`,
    });

    res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log("DELETE TASK ERROR:", error.message);
    res.status(500).json({
      message: error.message,
    });
  }
}
