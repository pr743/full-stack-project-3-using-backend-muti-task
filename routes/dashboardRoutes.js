import express from "express";
import { getDashboardState } from "../controllers/dashboardController.js";


const router = express.Router();

router.get("/stats", getDashboardState);

export default router;







