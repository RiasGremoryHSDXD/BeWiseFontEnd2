import express from "express"
import { protect } from "../middleware/authMiddleWare.js"
import { addIncome } from "../controllers/incomeControllers/addIncomeControllers.js"
import { readIncome } from "../controllers/incomeControllers/readIncomeControllers.js"
const router = express.Router()

router.post('/addIncome', protect, addIncome)
router.get('/readIncome', protect, readIncome)
export default router