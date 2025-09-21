import { query } from "../../_generated/server";
import { v } from "convex/values";

export const logInUser = query({
    args:{
        email: v.string(),
        password: v.string()
    },
    handler: async (ctx, args) => {
        
        const user = await ctx.db
            .query("userCredentials")
            .withIndex("by_email", (q) => q.eq("email", args.email))
            .unique();

        if(!user) return { success: false, message: "Email not found"}
        if(user.password !== args.password) return { success: false, message: "Invalid Password" }

        return {
            success: true,
            message: "Login successful",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            } 
        }
    }
})