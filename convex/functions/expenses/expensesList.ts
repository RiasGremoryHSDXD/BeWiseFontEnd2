import { v } from "convex/values";
import { query } from "../../_generated/server";

export const expensesList = query({
    args:{
        userCredentialsID: v.id("userCredentials")
    },
    handler: async (ctx, args) => {

        const expensesList  = await ctx.db
            .query("expenses")
            .withIndex("by_user", (q) => q.eq("userCredentialsID", args.userCredentialsID))
            .collect()
        
        return expensesList
    }
})