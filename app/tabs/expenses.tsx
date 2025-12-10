import React, { useCallback, useEffect, useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";

// CUSTOM IMPORTS
import api from "../../api/api";
import ExpensesHistory from "../components/expenses/expensesHistory";
import ExpensesList from "../components/expenses/expensesList";
import CategoriesAmount from "../components/categoriesAmount";
import ReusableModal from "../components/reusableModal";
import AddExpenses from "../components/expenses/addExpenses";

// Interface matching Backend Schema
interface Expense {
  _id: string;
  expensesName: string;
  expensesCategory: "Insurance" | "Bills" | "Hobby" | "Daily Need" | "Other";
  amount: number;
  frequency: string;
  datePaid: string;
}

export default function ExpensesScreen() {
  // --- UI STATE ---
  const [clickAddExpense, setClickAddExpense] = useState<boolean>(false);
  const [toggleShowBalance, setToggleShowBalance] = useState<boolean>(true);
  const [clickHistory, setClickHistroy] = useState<boolean>(false);

  // --- DATA STATE ---
  const [expensesList, setExpensesList] = useState<Expense[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // --- CALCULATION STATE ---
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState<number>(0);
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

  // 2. FETCH DATA FUNCTION
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

  // 3. FETCH ON TAB FOCUS
  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  // 4. FETCH ON TRIGGER (Add/Delete/Update)
  useEffect(() => {
    if (refreshKey > 0) {
      fetchExpenses();
    }
  }, [refreshKey]);

  // 5. CALCULATE TOTALS AUTOMATICALLY
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

      switch (item.expensesCategory) {
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
  const monthlyExpenses = expensesList.filter(
    (item) => item.frequency === "Monthly"
  );

  return (
    <SafeAreaView className="flex w-full h-full bg-[#81D8D0] p-3 gap-y-[1%]">
      {/* --- ADD BUTTON --- */}
      <View className="flex justify-end items-end">
        <TouchableOpacity
          className="bg-[#D9D9D9] rounded-3xl px-5 py-2 border border-black/20"
          onPress={() => setClickAddExpense(true)}
        >
          <Text className="text-base text-[#616161]">+ Add Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* --- TOTAL EXPENSES CARD --- */}
      <View className="flex py-2 px-8 flex-row justify-between items-center border border-red-500/20 bg-[#9A4949]/20 rounded-3xl">
        <View>
          <Image
            source={require("../../assets/images/Expenses-Arrow.png")}
            style={{ width: 100, height: 90 }}
          />
        </View>

        <View className="flex gap-y-2">
          <View>
            <Text className="text-xl font-semibold text-[#676565]">
              Total Monthly Expenses
            </Text>
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-3xl font-semibold text-red-600">
              ₱{" "}
              {toggleShowBalance
                ? totalMonthlyExpenses.toLocaleString()
                : "****"}
            </Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setToggleShowBalance(!toggleShowBalance)}
            >
              <Ionicons
                name={toggleShowBalance ? "eye" : "eye-off"}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* --- CATEGORIES CHART --- */}
      <CategoriesAmount
        title="Expenses Category"
        categories={categoriesData}
        color="red"
        allItems={monthlyExpenses}
      />

      {/* --- EXPENSES LIST / HISTORY --- */}
      <View className="flex-1 gap-2">
        <View className="flex justify-between flex-row items-start">
          <TouchableOpacity
            className={`${clickHistory ? "bg-[#969799]" : "bg-[#FECACA]"} py-2 px-4 rounded-full`}
            activeOpacity={1}
            onPress={() => setClickHistroy(!clickHistory)}
          >
            <Text
              className={`${clickHistory ? "text-white" : "text-black"} font-medium text-lg tracking-wider`}
            >
              {clickHistory ? "< History" : "Active >"}
            </Text>
          </TouchableOpacity>
        </View>

        {clickHistory ? (
          <ExpensesHistory />
        ) : (
          <ExpensesList data={expensesList} refreshTrigger={triggerRefresh} />
        )}
      </View>

      {/* --- ADD EXPENSES MODAL --- */}
      <ReusableModal
        visible={clickAddExpense}
        onRequestClose={() => setClickAddExpense(false)}
      >
        <AddExpenses
          closeModal={() => setClickAddExpense(false)}
          onSuccess={() => {
            setClickAddExpense(false);
            triggerRefresh();
          }}
        />
      </ReusableModal>
    </SafeAreaView>
  );
}
