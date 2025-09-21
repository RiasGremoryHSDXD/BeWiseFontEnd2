import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const insertNewIncome = mutation({
    args: {
        userCredentialsID: v.id("userCredentials"),
        incomeName: v.string(),
        incomeCategory: v.union(
            v.literal("Work"),
            v.literal("Investment"),
            v.literal("Savings"),
            v.literal("Side Hustle"),
            v.literal("Other")
        ),
        amount: v.float64(),
        expectedPayOut: v.string()
    },
    handler: async (ctx, args) => {
        return await ctx.db
            .insert("income", {
                userCredentialsID: args.userCredentialsID,
                incomeName: args.incomeName,
                incomeCategory: args.incomeCategory,
                amount: args.amount,
                expectedPayOut: args.expectedPayOut
        })
    }
})