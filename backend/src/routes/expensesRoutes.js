import express from "express";
import { addExpense } from "../controllers/expensesControllers/addExpensesController.js";
import { readExpenses } from "../controllers/expensesControllers/readExpensesControllers.js";
import { deleteExpenses } from "../controllers/expensesControllers/deleteExpensesControllers.js";
import { updateExpense } from "../controllers/expensesControllers/updateExpensesControllers.js";
import { protect } from "../middleware/authMiddleWare.js";

const router = express.Router();

router.post("/addExpense", protect, addExpense);
router.get("/readExpense", protect, readExpenses);
router.delete("/deleteExpense/:id", protect, deleteExpenses);
router.put("/updateExpense/:id", protect, updateExpense);

export default router;
