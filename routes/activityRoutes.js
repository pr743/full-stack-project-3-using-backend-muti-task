import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { getProjectActivity } from "../controllers/activityController.js";


const router = express.Router(); 

router.get("/:projectId",protect,getProjectActivity);

export default router;







