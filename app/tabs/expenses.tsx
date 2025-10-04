import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddExpenses from "../components/expenses/addExpenses";
import ExpensesHistory from "../components/expenses/expensesHistory";
import ExpensesList from "../components/expenses/expensesList";

export default function income() {
  const [clickAddExpense, setClickAddExpense] = useState<boolean>(false);

  // keep your separate state variables as you
  const [userCredentialsID, setUserCredentialsID] =
    useState<Id<"userCredentials"> | null>(null);
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState<number>(0);
  const [insuranceExpenses, setInsuranceExpeses] = useState<number>(0);
  const [gameExpenses, setGameExpenses] = useState<number>(0);
  const [billExpenses, setBillExpenses] = useState<number>(0);
  const [groceryExpenses, setGroceryExpenses] = useState<number>(0);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);
  const [toggleShowBalance, setToggleShowBalance] = useState<boolean>(true);
  const [clickHistory, setClickHistroy] = useState<boolean>(false);

  const totalExpenses = useQuery(
    api.functions.expenses.totalExpenses.totalExpenses,
    userCredentialsID ? { userCredentialsID } : "skip"
  );

  const totalEachCategoryTotalExpenses = useQuery(
    api.functions.expenses.totalEachCategoryExpenses.totalEachCategoryExpenses,
    userCredentialsID ? { userCredentialsID } : "skip"
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserCredentialsID(user.id || "");
        }
      } catch (error) {
        Alert.alert(
          "Error Local Storage [expenses.tsx file]",
          "Error retrieving data in local storage"
        );
      }
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    if (totalExpenses !== undefined) setTotalMonthlyExpenses(totalExpenses);
  }, [totalExpenses]);

  useEffect(() => {
    if (totalEachCategoryTotalExpenses !== undefined) {
      setInsuranceExpeses(totalEachCategoryTotalExpenses.Insurance);
      setBillExpenses(totalEachCategoryTotalExpenses.Bills);
      setGameExpenses(totalEachCategoryTotalExpenses.Game);
      setGroceryExpenses(totalEachCategoryTotalExpenses.Grocery);
      setOtherExpenses(totalEachCategoryTotalExpenses.Other);
    }
  }, [
    totalEachCategoryTotalExpenses,
    totalEachCategoryTotalExpenses?.Insurance,
    totalEachCategoryTotalExpenses?.Bills,
    totalEachCategoryTotalExpenses?.Game,
    totalEachCategoryTotalExpenses?.Grocery,
    totalEachCategoryTotalExpenses?.Other,
  ]);

  return (
    <SafeAreaView className="flex w-full h-full bg-[#81D8D0] p-3 gap-y-[1%]">
      {/* Add Expenses control */}
      <View className="flex  justify-end items-end">
        <TouchableOpacity
          className="bg-[#D9D9D9] rounded-3xl px-5 py-2 border border-r-black"
          onPress={() => setClickAddExpense(true)}
        >
          <Text className="text-base text-[#616161]">+ Add Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* Total Monthly Expenses */}
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
              ₱ {toggleShowBalance ? totalMonthlyExpenses : "****"}
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

      {/* Expenses Category */}
      <View className="flex flex-row flex-wrap justify-between bg-[#FAF7F0] py-6 px-4 rounded-3xl">
        <View className="w-full mb-4">
          <Text className="text-xl font-semibold">Expenses Categories</Text>
        </View>

        <View className="w-[48%] border py-3 border-black/15 justify-center items-center bg-[#F2ECEC] rounded-xl mb-4">
          <Text className="text-lg font-medium">Insurance</Text>
          <Text className="text-lg text-red-600 font-medium">₱ {insuranceExpenses}</Text>
        </View>

        <View className="w-[48%] border py-3 border-black/15 justify-center items-center bg-[#F2ECEC] rounded-xl mb-4">
          <Text className="text-lg font-medium">Bill</Text>
          <Text className="text-lg text-red-600 font-medium">₱ {billExpenses}</Text>
        </View>

        <View className="w-[48%] border py-3 border-black/15 justify-center items-center bg-[#F2ECEC] rounded-xl mb-4">
          <Text className="text-lg font-medium">Game</Text>
          <Text className="text-lg text-red-600 font-medium">₱ {gameExpenses}</Text>
        </View>

        <View className="w-[48%] border py-3 border-black/15 justify-center items-center bg-[#F2ECEC] rounded-xl mb-4">
          <Text className="text-lg font-medium">Grocery</Text>
          <Text className="text-lg text-red-600 font-medium">₱ {groceryExpenses}</Text>
        </View>
        
        <View className="w-[48%] border py-3 border-black/15 justify-center items-center bg-[#F2ECEC] rounded-xl mb-4">
          <Text className="text-lg font-medium">Other</Text>
          <Text className="text-lg text-red-600 font-medium">₱ {otherExpenses}</Text>
        </View>
      </View>


      {/**Expenses List */}
      <View className="flex-1 gap-2">
        <View className="flex justify-center items-start">
          <TouchableOpacity
            className={`${clickHistory ? "bg-[#969799]" : "bg-[#FECACA]"} py-2 px-4 rounded-full`}
            activeOpacity={1}
            onPress={() => setClickHistroy(!clickHistory)}
          >
            <Text
              className={`${clickHistory ? "text-white" : "text-black"} font-medium text-lg  tracking-wider`}
            >
              {clickHistory ? "< History" : "Active >"}
            </Text>
          </TouchableOpacity>
        </View>
        {clickHistory ? <ExpensesHistory /> : <ExpensesList />}
      </View>

      {/* Add Expenses Modal */}
      <Modal
        visible={clickAddExpense}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClickAddExpense(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="flex justify-center items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg">
            <AddExpenses />

            <TouchableOpacity
              className="p-2 mt-2 bg-green-400 rounded-lg"
              onPress={() => setClickAddExpense(false)}
            >
              <Text className="text-2xl font-bold text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
