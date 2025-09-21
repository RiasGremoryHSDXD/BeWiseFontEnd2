import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    userCredentials: defineTable({
        username: v.string(),
        email: v.string(),
        password: v.string()
    }).index("by_email", ["email"]),

    budgetStatus: defineTable({
        userCredentials: v.id("userCredentials"),
        budgetStatusName: v.string(),
        currentAmount: v.string(),
        totalAmount: v.string()
    }),

    expenses: defineTable({
        userCredentialsID: v.id("userCredentials"),
        expensesName: v.string(),
        expensesCategory: v.union(
            v.literal("Insurance"),
            v.literal("Bills"),
            v.literal("Game"),
            v.literal("Grocery"),
            v.literal("Other")
        ),
        amount: v.float64(),
        datePaid: v.string(),
    }),

    income: defineTable({
        userCredentialsID: v.id("userCredentials"),
        incomeName: v.string(),
        incomeCategory: v.union(
            v.literal("Work"),
            v.literal("Investment"),
            v.literal("Savings"),
            v.literal("Side Hustle"),
            v.literal("Other")
        ),
        amount: v.float64(),
        expectedPayOut: v.string()
    })
})