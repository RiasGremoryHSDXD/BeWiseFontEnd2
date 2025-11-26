import Income from "../../models/Income.js"

const incomeCategories = ["Work", "Investment", "Savings", "Side Hustle", "Other"]
const incomeFrequencies = ["OneTime", "Monthly"]

export const updateIncome = async (request, response) => {
    try
    {
        const incomeUpdate = await Income.findById(request.params.id)

        if(!incomeUpdate){
            return response
                .status(404)
                .json({message: "Income not found"})
        }

        if(incomeUpdate.userId.toString() !== request.user._id.toString()){
            return response
                .status(401)
                .json({message: "Not authorized to update this income"})
        }

        const {
            incomeName,
            incomeCategory,
            amount,
            expectedPayOut,
            frequency
        } = request.body

        if(amount <= 0){
            return response
                .status(400)
                .json({message: "Amount must be greater than 0"})
        }

        if(!incomeName || !incomeCategory || !amount || !expectedPayOut || !frequency){
            return response
                .status(400)
                .json({message: "All fields are required"})
        }

        if(!incomeCategories.includes(incomeCategory)){
            return response
                .status(400)
                .json({message: "Invalid income category"})
        }

        if(!incomeFrequencies.includes(frequency)){
            return response
                .status(400)
                .json({message: "Invalid income frequency"})
        }

        if (incomeName) incomeUpdate.incomeName = incomeName;
        if (incomeCategory) incomeUpdate.incomeCategory = incomeCategory;
        if (amount !== undefined) incomeUpdate.amount = amount;
        if (expectedPayOut) incomeUpdate.expectedPayOut = expectedPayOut;
        if (frequency) incomeUpdate.frequency = frequency;

        const updateIncome = await incomeUpdate.save()

        return response
            .status(200)
            .json(
                {
                    message: "Income updated successfully",
                    income: updateIncome
                }
            )
    }
    catch(error)
    {
        console.log("Error Update Income Controllers", error)
        return response
            .status(500)
            .json({message: "Internal Server Error (Update Income Controllers)"})
    }
}