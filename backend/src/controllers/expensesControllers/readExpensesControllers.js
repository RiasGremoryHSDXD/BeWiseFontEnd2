import Expenses from "../../models/Expenses.js";

export const readExpenses = async (request, response) => 
{
    try
    {
        const expensesList = await Expenses.find({userId: request.user._id})
            .select("-userId -createdAt -updatedAt -__v")
            .sort({createdAt: -1})

        return response
            .status(200)
            .json({
                message: "Expense list retrieved successfully",
                expenses: expensesList
            })
    }
    catch(error)
    {
        console.log("Error Read Expense Controllers", error)
        return response
            .status(500)
            .json({message: "Internal Server Error (Read Expense Controllers)"})
    }
}