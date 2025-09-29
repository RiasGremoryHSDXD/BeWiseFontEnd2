import { v } from "convex/values";
import { query } from "../../_generated/server";

export const totalEachCategoryExpenses = query({
  args: {
    userCredentialsID: v.id("userCredentials"),
  },
  handler: async (ctx, args) => {

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) =>q.eq("userCredentialsID", args.userCredentialsID))
      .collect();

    type expensesCategory = Record<'Insurance' | 'Bills' | 'Game' | 'Grocery' | 'Other', number>

    const validCategories = ['Insurance', 'Bills', 'Game', 'Grocery', 'Other'];

    const totalExpensesEachCategory : expensesCategory = {
        Insurance: 0,
        Bills: 0,
        Game: 0,
        Grocery: 0,
        Other: 0,
    }

    for(const expense of expenses){
        let category = expense.expensesCategory

        if(!category || !validCategories.includes(category)){
            category = "Other"
        }

        const amount = expense.amount || 0

        totalExpensesEachCategory[category] += amount
    }

    return totalExpensesEachCategory
  },
}); 