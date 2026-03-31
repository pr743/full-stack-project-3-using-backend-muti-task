import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { changePassword, updateProfile } from "../controllers/userController.js";


const router = express.Router();

router.put("/profile", protect, updateProfile);
router.put("/password", protect, changePassword);


export default router;








