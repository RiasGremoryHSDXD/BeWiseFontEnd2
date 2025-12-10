import User from "../models/User.js";
import Expenses from "../models/Expenses.js";
import Income from "../models/Income.js";
import ExpensesHistory from "../models/ExpensesHistory.js";
import IncomeHistory from "../models/IncomeHistory.js";

export const getFinancialContext = async (req, res) => {
  try {
    // 1. Get the authenticated user's ID from the request
    // Ensure your auth middleware populates req.user
    const userId = req.user._id; 

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: No user found" });
    }

    // 2. Fetch all financial data in parallel for speed
    const [
      userProfile,
      expensesPlan,
      incomePlan,
      expensesHistory,
      incomeHistory
    ] = await Promise.all([
      User.findById(userId).select("username email"),
      Expenses.find({ userId }),
      Income.find({ userId }),
      ExpensesHistory.find({ userId }).sort({ datePaid: -1 }).limit(20), // Last 20 transactions
      IncomeHistory.find({ userId }).sort({ paidDate: -1 }).limit(20)
    ]);

    // 3. Calculate Real-Time Totals
    const totalMonthlyIncome = incomePlan
      .filter(item => item.frequency === 'Monthly')
      .reduce((sum, item) => sum + item.amount, 0);

    const totalMonthlyExpenses = expensesPlan
      .filter(item => item.frequency === 'Monthly')
      .reduce((sum, item) => sum + item.amount, 0);

    const currentBalance = totalMonthlyIncome - totalMonthlyExpenses;

    // 4. Structure the data for the AI
    const financialContext = {
      userProfile: {
        username: userProfile.username,
        email: userProfile.email,
      },
      summary: {
        totalMonthlyIncome,
        totalMonthlyExpenses,
        estimatedSavings: currentBalance,
        status: currentBalance < 0 ? "Over Budget" : "Healthy"
      },
      budgetPlan: {
        expenses: expensesPlan.map(e => ({
          name: e.expensesName,
          category: e.expensesCategory,
          amount: e.amount,
          frequency: e.frequency
        })),
        income: incomePlan.map(i => ({
          name: i.incomeName,
          category: i.incomeCategory,
          amount: i.amount,
          frequency: i.frequency
        }))
      },
      recentHistory: {
        expenses: expensesHistory.map(h => ({
          name: h.expensesName,
          amount: h.amount,
          date: h.datePaid
        })),
        income: incomeHistory.map(h => ({
          name: h.incomeName,
          amount: h.amount,
          date: h.paidDate
        }))
      }
    };

    res.status(200).json(financialContext);

  } catch (error) {
    console.error("Error fetching financial context:", error);
    res.status(500).json({ message: "Server Error fetching context" });
  }
};