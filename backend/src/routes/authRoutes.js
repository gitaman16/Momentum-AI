import { Router } from "express";
import { register, login, googleLogin, me, completeOnboarding } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/google", asyncHandler(googleLogin));
router.get("/me", requireAuth, asyncHandler(me));
router.post("/onboarding/complete", requireAuth, asyncHandler(completeOnboarding));

export default router;
