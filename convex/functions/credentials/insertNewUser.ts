import { mutation } from "../../_generated/server";
import { v } from "convex/values";

export const insertNewUser = mutation({
    args:{
        username: v.string(),
        email: v.string(),
        password: v.string()
    },
    handler: async( ctx, args) => {
        return await ctx.db.insert("userCredentials", {
            username: args.username,
            email: args.email,
            password: args.password
        })
    }
})