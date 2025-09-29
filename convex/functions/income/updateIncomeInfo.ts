import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const updateExpenseInfo = mutation({
    args:{
        incomeID: v.id("income"),
        newIncomeName: v.string(),
        newIncomeCategory: v.union(
            v.literal("Work"),
            v.literal("Investment"),
            v.literal("Savings"),
            v.literal("Side Hustle"),
            v.literal("Other")
        ),
        newAmount: v.float64(),
        newExpectedPayOut: v.string(),
        newFrequency: v.union(
            v.literal('OneTime'),
            v.literal('Monthly')
        )
    },
    handler: async (ctx, args) => {

        await ctx.db.patch(args.incomeID, {
            incomeName: args.newIncomeName,
            incomeCategory: args.newIncomeCategory,
            amount: args.newAmount,
            expectedPayOut: args.newExpectedPayOut,
            frequency: args.newFrequency
        })

        return { success: true}
    }
})