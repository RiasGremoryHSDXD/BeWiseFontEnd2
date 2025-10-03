import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const processIncomePayOutOneTime = mutation({
    args: {
        userCredentialsID: v.id('userCredentials'),
        todaysDate: v.string()
    }, 
    handler: async (ctx, args) => {

        const incomes = await ctx.db
            .query('income')
            .withIndex('by_user', (q) => q.eq('userCredentialsID', args.userCredentialsID))
            .collect()

        
        const validProcessIncomePayOut: typeof incomes = []
        
        const todayDate = new Date(args.todaysDate);
        const todayOnly = new Date(
            todayDate.getFullYear(),
            todayDate.getMonth(),
            todayDate.getDate() 
        )

        for(const income of incomes){

            const incomeDate = new Date(income.expectedPayOut);
            const incomeOnly = new Date(
                incomeDate.getFullYear(),
                incomeDate.getMonth(),
                incomeDate.getDate()
            )

            if(incomeOnly <= todayOnly && income.frequency === 'OneTime'){
                validProcessIncomePayOut.push(income)
            }
        }

        return validProcessIncomePayOut
    }
}) 