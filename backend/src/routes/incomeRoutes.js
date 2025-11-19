import express from "express"
import { protect } from "../middleware/authMiddleWare.js"
import { addIncome } from "../controllers/incomeControllers/addIncomeControllers.js"
import { readIncome } from "../controllers/incomeControllers/readIncomeControllers.js"
import { deleteIncome } from "../controllers/incomeControllers/deleteIncomeControllers.js"
import { updateIncome } from "../controllers/incomeControllers/updateIncomeControllers.js"

const router = express.Router()

router.post('/addIncome', protect, addIncome)
router.get('/readIncome', protect, readIncome)
router.delete('/deleteIncome/:id', protect, deleteIncome)
router.put('/updateIncome/:id', protect, updateIncome)

export default router;