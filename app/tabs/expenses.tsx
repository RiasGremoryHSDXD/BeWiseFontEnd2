import React, { useCallback, useEffect, useState } from "react";
import {
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";

// CUSTOM IMPORTS
import api from "../../api/api"; 
import AddExpenses from "../components/expenses/addExpenses";
import ExpensesHistory from "../components/expenses/expensesHistory";
import ExpensesList from "../components/expenses/expensesList";
import CategoriesAmount from "../components/categoriesAmount";
import ReusableModal from "../components/reusableModal";

// Interface matching Backend Schema
interface Expense {
  _id: string;
  expensesName: string;
  expensesCategory: "Insurance" | "Bills" | "Game" | "Grocery" | "Other";
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
    { label: 'Insurance', amount: 0 },
    { label: 'Bills', amount: 0 },
    { label: 'Game', amount: 0 },
    { label: 'Grocery', amount: 0 },
    { label: 'Other', amount: 0 },
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
        setExpensesList(response.data.expenses); // Backend returns object { expenses: [...] }
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
    let insurance = 0, bills = 0, game = 0, grocery = 0, other = 0;

    expensesList.forEach((item) => {
      const amt = Number(item.amount) || 0;
      total += amt;

      switch (item.expensesCategory) {
        case "Insurance": insurance += amt; break;
        case "Bills": bills += amt; break;
        case "Game": game += amt; break;
        case "Grocery": grocery += amt; break;
        case "Other": other += amt; break;
      }
    });

    setTotalMonthlyExpenses(total);
    setCategoriesData([
        { label: 'Insurance', amount: insurance },
        { label: 'Bills', amount: bills },
        { label: 'Game', amount: game },
        { label: 'Grocery', amount: grocery },
        { label: 'Other', amount: other },
    ]);
  }, [expensesList]);

  return (
    <SafeAreaView className="flex w-full h-full bg-[#81D8D0] p-3 gap-y-[1%]">
      {/* --- ADD BUTTON --- */}
      <View className="flex justify-end items-end">
        <TouchableOpacity
          className="bg-[#D9D9D9] rounded-3xl px-5 py-2 border border-r-black"
          onPress={() => setClickAddExpense(true)}
        >
          <Text className="text-base text-[#616161]">+ Add Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* --- TOTAL EXPENSES CARD --- */}
      <View className="flex py-5 px-8 flex-row justify-between items-center border border-red-500/20 bg-[#9A4949]/20 rounded-3xl">
        <View>
          <Image
            source={require("../../assets/images/Expenses-Arrow.png")}
            style={{ width: 60, height: 60 }}
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
              ₱ {toggleShowBalance ? totalMonthlyExpenses.toLocaleString() : "****"}
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
      />

      {/* --- EXPENSES LIST / HISTORY --- */}
      <View className="flex-1 gap-2">
        <View className="flex justify-center items-start">
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
            <ExpensesList 
                data={expensesList}
                refreshTrigger={triggerRefresh}
            />
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