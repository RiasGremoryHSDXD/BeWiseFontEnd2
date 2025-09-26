import { v } from "convex/values";
import { mutation } from "../../_generated/server";

export const deleteExpenses = mutation({
    args: {
        expensesID: v.id("expenses")
    },
    handler: async (ctx, args) => {
        const expensesDelete = await ctx.db
            .get(args.expensesID)

        if(!expensesDelete) throw new Error("Delete can't be proceed, Expsnses ID not found")

        await ctx.db.delete(args.expensesID)

        return { success: true, message: "Expenses deleted successfully" }
    }
})