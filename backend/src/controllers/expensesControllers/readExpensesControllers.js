import Expenses from "../../models/Expenses.js"
import ExpensesHistory from "../../models/ExpensesHistory.js"


export const readExpenses = async (request, response) => 
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
         * * This code used to to filter the expenses Older than today
         */
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        /**
         * This code below where retrieving expiredExpenses information 
         * for that specific document storing in the expiredExpenses variable
         * * @code datePaid: {$lt: today}
         * This code check and return a value in the expiredExpenses varible.
         * the @code datePaid is a field of the Expenses collection, 
         * and the @code {$lt: today} is meaning og $lt is "less than"
         * so it just the code if less than than today's date of datePaid, 
         * it store in the expiredExpenses variable contining the Expenses documents data
         * it the @code .find() function returning a array
         */
        const expiredExpenses = await Expenses.find({
            userId,
            datePaid: {$lt: today}
        })


        /**
         * This if statement is checking if the expiredExpenses 
         * has a data on an array
         */
        if(expiredExpenses.length > 0)
        {   

            /**
             * -------------------------------------------------------------------------
             * LOOP: Process each expired expense individually
             * -------------------------------------------------------------------------
             * The .find() query returned a list (Array). We must cycle through every single one.
             *
             * FLOW EXAMPLE:
             * If 'expiredExpenses' has 2 items: [July Bill, August Bill]
             * 1. First Loop:  'expense' becomes 'July Bill'. We process it (archive/update).
             * 2. Second Loop: 'expense' becomes 'August Bill'. We process it.
             */
            for(const expense of expiredExpenses)
                {
                    // --- SCENARIO A: ONE TIME PAYMENT ---
                    // Logic: Just move it to history once and delete it.
                    if(expense.frequency === "OneTime"){

                        await ExpensesHistory.create({
                            userId: expense.userId,
                            expensesName: expense.expensesName,
                            expensesCategory: expense.expensesCategory,
                            amount: expense.amount,
                            datePaid: expense.datePaid,
                            frequency: expense.frequency
                        });

                        await Expenses.findByIdAndDelete(expense._id)
                    }

                    // --- SCENARIO B: MONTHLY PAYMENT (The Catch-Up Logic) ---
                    // Logic: Loop through every missed month until we reach the future.
                    else if(expense.frequency === "Monthly")
                    {
                        // Create a temporary date object starting at the old datePaid
                        let currentDateProcessing = new Date(expense.datePaid)

                        // WHILE the date is still in the past (older than today)...
                        while(currentDateProcessing < today)
                        {
                            // 1. Create a History Record for this specific month
                            await ExpensesHistory.create({
                                userId: expense.userId,
                                expensesName: expense.expensesName,
                                expensesCategory: expense.expensesCategory,
                                amount: expense.amount,
                                datePaid: new Date(currentDateProcessing), // Save the specific past month
                                frequency: expense.frequency
                            })
                            
                            // 2. Move the calculation date to the NEXT month
                            currentDateProcessing.setMonth(currentDateProcessing.getMonth() + 1)
                        }
                        

                        /**
                         * -------------------------------------------------------------------------
                         * FINAL UPDATE: Reschedule the Active Expense
                         * -------------------------------------------------------------------------
                         * At this point, the 'while' loop has finished. This means 'currentDateProcessing'
                         * has finally caught up to the present (or future).
                         * * EXAMPLE SCENARIO:
                         * - Today is: Oct 7, 2025
                         * - Old Date was: July 15, 2025
                         * - The Loop ran 3 times (Created history for July 15, Aug 15, Sept 15).
                         * - 'currentDateProcessing' is now: Oct 15, 2025.
                         * * HOW THE CODE BELOW WORKS:
                         * 1. 'expense' is the Mongoose Document we found at the start (containing the old July data).
                         * 2. We overwrite 'expense.datePaid' in memory with the new future date (Oct 15).
                         * 3. 'await expense.save()' tells MongoDB to update this specific document in the database.
                         * * RESULT: 
                         * The user sees "Oct 15" in their Active list, and "July/Aug/Sept" in their History.
                         */
                        expense.datePaid = currentDateProcessing
                        await expense.save()
                    }
                }
        }

        /**
         * -------------------------------------------------------------------------
         * STEP 2: FETCH ACTIVE EXPENSES (Post-Cleanup)
         * -------------------------------------------------------------------------
         * Now that the 'expired' logic above has finished running, the database is clean.
         * We query the 'Expenses' collection again to get the user's current active list.
         *
         * CODE BREAKDOWN:
         * 1. .find({ userId }): Get all active expenses for this user.
         * 2. .select("-..."): Hide technical fields (ID, timestamps) from the frontend response.
         * 3. .sort({ createdAt: -1 }): Show the newest items at the top of the list.
         *
         * RESULT EXAMPLE:
         * - Before Cleanup: The list might have had "July 15".
         * - After Cleanup (Now): That item has been updated to "Oct 15" (or removed if OneTime).
         * - The user ONLY sees valid, upcoming expense data.
         */

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