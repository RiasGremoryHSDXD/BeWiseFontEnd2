import Expenses from "../../models/Expenses.js";

const expenseCategories = ["Insurance", "Bills", "Game", "Grocery", "Other"];
const expenseFrequencies = ["OneTime", "Monthly"];

export const updateExpense = async (request, response) => {
  try {
    // 1. Find the expense document by ID
    const expense = await Expenses.findById(request.params.id);

    // 2. Check if expense exists
    if (!expense) {
      return response.status(404).json({ message: "Expense entry not found" });
    }

    // 3. Security Check: Ensure the logged-in user owns this document
    if (expense.userId.toString() !== request.user._id.toString()) {
      return response.status(401).json({ message: "Not authorized to update this expense" });
    }

    // 4. Extract fields from request body
    const {
      expensesName,
      expensesCategory,
      amount,
      datePaid,
      frequency,
    } = request.body;

    // 5. Update fields if they are provided (Partial Update)
    if (expensesName) expense.expensesName = expensesName;
    if (expensesCategory) expense.expensesCategory = expensesCategory;
    if (amount !== undefined) expense.amount = amount; // Allow 0 if your schema permits (though min:1 prevents it)
    if (datePaid) expense.datePaid = datePaid;
    if (frequency) expense.frequency = frequency;

    // 6. Save the updated document (Triggers Mongoose Validation)
    const updatedExpense = await expense.save();

    return response.status(200).json({
        message: "Expense updated successfully",
        expense: updatedExpense
    });

  } catch (error) {
    console.error("Error Update Expense:", error);
    return response.status(500).json({ message: "Internal Server Error (Update Expneses Controllers)" });
  }
};