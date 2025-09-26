import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const deleteIncome = mutation({
    args: {
        incomeID: v.id("income")
    },
    handler: async (ctx, args) => {
        const incomeDelete = await ctx.db
            .get(args.incomeID)

        if(!incomeDelete) throw new Error("Delete can't be proceed, Income ID not found")

        await ctx.db.delete(args.incomeID)

        return { success: true, message: "Income deleted successfully" }
    }
})