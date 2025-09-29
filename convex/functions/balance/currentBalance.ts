import { v } from "convex/values";
import { query } from "../../_generated/server";

export const currentBalance = query({
    args: {
        userCredentialsID: v.id('userCredentials')
    }, 
    handler: async (ctx, args) => {
        return await ctx.db
            .query('balance')
            .withIndex("by_user", (q) => q.eq("userCredentialsID", args.userCredentialsID))
            .first()
    }
})