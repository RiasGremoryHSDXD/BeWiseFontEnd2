import Income from "../../models/Income.js"
import IncomeHistory from "../../models/IncomeHistory.js"


export const readIncome = async (request, response) => 
{
    try
    {
        const userId = request.user._id

        //Auto archieve logic 

        /**
         * @code const today = new Date() 
         * This line of code get the current time stamp 
         * e.g 2025-11-27T14:45:32.123Z (Nov 27, 2:45 PM, 32 seconds, 123 ms)
         *
         * @code today.setHours(0, 0, 0, 0)
         * This line of code forces the time component into Zero
         * if the @today variable return 2025-11-27T14:45:32.123Z
         * the result is become 2025-11-27T00:00:00.000Z (Nov 27, Midnight sharp).
         * 
         * This code used to to filter the income Older than today
         */
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        /**
         * This code below where retrieving expiredIncome information 
         * for that specific document storing in the expiredIncome variable
         * 
         * @code expectedPayOut: {$lt: today}
         * This code check and return a value in the expiredIncome varible.
         * the @code expectedPayOut is a field of the User collection, 
         * and the @code {$lt: today} is meaning og $lt is "less than"
         * so it just the code if less than than today's date of expectedPayOut, 
         * it store in the expriedIncome variable contining the Income documents data
         * it the @code .find() function returning a array
         */
        const expiredIncome = await Income.find({
            userId,
            expectedPayOut: {$lt: today}
        })


        /**
         * This if statement is checking if the expiredIncome 
         * has a data on an array
         */
        if(expiredIncome.length > 0)
        {   

            /**
             * -------------------------------------------------------------------------
             * LOOP: Process each expired income individually
             * -------------------------------------------------------------------------
             * The .find() query returned a list (Array). We must cycle through every single one.
             *
             * FLOW EXAMPLE:
             * If 'expiredIncomes' has 2 items: [July Salary, August Salary]
             * 1. First Loop:  'item' becomes 'July Salary'. We process it (archive/update).
             * 2. Second Loop: 'item' becomes 'August Salary'. We process it.
             */
            for(const income of expiredIncome)
                {
                    // --- SCENARIO A: ONE TIME PAYMENT ---
                    // Logic: Just move it to history once and delete it.
                    if(income.frequency === "OneTime"){

                        await IncomeHistory.create({
                            userId: income.userId,
                            incomeName: income.incomeName,
                            incomeCategory: income.incomeCategory,
                            amount: income.amount,
                            paidDate: income.expectedPayOut,
                            frequency: income.frequency
                        });

                        await Income.findByIdAndDelete(income._id)
                    }

                    // --- SCENARIO B: MONTHLY PAYMENT (The Catch-Up Logic) ---
                    // Logic: Loop through every missed month until we reach the future.
                    else if(income.frequency === "Monthly")
                    {
                        // Create a temporary date object starting at the old expectedPayOut
                        let currentDateProcessing = new Date(income.expectedPayOut)

                        // WHILE the date is still in the past (older than today)...
                        while(currentDateProcessing < today)
                        {
                            // 1. Create a History Record for this specific month
                            await IncomeHistory.create({
                                userId: income.userId,
                                incomeName: income.incomeName,
                                incomeCategory: income.incomeCategory,
                                amount: income.amount,
                                paidDate: new Date(currentDateProcessing), // Save the specific past month
                                frequency: income.frequency
                            })
                            
                            // 2. Move the calculation date to the NEXT month
                            currentDateProcessing.setMonth(currentDateProcessing.getMonth() + 1)
                        }
                        

                        /**
                         * -------------------------------------------------------------------------
                         * FINAL UPDATE: Reschedule the Active Income
                         * -------------------------------------------------------------------------
                         * At this point, the 'while' loop has finished. This means 'currentDateProcessing'
                         * has finally caught up to the present (or future).
                         * * EXAMPLE SCENARIO:
                         * - Today is: Oct 7, 2025
                         * - Old Date was: July 15, 2025
                         * - The Loop ran 3 times (Created history for July 15, Aug 15, Sept 15).
                         * - 'currentDateProcessing' is now: Oct 15, 2025.
                         * * HOW THE CODE BELOW WORKS:
                         * 1. 'income' is the Mongoose Document we found at the start (containing the old July data).
                         * 2. We overwrite 'income.expectedPayOut' in memory with the new future date (Oct 15).
                         * 3. 'await income.save()' tells MongoDB to update this specific document in the database.
                         * * RESULT: 
                         * The user sees "Oct 15" in their Active list, and "July/Aug/Sept" in their History.
                         */
                        income.expectedPayOut = currentDateProcessing
                        await income.save()
                    }
                }
        }

        /**
         * -------------------------------------------------------------------------
         * STEP 2: FETCH ACTIVE INCOME (Post-Cleanup)
         * -------------------------------------------------------------------------
         * Now that the 'expired' logic above has finished running, the database is clean.
         * We query the 'Income' collection again to get the user's current active list.
         *
         * CODE BREAKDOWN:
         * 1. .find({ userId }): Get all active incomes for this user.
         * 2. .select("-..."): Hide technical fields (ID, timestamps) from the frontend response.
         * 3. .sort({ createdAt: -1 }): Show the newest items at the top of the list.
         *
         * RESULT EXAMPLE:
         * - Before Cleanup: The list might have had "July 15".
         * - After Cleanup (Now): That item has been updated to "Oct 15" (or removed if OneTime).
         * - The user ONLY sees valid, upcoming income data.
        */

        const incomeList = await Income.find({userId: request.user._id})
            .select("-userId -createdAt -updatedAt -__v")
            .sort({createdAt: -1})

        return response
            .status(200)
            .json({
                message: "Income list retrieved successfully",
                income: incomeList
        })
    }
    catch(error)
    {
        console.log("Error Read Income Controllers", error)
        return response
            .status(500)
            .json({message: "Internal Server Error (Read Income Controllers)"})
    }
}

