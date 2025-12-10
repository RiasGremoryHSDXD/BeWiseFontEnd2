import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import api from "../../../api/api";

const screenWidth = Dimensions.get("window").width;

interface Props {
  onClose: () => void;
}

interface Income {
  _id: string;
  userId: string;
  incomeName: string;
  incomeCategory: "Work" | "Investment" | "Savings" | "Side Hustle" | "Other";
  amount: number;
  expectedPayOut: string;
  frequency: "OneTime" | "Monthly";
}

interface Expense {
  _id: string;
  userId: string;
  expensesName: string;
  expensesCategory: "Insurance" | "Bills" | "Hobby" | "Daily Need" | "Other";
  amount: number;
  datePaid: string;
  frequency: "OneTime" | "Monthly";
}

interface CategoryTotal {
  [key: string]: number;
}

export default function Analytics({ onClose }: Props) {
  const [income, setIncome] = useState<Income[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [incomeRes, expenseRes] = await Promise.all([
        api.get("/income/readIncome"),
        api.get("/expenses/readExpense"),
      ]);

      if (incomeRes.status === 200) {
        setIncome(incomeRes.data.income);
      }
      if (expenseRes.status === 200) {
        setExpenses(expenseRes.data.expenses);
      }
    } catch (error) {
      console.error("Failed to fetch analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate totals
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const currentBalance = totalIncome - totalExpenses;

  // Filter monthly income and expenses
  const monthlyIncome = income
    .filter((i) => i.frequency === "Monthly")
    .reduce((sum, i) => sum + i.amount, 0);

  const monthlyExpenses = expenses
    .filter((e) => e.frequency === "Monthly")
    .reduce((sum, e) => sum + e.amount, 0);

  // Expenses by Category
  const categoryTotals: CategoryTotal = expenses.reduce((acc, expense) => {
    acc[expense.expensesCategory] =
      (acc[expense.expensesCategory] || 0) + expense.amount;
    return acc;
  }, {} as CategoryTotal);

  const categoryLabels = Object.keys(categoryTotals);
  const categoryAmounts: number[] = Object.values(categoryTotals);

  const colors = ["#36978C", "#FF6B6B", "#4ECDC4", "#FFD93D", "#A8E6CF"];

  const formatAmount = (CategoryTotals: number) => {
    return `₱${CategoryTotals.toLocaleString()}`;
  };

  const expensePieData = categoryLabels.map((label, index) => ({
    name: label,
    amount: categoryTotals[label], // MUST be number
    formattedAmount: formatAmount(categoryTotals[label]),
    color: colors[index % colors.length],
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  // Calculate budget status by category
  const getBudgetStatusByCategory = () => {
    return categoryLabels
      .map((category) => {
        const categoryExpenses = categoryTotals[category];

        const percentage =
          totalIncome > 0 ? (categoryExpenses / totalIncome) * 100 : 0;

        return {
          budgetStatusName: category,
          currentAmount: categoryExpenses,
          totalAmount: totalIncome,
          percentage: percentage,
        };
      })
      .sort((a, b) => b.currentAmount - a.currentAmount);
  };

  const budgetStatus = getBudgetStatusByCategory();

  if (loading) {
    return (
      <View className="flex-1 bg-[#F3FDFB] justify-center items-center">
        <ActivityIndicator size="large" color="#36978C" />
        <Text className="mt-4 text-gray-600">Loading analytics...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-[#F3FDFB] p-4">
      {/* Header */}
      <View className="flex flex-row justify-between mb-6">
        <View className="flex flex-row justify-center items-center gap-x-2">
          <Image
            source={require("../../../assets/images/AnalyticsLogo.png")}
            className="w-[32px] h-[32px]"
          />
          <Text className="text-3xl font-bold text-[#1E4E45]">Analytics</Text>
        </View>
      </View>

      {/* Balance Summary Card */}
      <View className="bg-white p-5 rounded-2xl mb-6 border border-gray-300">
        <Text className="text-center text-gray-500 text-sm mb-2">
          Current Balance
        </Text>
        <Text className="text-center text-4xl font-bold text-[#1E4E45] mb-4">
          ₱{currentBalance.toLocaleString()}
        </Text>

        <View className="flex-row justify-between border-t border-gray-200 pt-4">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 text-center">
              Total Income
            </Text>
            <Text className="text-lg font-semibold text-green-600 text-center">
              ₱{totalIncome.toLocaleString()}
            </Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="flex-1">
            <Text className="text-xs text-gray-500 text-center">
              Total Expenses
            </Text>
            <Text className="text-lg font-semibold text-red-600 text-center">
              ₱{totalExpenses.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Expenses by Category - Pie Chart */}
      {expensePieData.length > 0 ? (
        <View className="bg-white p-5 rounded-2xl mb-6 border border-gray-300">
          <Text className="text-lg font-bold text-[#1E4E45] mb-3">
            Spending Breakdown
          </Text>
          <PieChart
            data={expensePieData}
            width={screenWidth - 70}
            height={200}
            chartConfig={{
              color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            accessor="amount"
            backgroundColor="transparent"
            paddingLeft="15"
            style={{ alignSelf: "center" }}
          />
        </View>
      ) : (
        <View className="bg-white p-5 rounded-2xl mb-6 border border-gray-300">
          <Text className="text-center text-gray-500">
            No expense data available
          </Text>
        </View>
      )}

      {/* Category Breakdown */}
      {budgetStatus.length > 0 && (
        <View className="bg-white p-5 rounded-2xl mb-6 border border-gray-300">
          <Text className="text-lg font-bold text-[#1E4E45] mb-4">
            Category Breakdown
          </Text>
          {budgetStatus.map((budget, index) => {
            const percentage = budget.percentage;
            return (
              <View key={index} className="mb-4">
                <View className="flex-row justify-between mb-2">
                  <Text className="text-sm font-medium text-gray-700">
                    {budget.budgetStatusName}
                  </Text>
                  <Text className="text-sm font-semibold text-[#1E4E45]">
                    {percentage.toFixed(1)}%
                  </Text>
                </View>
                <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className={`h-full ${
                      percentage > 30 ? "bg-red-500" : "bg-[#36978C]"
                    }`}
                    style={{ width: `${Math.min(percentage, 100)}%` }}
                  />
                </View>
                <Text className="text-xs text-gray-500 mt-1">
                  ₱{budget.currentAmount.toLocaleString()} spent
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {/* Summary Stats */}
      <View className="bg-white p-5 rounded-2xl mb-6 border border-gray-300">
        <Text className="text-lg font-bold text-[#1E4E45] mb-4">Summary</Text>
        <View className="space-y-3">
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-600">Total Transactions</Text>
            <Text className="font-semibold text-[#1E4E45]">
              {income.length + expenses.length}
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-600">Income Sources</Text>
            <Text className="font-semibold text-[#1E4E45]">
              {income.length}
            </Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-gray-100">
            <Text className="text-gray-600">Expense Items</Text>
            <Text className="font-semibold text-[#1E4E45]">
              {expenses.length}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600 font-semibold">Savings Rate</Text>
            <Text
              className={`font-semibold ${
                currentBalance > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {totalIncome > 0
                ? `${((currentBalance / totalIncome) * 100).toFixed(1)}%`
                : "0%"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
