import { View, Text, FlatList, Image } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "expo-router";
import React from "react";
import api from "../../../api/api";

import "../../../assets/images/add_income_icon.png";
import "../../../assets/images/add_expenses_icon.png";

interface ExpensesHistoryItem {
  _id: string;
  userId: string;
  expensesName: string;
  expensesCategory: "Insurance" | "Bills" | "Hobby" | "Daily need" | "Other";
  amount: number;
  datePaid: string;
  frequency: string;
}

interface IncomeHistoryItem {
  _id: string;
  userId: string;
  incomeName: string;
  incomeCategory: "Work" | "Investment" | "Savings" | "Side Hustle" | "Other";
  amount: number;
  paidDate: string;
  frequency: string;
}

interface FormattedTransaction {
  _id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  type: "expense" | "income";
}

export default function RecentTransactionList() {
  const defaultIncomeIcon = require("../../../assets/images/add_income_icon.png");
  const defaultExpenseIcon = require("../../../assets/images/add_expenses_icon.png");

  const [expensesHistory, setExpensesHistory] = useState<ExpensesHistoryItem[]>([]);
  const [incomeHistory, setIncomeHistory] = useState<IncomeHistoryItem[]>([]);

  // useFocusEffect refreshes data on tab focus
  useFocusEffect(
    useCallback(() => {
      let isActive = true; // Prevents state updates if component unmounts mid-request

      const fetchHistory = async () => {
        try {
          const [expensesRes, incomeRes] = await Promise.all([
            api.get("/history/readExpensesHistory"),
            api.get("/history/readIncomeHistory"),
          ]);

          if (isActive) {
            if (expensesRes.status === 200) {
              setExpensesHistory(expensesRes.data.history);
            }
            if (incomeRes.status === 200) {
              setIncomeHistory(incomeRes.data.history);
            }
          }
        } catch (error) {
          console.error("Failed to fetch transaction history", error);
        }
      };

      fetchHistory();

      return () => {
        isActive = false; // Cleanup function
      };
    }, [])
  );

  // Formatting and Sorting Logic
  const formattedTransactions: FormattedTransaction[] = [
    ...expensesHistory.map((item) => ({
      _id: item._id,
      name: item.expensesName,
      category: item.expensesCategory,
      amount: item.amount,
      date: item.datePaid.split("T")[0],
      type: "expense" as const,
    })),
    ...incomeHistory.map((item) => ({
      _id: item._id,
      name: item.incomeName,
      category: item.incomeCategory,
      amount: item.amount,
      date: item.paidDate.split("T")[0],
      type: "income" as const,
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const renderItem = ({ item }: { item: FormattedTransaction }) => {
    const isIncome = item.type === "income";
    const amountColor = isIncome ? "text-green-800" : "text-red-700";
    const sign = isIncome ? "+" : "-";
    const iconSource = isIncome ? defaultIncomeIcon : defaultExpenseIcon;
    
    return (
      <View className="flex-row w-full items-center justify-between py-3.5">
        {/* Left Side */}
        <View className="flex-row items-center gap-x-3 ">
          <View className="rounded-full ">
            <Image source={iconSource} style={{ width: 30, height: 30 }} />
          </View>

          <View>
            <Text className="text-white text-base font-semibold">
              {item.name}
            </Text>
            <Text className="text-[#D9F8F7] text-sm ">{item.category}</Text>
          </View>
        </View>

        {/* Right Side */}
        <View className="items-end">
          <Text className={`text-base font-semibold ${amountColor}`}>
            {sign} ₱{item.amount.toLocaleString()}
          </Text>
          <Text className="text-[#D9F8F7] text-sm">{item.date}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className="overflow-hidden">
      <FlatList
        data={formattedTransactions}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View className="h-px bg-white/25" />}
      />
    </View>
  );
}