import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createTenant } from "../controllers/tenantController.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router(); 

router.post("/",protect,createTenant);

export default router;







