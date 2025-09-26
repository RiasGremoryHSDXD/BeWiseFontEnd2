import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const UpdateUsername = mutation({
  args: {
    userId: v.id("userCredentials"),
    newUsername: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.userId, {
      username: args.newUsername,
    });
    return { success: true };
  },
});
