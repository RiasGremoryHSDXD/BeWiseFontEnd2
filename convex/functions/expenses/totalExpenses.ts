import { v } from "convex/values";
import { query } from "../../_generated/server";

export const totalExpenses = query({
    args: {
        userCredentialsID: v.id("userCredentials")
    },
    handler: async (ctx, args) => {

        const totalExpenses = await ctx.db
            .query("expenses")
            .withIndex("by_user", (q) => q.eq("userCredentialsID", args.userCredentialsID))
            .collect()

        const total = totalExpenses.reduce((acc, expenses) => acc + expenses.amount, 0)

        return total
    }
})