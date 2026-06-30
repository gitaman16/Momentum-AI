import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { connect, status, events } from "../controllers/calendarController.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const router = Router();
router.use(requireAuth);

router.post("/connect", asyncHandler(connect));
router.get("/status", asyncHandler(status));
router.get("/events", asyncHandler(events));

export default router;
