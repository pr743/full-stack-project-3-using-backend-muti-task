import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { createComment, deleteComment, getTaskComments } from "../controllers/commentController.js";





const router = express.Router(); 


router.post("/",protect,createComment);

router.get("/:taskId",protect,getTaskComments);
router.delete("/:commentId",protect,deleteComment);


export default router;







