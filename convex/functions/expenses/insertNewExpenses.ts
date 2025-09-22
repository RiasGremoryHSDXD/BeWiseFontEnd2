import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const insertNewExpenses = mutation({
    args:{
        userCredentialsID: v.id("userCredentials"),
        expensesName: v.string(),
        expensesCategory: v.union(
            v.literal("Insurance"),
            v.literal("Bills"),
            v.literal("Game"),
            v.literal("Grocery"),
            v.literal("Other")
        ),
        amount: v.float64(),
        datePaid: v.string()
    },

    handler: async (ctx, args) => {
        return await ctx.db
            .insert("expenses", {
                userCredentialsID: args.userCredentialsID,
                expensesName: args.expensesName,
                expensesCategory: args.expensesCategory,
                amount: args.amount,
                datePaid: args.datePaid
            })
    }
})