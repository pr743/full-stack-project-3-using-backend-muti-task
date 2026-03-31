import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import Task from "../models/Task.js";
import { getIO } from "../socket/socket.js";

export const createComment = async (req, res) => {
  try {
    const { taskId, message } = req.body;



    const task = await Task.findById(taskId);


    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });

    }



    const comment = await Comment.create({
      task: taskId,
      user: req.user._id,
      message,
    });




    await Notification.create({
      user: req.user._id,
      project: task.project,
      message: "You added a comment",
    })



    const populateComment = await comment.populate("user", "name email");


    const io = getIO();


    io.to(taskId.toString()).emit("newComment", populateComment);


    if (task.assignedTo.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: task.assignedTo,
        project: task.project,
        message: "New comment added to your task",
      });

    }


    res.status(201).json({
      message: "Comment added",
      comment: populateComment,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getTaskComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      task: req.params.taskId,
    })
      .populate("user", "name email")
      .sort({ createdAt: 1 });

    res.json({
      comments,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({
        message: "Comment not found",
      });
    }

    await comment.deleteOne();

    res.json({
      message: "Comment deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
