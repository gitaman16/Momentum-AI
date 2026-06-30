import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(listTasks));
router.post("/", asyncHandler(createTask));
router.patch("/:id", asyncHandler(updateTask));
router.delete("/:id", asyncHandler(deleteTask));

export default router;
