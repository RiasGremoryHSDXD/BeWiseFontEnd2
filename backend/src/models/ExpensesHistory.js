import mongoose from "mongoose";
import ToTitleCase from "../helper/toTitleCase.js";

const ExpensesHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    expensesName: {
      type: String,
      required: true,
      trim: true,
      set: ToTitleCase,
    },

    expensesCategory: {
      type: String,
      required: true,
      trim: true,
      enum: ["Insurance", "Bills", "Game", "Grocery", "Other"],
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    datePaid: {
      type: Date,
      required: true,
    },

    frequency: {
      type: String,
      required: true,
      enum: ["OneTime", "Monthly"],
    },
  },
  {
    timestamps: true,
  }
);

const ExpensesHistory = mongoose.model("ExpensesHistory", ExpensesHistorySchema);

export default ExpensesHistory;