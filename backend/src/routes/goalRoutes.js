import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listGoals, createGoal, updateGoal, deleteGoal } from "../controllers/goalController.js";

const router = Router();
router.use(requireAuth);

router.get("/", listGoals);
router.post("/", createGoal);
router.patch("/:id", updateGoal);
router.delete("/:id", deleteGoal);

export default router;
