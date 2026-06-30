import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listGoals, createGoal, updateGoal, deleteGoal } from "../controllers/goalController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireAuth);

router.get("/", asyncHandler(listGoals));
router.post("/", asyncHandler(createGoal));
router.patch("/:id", asyncHandler(updateGoal));
router.delete("/:id", asyncHandler(deleteGoal));

export default router;
