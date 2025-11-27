import Expenses from "../../models/Expenses.js";

export const deleteExpenses = async (request, response) => {
    try
    {
        const expenseDelete = await Expenses.findById(request.params.id)

        if(!expenseDelete){
            return response
                .status(404)
                .json({message: "Expense not found"})
        }

        // Strick check: user can only delete thier own income
        if(expenseDelete.userId.toString() !== request.user._id.toString()){
            return response
                .status(401)
                .json({message: "Not authorized to delete this expense"})
        }

        await expenseDelete.deleteOne()

        return response
            .status(200)
            .json({message: "Expense deleted successfully"})
    }
    catch(error)
    {
        console.log("Error Delete Expense Controllers", error)
        return response
            .status(500)
            .json({message: "Internal Server Error (Delete Expense Controllers)"})
    }
}