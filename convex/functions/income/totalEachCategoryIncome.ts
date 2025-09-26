import { v } from "convex/values";
import { query } from "../../_generated/server";

export  const totalEachCategoryIncome = query({
    args: {
        userCredentialsID: v.id("userCredentials")
    },
    handler: async (ctx, args) => {

        const incomes = await ctx.db
            .query("income")
            .withIndex("by_user", (q) => q.eq("userCredentialsID", args.userCredentialsID))
            .collect()

        type incomeCategory = Record<'Work' | 'Investment' | 'Savings' | 'Side Hustle' | 'Other', number>
        const validCategories = ['Work', 'Investment', 'Savings', 'Side Hustle', 'Other']

        const totalIncomeEachCategory: incomeCategory = {
            Work: 0,
            Investment: 0,
            Savings: 0,
            "Side Hustle": 0,
            Other: 0
        }

        for(const income of incomes){
            let category = income.incomeCategory
            
            if(!category || !validCategories.includes(category)) category = "Other"

            const amount = income.amount || 0

            totalIncomeEachCategory[category] += amount
        }

        return totalIncomeEachCategory
    }
})