import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  planGoal,
  scheduleTasks,
  analyzeRisk,
  dailyPlan,
  weeklyReview,
  listInsights
} from "../controllers/aiController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireAuth);

router.post("/plan/:goalId", asyncHandler(planGoal));
router.post("/schedule", asyncHandler(scheduleTasks));
router.post("/risk", asyncHandler(analyzeRisk));
router.post("/daily-plan", asyncHandler(dailyPlan));
router.post("/weekly-review", asyncHandler(weeklyReview));
router.get("/insights", asyncHandler(listInsights));

export default router;
