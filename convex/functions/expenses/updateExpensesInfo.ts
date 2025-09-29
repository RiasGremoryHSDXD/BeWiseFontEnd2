import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const updateExpenseInfo = mutation({
    args: {
        expensesID: v.id("expenses"),
        newExpensesName: v.string(),
        newExpensesCategory: v.union(
            v.literal("Insurance"),
            v.literal("Bills"),
            v.literal("Game"),
            v.literal("Grocery"),
            v.literal("Other")
        ),
        newAmount: v.float64(),
        newDatePaid: v.string(),
        newFrequency: v.union(
            v.literal('OneTime'),
            v.literal('Monthly')
        )
    },
    handler: async (ctx, args) => {
        
        await ctx.db.patch(args.expensesID, {
            expensesName : args.newExpensesName,
            expensesCategory: args.newExpensesCategory,
            amount: args.newAmount,
            datePaid: args.newDatePaid,
            frequency: args.newFrequency
        })

        return { success: true }
    }
}) 