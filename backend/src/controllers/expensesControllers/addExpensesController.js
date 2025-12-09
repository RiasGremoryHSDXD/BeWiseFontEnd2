import Expenses from "../../models/Expenses.js";

const expenseCategories = [
  "Insurance",
  "Bills",
  "Hobby",
  "Daily Need",
  "Other",
];
const expenseFrequencies = ["OneTime", "Monthly"];

export const addExpense = async (request, response) => {
  try {
    const { expensesName, expensesCategory, amount, datePaid, frequency } =
      request.body;

    if (amount <= 0) {
      return response
        .status(400)
        .json({ message: "Amount must be greater than 0" });
    }

    if (
      !expensesName ||
      !expensesCategory ||
      !amount ||
      !datePaid ||
      !frequency
    ) {
      return response.status(400).json({ message: "All fields are required" });
    }

    if (!expenseCategories.includes(expensesCategory)) {
      return response.status(400).json({ message: "Invalid expense category" });
    }

    if (!expenseFrequencies.includes(frequency)) {
      return response
        .status(400)
        .json({ message: "Invalid expense frequency" });
    }

    if (frequency === "Monthly") {
      const expense = new Expenses({
        userId: request.user._id,
        expensesName,
        expensesCategory,
        amount,
        datePaid,
        frequency,
      });

      const addExpense = await expense.save();

      return response.status(200).json({
        message: "Expense added successfully",
        expense: addExpense,
      });
    }

    if (frequency === "OneTime") {
      const expense = new Expenses({
        userId: request.user._id,
        expensesName,
        expensesCategory,
        amount,
        datePaid,
        frequency,
      });

      const addExpense = await expense.save();

      return response.status(200).json({
        message: "Expense added successfully",
        expense: addExpense,
      });
    }
  } catch (error) {
    console.log("Error Add Expense Controllers", error);
    return response
      .status(500)
      .json({ message: "Internal Server Error (Add Expense Controllers)" });
  }
};
