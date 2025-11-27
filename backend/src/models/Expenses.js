import mongoose from "mongoose";
import ToTitleCase from "../helper/toTitleCase.js";

const ExpenseSchema = new mongoose.Schema(
  {
    // 1. Foreign Key (Link to User)
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // 2. Expense Name
    expensesName: {
      type: String,
      required: true,
      trim: true,
      set: ToTitleCase, // Auto-capitalizes input
    },

    // 3. Expense Category
    // I included common categories based on your previous Convex data
    expensesCategory: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "Insurance",
        "Bills",
        "Game",
        "Grocery",
        "Other",
      ],
    },

    // 4. Amount
    amount: {
      type: Number,
      required: true,
      min: 1, // Prevents 0 or negative expenses
    },

    // 5. Date Paid
    datePaid: {
      type: Date,
      required: true,
    },

    // 6. Frequency
    frequency: {
      type: String,
      required: true,
      enum: ["OneTime", "Monthly"]
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Expenses = mongoose.model("Expenses", ExpenseSchema);

export default Expenses;