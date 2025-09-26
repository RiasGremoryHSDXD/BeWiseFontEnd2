import { v } from "convex/values";
import { query } from "../../_generated/server";

export const totalIncome = query({
    args: {
        userCredentialsID: v.id("userCredentials")
    },
    handler: async (ctx, args) => {
        const totalIncome = await ctx.db
            .query("income")
            .withIndex("by_user", (q) => q.eq("userCredentialsID", args.userCredentialsID))
            .collect()
        
        const total = totalIncome.reduce((acc, incomes) => acc + incomes.amount, 0)

        return total
    }
})