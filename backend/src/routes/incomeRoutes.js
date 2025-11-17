import express from "express"
import { protect } from "../middleware/authMiddleWare.js"
import { addIncome } from "../controllers/incomeControllers/addIncomeControllers.js"
const router = express.Router()

router.post('/addIncome', protect, addIncome)

export default router