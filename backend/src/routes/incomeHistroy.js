import express from "express";
import { readIncomeHistory } from "../controllers/incomeControllers/historyControllers.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router()

router.get('/readIncomeHistory', protect, readIncomeHistory)

export default router;