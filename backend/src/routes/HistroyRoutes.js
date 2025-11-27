import express from "express";
import { readIncomeHistory } from "../controllers/incomeControllers/historyControllers.js";
import { readExpensesHistory } from "../controllers/expensesControllers/historyController.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router()

router.get('/readIncomeHistory', protect, readIncomeHistory)
router.get('/readExpensesHistory', protect, readExpensesHistory)

export default router;