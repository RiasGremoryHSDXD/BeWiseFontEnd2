import { v } from "convex/values";
import { query } from "../../_generated/server";

export const expenseInfo = query({
    args: {
        expensesID: v.id("expenses")
    },
    handler: async (ctx, args) => {
        
        const expensesInfoData = await ctx.db.get(args.expensesID)

        if(!expensesInfoData) throw new Error("Expense not found [expenses.ts] -> [Dota 2]")

        return expensesInfoData
    }
})