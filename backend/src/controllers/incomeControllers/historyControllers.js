import IncomeHistory from "../../models/IncomeHistory.js";

export const readIncomeHistory = async (request, response) => {
  try {
    const userId = request.user._id;

    const historyList = await IncomeHistory.find({ userId: userId })
      .select("-userId -createdAt -updatedAt -__v")
      .sort({ paidDate: -1 });

    return response.status(200).json({
      message: "Income history retrieved successfully",
      history: historyList,
    });
  } catch (error) {
    console.log("Error Read Income History Controller", error);
    return response
      .status(500)
      .json({ message: "Internal Server Error (Read Income History)" });
  }
};