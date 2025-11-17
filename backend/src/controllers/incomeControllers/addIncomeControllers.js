import Income from "../../models/Income.js"

const incomeCategories = ["Work", "Investment", "Savings", "Side Hustle", "Other"]
const incomeFrequencies = ["OneTime", "Monthly"]

export const addIncome = async (request, response) => {
    try 
        {
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

            const income = new Income
            ({
                userId: request.user._id,
                incomeName,
                incomeCategory,
                amount,
                expectedPayOut,
                frequency
            })

            const addIncome = await income.save()

            return response
                .status(200)
                .json(addIncome)

        }catch(error){
            console.log("Error Add income Controllers", error)
            return response
                .status(500)
                .json({message: "Internal Server Error (Add Income Controllers)"})
        }
}