import { v } from "convex/values";
import { query } from "../../_generated/server";

export const incomeList = query({
    args:{
        userCredentialsID: v.id("userCredentials")
    },
    handler: async (ctx, args) => {

        const incomeUserList  = await ctx.db
            .query("income")
            .withIndex("by_user", (q) => q.eq("userCredentialsID", args.userCredentialsID))
            .collect()
        
        return incomeUserList
    }
})