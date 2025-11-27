import ExpensesHistory from "../../models/ExpensesHistory.js";

export const readExpensesHistory = async (request, response) => {
  try {
    const userId = request.user._id;

    const historyList = await ExpensesHistory.find({ userId: userId })
      .select("-userId -createdAt -updatedAt -__v")
      .sort({ datePaid: -1 });

    return response.status(200).json({
      message: "Expense history retrieved successfully",
      history: historyList,
    });
  } catch (error) {
    console.log("Error Read Expense History Controller", error);
    return response
      .status(500)
      .json({ message: "Internal Server Error (Read Expense History)" });
  }
};