import express from "express";
import protect from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";
import { checkProjectAccess } from "../middlewares/projectAccess.js";

import {
  createProject,
  addProjectMember,
  getProjectMember,
  getProjectsByTenant,
  updateProject,
  deleteProject,
  removeProjectMember
} from "../controllers/projectController.js";

const router = express.Router();



router.post("/", protect, authorizeRoles("admin","manager"), createProject);


router.get("/tenant/:tenantId", protect, getProjectsByTenant);

router.post("/:projectId/members",
  protect,
  authorizeRoles("admin"),
  addProjectMember
);

router.get("/:projectId/members",
  protect,
  checkProjectAccess,
  getProjectMember
);

router.put("/:projectId",
  protect,
  authorizeRoles("admin","manager"),
  updateProject
);

router.delete("/:projectId",
  protect,
  authorizeRoles("admin"),
  deleteProject
);




router.delete("/:projectId/members/:userId",
  protect,
  authorizeRoles("admin"),
  removeProjectMember
);

export default router;