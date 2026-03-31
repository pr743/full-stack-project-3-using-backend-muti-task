import express from "express";
import protect from "../middlewares/authMiddleware.js";

import {
  createTask,
  deleteTask,
  updateTaskStatus,
  getTasksByProject,
  getAllTasks,
} from "../controllers/taskController.js";

const router = express.Router();

router.post("/", protect, createTask);

router.get("/project/:projectId", protect, getTasksByProject);

router.get("/", protect, getAllTasks);



router.patch("/:taskId/status", protect, updateTaskStatus);

router.delete("/:taskId", protect, deleteTask);

export default router;
