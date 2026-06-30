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

const router = Router();
router.use(requireAuth);

router.post("/plan/:goalId", planGoal);
router.post("/schedule", scheduleTasks);
router.post("/risk", analyzeRisk);
router.post("/daily-plan", dailyPlan);
router.post("/weekly-review", weeklyReview);
router.get("/insights", listInsights);

export default router;
