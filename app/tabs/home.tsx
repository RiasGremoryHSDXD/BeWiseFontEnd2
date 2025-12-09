import { Foundation } from "@expo/vector-icons";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useEffect, useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import RecentTransactionList from "../components/home/recentTransactionList";
import api from "../../api/api";
import { router } from "expo-router";
interface Income {
  frequency: string;
  amount: number;
}

interface Expense {
  frequency: string;
  amount: number;
}

export default function Home() {
  const [toogleShowBalance, setToogleShowBalance] = useState<boolean>(true);

  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState(0);
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState(0);

  const percentageSpent = Math.round(
    (totalMonthlyExpenses / totalMonthlyIncome) * 100
  );
  const currentBalance = totalMonthlyIncome - totalMonthlyExpenses;

  const fetchTotals = async () => {
    try {
      const incomeRes = await api.get("/income/readIncome");
      const expenseRes = await api.get("/expenses/readExpense");

      if (incomeRes.status === 200) {
        const incomes = incomeRes.data.income;
        let totalIncome = incomes
          .filter((item: Income) => item.frequency === "Monthly")
          .reduce((sum: number, item: Income) => sum + item.amount, 0);

        setTotalMonthlyIncome(totalIncome);
      }

      if (expenseRes.status === 200) {
        const expenses = expenseRes.data.expenses;
        let totalExpenses = expenses
          .filter((item: Expense) => item.frequency === "Monthly")
          .reduce((sum: number, item: Expense) => sum + item.amount, 0);

        setTotalMonthlyExpenses(totalExpenses);
      }
    } catch (error) {
      console.log("Error fetching totals:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTotals();
    }, [])
  );

  return (
    <SafeAreaView className="h-full gap-5 items-center w-full bg-[#81D8D0]">
      <View className="w-[90%] mt-8" />

      {/* Current Balance */}
      <View className="flex w-[90%] py-5 flex-row justify-between items-center px-5 border border-white/50 bg-white/30 rounded-3xl">
        <View className="flex gap-y-2">
          <Text className="text-xl text-[#676565]">Current Balance</Text>

          <View className="flex flex-row gap-2 items-center">
            <Text className="text-4xl font-semibold">₱</Text>
            <Text className="text-3xl font-semibold">
              {toogleShowBalance
                ? (currentBalance.toLocaleString() ?? "0")
                : "****"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setToogleShowBalance(!toogleShowBalance)}
        >
          <Ionicons name={toogleShowBalance ? "eye" : "eye-off"} size={32} />
        </TouchableOpacity>
      </View>

      {/* Total Income & Expenses */}
      <View className="flex flex-row gap-5 w-[90%]">
        {/* Income */}
        <TouchableOpacity
          className="flex-1 flex-row items-center bg-white gap-5 py-3 px-4 rounded-3xl"
          onPress={() => router.push("/tabs/income")}
        >
          <Image
            source={require("../../assets/images/Income_icon.png")}
            style={{ width: 30, height: 30 }}
          />
          <View>
            <Text>Income</Text>
            <Text className="text-xl font-semibold text-green-500">
              ₱ {totalMonthlyIncome.toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>

        {/* Expenses */}
        <TouchableOpacity
          className="flex-1 flex-row items-center bg-white gap-5 py-3 px-4 rounded-3xl"
          onPress={() => router.push("/tabs/expenses")}
        >
          <Image
            source={require("../../assets/images/expenses_icon.png")}
            style={{ width: 30, height: 30 }}
          />
          <View>
            <Text>Expenses</Text>
            <Text className="text-xl font-semibold text-red-500">
              ₱ {totalMonthlyExpenses.toLocaleString()}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Monthly Budget */}
      <View className="flex w-[90%] bg-[#FAF7F0] p-5 rounded-3xl gap-y-4">
        {/* Head */}
        <View className="flex flex-row gap-3 items-center">
          <Foundation name="target" size={30} color="black" />
          <Text className="text-xl font-semibold">Monthly Budget</Text>
        </View>

        {/* Sub-head */}
        <View className="flex flex-row justify-between">
          <Text className="text-base">
            Spent: ₱ {totalMonthlyExpenses.toLocaleString()}
          </Text>
          <Text className="text-base">
            Budget: ₱ {totalMonthlyIncome.toLocaleString()}
          </Text>
        </View>

        {/* Progress Bar */}
        <View className="bg-gray-200 rounded-full h-3">
          <View
            className="bg-[#36978C] h-full rounded-full"
            style={{
              width: `${percentageSpent}%`,
              maxWidth: "100%",
            }}
          />
        </View>

        {/* Progress Text */}
        <View className="flex justify-center items-center">
          <Text>Total budget used: {percentageSpent}%</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View
        className="w-[90%] p-5 bg-[#36978C] rounded-3xl overflow-hidden flex-1"
        style={{ minHeight: 320 }}
      >
        {/* Head */}
        <View className="flex justify-start">
          <Text className="text-lg font-semibold text-white">
            Recent Transactions
          </Text>
        </View>
        <View className="pb-5">
          <RecentTransactionList />
        </View>
      </View>
    </SafeAreaView>
  );
}
