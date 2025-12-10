import express from "express";
import { getFinancialContext } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleWare.js"; // Your auth middleware

const router = express.Router();

// Endpoint: /api/ai/context
router.get("/context", protect, getFinancialContext);

export default router;