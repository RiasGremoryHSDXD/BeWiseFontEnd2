import React from "react";
import {
  View,
  Text,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { PieChart } from "react-native-chart-kit";
import {
  dummyBudgetStatus,
  dummyExpenses,
  dummyIncome,
  dummyBalance,
} from "../../../convex/functions/seedDummyData";

const screenWidth = Dimensions.get("window").width;

interface Props {
  onClose: () => void;
}

export default function Analytics({ onClose }: Props) {
  // Calculate totals
  const totalIncome = dummyIncome.reduce((sum, i) => sum + i.amount, 0);
  const totalExpenses = dummyExpenses.reduce((sum, e) => sum + e.amount, 0);
  const currentBalance = dummyBalance.reduce(
    (sum, b) => sum + b.currentBalance,
    0
  );

  // Expenses by Category
  const categoryTotals: Record<string, number> = dummyExpenses.reduce(
    (acc, expense) => {
      acc[expense.expensesCategory] =
        (acc[expense.expensesCategory] || 0) + expense.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  const categoryLabels = Object.keys(categoryTotals);
  const categoryAmounts: number[] = Object.values(categoryTotals);

  // Pie Chart Colors
  const colors = ["#4CAF50", "#2196F3", "#FF9800", "#E91E63", "#9C27B0"];

  const expensePieData = categoryLabels.map((label, index) => ({
    name: label,
    amount: categoryTotals[label],
    color: colors[index % colors.length],
    legendFontColor: "#333",
    legendFontSize: 12,
  }));

  return (
    <ScrollView className="flex-1 bg-[#F3FDFB] p-4">
      {/* Header */}
      <View className="flex flex-row justify-between mb-6">
        <View className="flex flex-row justify-center items-center gap-x-2">
          <Image
            source={require("../../../assets/images/AnalyticsLogo.png")}
            className="w-[32px] h-[32px]"
          ></Image>
          <Text className="text-3xl font-bold text-[#1E4E45]">Analytic</Text>
        </View>
      </View>

      {/* Balance Summary Card */}
      <View className="bg-white p-5 rounded-2xl mb-6 shadow-md">
        <Text className="text-center text-gray-500 text-sm mb-2">
          Current Balance
        </Text>
        <Text className="text-center text-4xl font-bold text-[#1E4E45] mb-4">
          ₱{currentBalance.toLocaleString()}
        </Text>

        <View className="flex-row justify-between border-t border-gray-200 pt-4">
          <View className="flex-1">
            <Text className="text-xs text-gray-500 text-center">Income</Text>
            <Text className="text-lg font-semibold text-green-600 text-center">
              ₱{totalIncome.toLocaleString()}
            </Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="flex-1">
            <Text className="text-xs text-gray-500 text-center">Expenses</Text>
            <Text className="text-lg font-semibold text-red-600 text-center">
              ₱{totalExpenses.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Expenses by Category - Pie Chart */}
      <View className="bg-white p-5 rounded-2xl mb-6 shadow-md">
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
          absolute
          style={{ alignSelf: "center" }}
        />
      </View>

      {/* Budget Status */}
      <View className="bg-white p-5 rounded-2xl mb-6 shadow-md">
        <Text className="text-lg font-bold text-[#1E4E45] mb-4">
          Budget Status
        </Text>
        {dummyBudgetStatus.map((budget, index) => {
          const percentage = (budget.currentAmount / budget.totalAmount) * 100;
          return (
            <View key={index} className="mb-4">
              <View className="flex-row justify-between mb-2">
                <Text className="text-sm font-medium text-gray-700">
                  {budget.budgetStatusName}
                </Text>
                <Text className="text-sm font-semibold text-[#1E4E45]">
                  {percentage.toFixed(0)}%
                </Text>
              </View>
              <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <View
                  className={`h-full ${
                    percentage > 80 ? "bg-red-500" : "bg-green-500"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </View>
              <Text className="text-xs text-gray-500 mt-1">
                ₱{budget.currentAmount.toLocaleString()} / ₱
                {budget.totalAmount.toLocaleString()}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
