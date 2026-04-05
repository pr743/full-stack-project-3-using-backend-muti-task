import express from "express";
import { getDashboardState } from "../controllers/dashboardController.js";
import protect from "../middlewares/authMiddleware.js";


const router = express.Router();

router.get("/stats", protect, getDashboardState);

export default router;







