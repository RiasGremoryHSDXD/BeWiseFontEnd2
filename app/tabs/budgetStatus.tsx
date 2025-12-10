import React, { useCallback, useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";

// CUSTOM IMPORTS
import api from "../../api/api";
import ShowCategory from "../components/budgetStatus/showCategory";

interface Expense {
  _id: string;
  expensesName: string;
  expenseCategory: "Insurance" | "Bills" | "Hobby" | "Daily Need" | "Other";
  amount: number;
  frequency: string;
  datePaid: string;
}

interface Income {
  _id: string;
  incomeName: string;
  incomeCategory: "Work" | "Investment" | "Savings" | "Side Hustle" | "Other";
  amount: number;
  frequency: string;
  expectedPayOut: string;
}

export default function BudgetStatus() {
  // --- DATA STATE ---
  const [expensesList, setExpensesList] = useState<Expense[]>([]);
  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // --- CALCULATION STATE ---
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState<number>(0);
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<number>(0);

  const [categoriesData, setCategoriesData] = useState([
    { label: "Insurance", amount: 0 },
    { label: "Bills", amount: 0 },
    { label: "Hobby", amount: 0 },
    { label: "Daily Need", amount: 0 },
    { label: "Other", amount: 0 },
  ]);

  // 1. REFRESH TRIGGER
  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // 2. FETCH EXPENSES
  const fetchExpenses = async () => {
    try {
      const response = await api.get("/expenses/readExpense");
      if (response.status === 200) {
        setExpensesList(response.data.expenses);
      }
    } catch (error) {
      console.error("Failed to fetch expenses", error);
    }
  };

  // 3. FETCH INCOME (NEW!)
  const fetchIncome = async () => {
    try {
      const response = await api.get("/income/readIncome");
      if (response.status === 200) {
        setIncomeList(response.data.income);
      }
    } catch (error) {
      console.error("Failed to fetch income", error);
    }
  };

  // 4. FETCH ON TAB FOCUS
  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
      fetchIncome(); // Fetch income too!
    }, [])
  );

  // 5. FETCH ON TRIGGER (Add/Delete/Update)
  useEffect(() => {
    if (refreshKey > 0) {
      fetchExpenses();
      fetchIncome();
    }
  }, [refreshKey]);

  // 6. CALCULATE EXPENSE TOTALS
  useEffect(() => {
    let total = 0;
    let insurance = 0,
      bills = 0,
      hobby = 0,
      dailyNeed = 0,
      other = 0;

    expensesList.forEach((item) => {
      if (item.frequency !== "Monthly") return;

      const amt = Number(item.amount) || 0;
      total += amt;

      switch (item.expenseCategory) {
        case "Insurance":
          insurance += amt;
          break;
        case "Bills":
          bills += amt;
          break;
        case "Hobby":
          hobby += amt;
          break;
        case "Daily Need":
          dailyNeed += amt;
          break;
        case "Other":
          other += amt;
          break;
      }
    });

    setTotalMonthlyExpenses(total);
    setCategoriesData([
      { label: "Insurance", amount: insurance },
      { label: "Bills", amount: bills },
      { label: "Hobby", amount: hobby },
      { label: "Daily Need", amount: dailyNeed },
      { label: "Other", amount: other },
    ]);
  }, [expensesList]);

  // 7. CALCULATE INCOME TOTAL (NEW!)
  useEffect(() => {
    let total = 0;

    incomeList.forEach((item) => {
      if (item.frequency !== "Monthly") return;
      const amt = Number(item.amount) || 0;
      total += amt;
    });

    setTotalMonthlyIncome(total);
  }, [incomeList]);

  const monthlyExpenses = expensesList.filter(
    (item) => item.frequency === "Monthly"
  );

  const remaining = totalMonthlyIncome - totalMonthlyExpenses;
  const percentageSpent =
    totalMonthlyIncome > 0
      ? Math.round((totalMonthlyExpenses / totalMonthlyIncome) * 100)
      : 0;

  return (
    <SafeAreaView className="flex w-full h-full bg-[#81D8D0] p-3 gap-y-[1%]">
      {/* --- TOTAL EXPENSES CARD --- */}
      <View className="py-6 px-8 flex-col gap-y-4 items-center bg-[#FFFB82]/20 border border-[#FFFB82]/60 rounded-3xl mt-5">
        <View className="flex flex-row justify-between items-center w-full">
          <View className="flex flex-col justify-center items-center">
            <Text className="text-base font-semibold text-[#777777]">
              Total Budget
            </Text>
            <Text className="text-xl font-medium">
              ₱ {totalMonthlyIncome.toLocaleString()}
            </Text>
          </View>
          <View className="flex flex-col justify-center items-center">
            <Text className="text-base font-semibold text-[#777777]">
              Total Spent
            </Text>
            <Text className="text-xl font-medium ">
              ₱ {totalMonthlyExpenses.toLocaleString()}
            </Text>
          </View>
          <View className="flex flex-col justify-center items-center">
            <Text className="text-base font-semibold text-[#777777] ">
              Remaining
            </Text>
            <Text className=" text-xl font-medium ">
              ₱ {remaining.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="bg-gray-200 rounded-full h-3 w-full">
          <View
            className="bg-[#36978C] h-full rounded-full"
            style={{ width: `${Math.min(percentageSpent, 100)}%` }}
          />
        </View>

        <Text className="text-base">Total budget used: {percentageSpent}%</Text>
      </View>

      {/* --- CATEGORIES CHART --- */}
      <ShowCategory
        title="Budget Status"
        categories={categoriesData}
        allItems={monthlyExpenses}
        totalBudget={totalMonthlyIncome}
      />
    </SafeAreaView>
  );
}
