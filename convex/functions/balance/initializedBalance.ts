import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const initializedBalance = mutation({
    args: {
        userCredentialsID: v.id('userCredentials')
    },
    handler: async (ctx, args) => {

        return await ctx.db.insert("balance", {
            userCredentialsID: args.userCredentialsID,
            currentBalance: 0,
            lastUpdate: new Date().toISOString()
        })
    }
})