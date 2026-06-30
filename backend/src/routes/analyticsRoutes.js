import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getAnalytics } from "../controllers/analyticsController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireAuth);
router.get("/", asyncHandler(getAnalytics));

export default router;
