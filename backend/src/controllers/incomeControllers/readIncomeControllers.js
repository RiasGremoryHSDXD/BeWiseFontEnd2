import Income from "../../models/Income.js"

export const readIncome = async (request, response) => {
    try
    {
        const incomeList = await Income.find({userId: request.user._id})
            .select("-userId -createdAt -updatedAt -__v")
            .sort({createdAt: -1})

        return response
            .status(200)
            .json(incomeList)
    }catch(error)
    {
        console.log("Error Read Income Controllers", error)
        return response
            .status(500)
            .json({message: "Internal Server Error (Read Income Controllers)"})
    }
}