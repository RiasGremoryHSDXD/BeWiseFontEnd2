import Income from "../../models/Income.js";

export const deleteIncome = async (request, response) => {
  try {
    const incomeDelete = await Income.findById(request.params.id);

    if (!incomeDelete) {
      return response
        .status(404)
        .json({ message: "Income not found" });
    }

    // Strict check: user can only delete their own income
    if (incomeDelete.userId.toString() !== request.user._id.toString()) {
      return response
        .status(401)
        .json({ message: "Not authorized to delete this income" });
    }

    await incomeDelete.deleteOne();

    return response
      .status(200)
      .json({ message: "Income deleted successfully" });
      
  } catch (error) {
    console.log("Error Delete Income Controllers", error);
    return response
      .status(500)
      .json({ message: "Internal Server Error (Delete Income Controllers)" });
  }
};