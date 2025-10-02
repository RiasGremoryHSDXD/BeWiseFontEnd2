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
    <SafeAreaView className="flex w-full h-full bg-[#81D8D0] p-3 gap-y-3">
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
      <View className="flex flex-row justify-between items-center border border-red-500/20 bg-[#9A4949]/15 rounded-3xl">
        <View className="ml-4">
          <Image
            source={require("../../assets/images/Expenses-Arrow.png")}
            style={{ width: 120, height: 100 }}
          />
        </View>

        <View className="flex gap-y-2 p-8 ">
          <View>
            <Text className="text-xl font-semibold text-[#676565]/80">
              Total Monthly Expenses
            </Text>
          </View>

          <View className="flex flex-row justify-between ">
            <Text className="text-3xl text-white">
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

      {/* Expenses Category (explicit cards, no array) */}
      <View className="flex w-full py-6 px-4 bg-[#FAF7F0] gap-5 rounded-3xl ">
        <View className="w-full">
          <Text className="text-xl font-semibold">Income Categories</Text>
        </View>
        <View className="flex-row flex-wrap justify-between gap-4">
          <View className="flex border p-3 border-black/15 justify-center items-center w-[48%] bg-[#F2ECEC] rounded-xl">
            <Text className="text-lg font-medium">Insurance</Text>
            <Text className="text-lg text-red-600 font-medium">
              ₱ {insuranceExpenses}
            </Text>
          </View>

          <View className="flex border p-3 border-black/15 justify-center items-center w-[48%] bg-[#F2ECEC] rounded-xl">
            <Text className="text-lg font-medium">Bill</Text>
            <Text className="text-lg text-red-600 font-medium">
              ₱ {billExpenses}
            </Text>
          </View>

          <View className="flex border p-3 border-black/15 justify-center items-center w-[48%] bg-[#F2ECEC] rounded-xl">
            <Text className="text-lg font-medium">Game</Text>
            <Text className="text-lg text-red-600 font-medium">
              ₱ {gameExpenses}
            </Text>
          </View>

          <View className="flex border p-3 border-black/15 justify-center items-center w-[48%] bg-[#F2ECEC] rounded-xl">
            <Text className="text-lg font-medium">Grocery</Text>
            <Text className="text-lg text-red-600 font-medium">
              ₱ {groceryExpenses}
            </Text>
          </View>

          <View className="flex border p-3 border-black/15 justify-center items-center w-[48%] bg-[#F2ECEC] rounded-xl">
            <Text className="text-lg font-medium">Other</Text>
            <Text className="text-lg text-red-600 font-medium">
              ₱ {otherExpenses}
            </Text>
          </View>
        </View>
      </View>

      {/* Expenses List  */}
      <View className="flex-1">
        <View className="flex flex-row w-full justify-between mb-2">
          <TouchableOpacity className="p-2 bg-green-200 rounded-lg items-center justify-center">
            <Text className="text-lg font-medium"> Active </Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center justify-center">
            <Text className="text-lg font-medium text-[#ffffff]">
              History {">"}
            </Text>
          </TouchableOpacity>
        </View>
        <ExpensesList />
      </View>

      {/* Add Expenses Modal */}
      <Modal
        visible={clickAddExpense}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClickAddExpense(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center">
          <View className="flex justify-center items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg gap-y-5">
            <AddExpenses />
            <TouchableOpacity
              className="p-2 mt-2 border rounded-lg"
              onPress={() => setClickAddExpense(false)}
            >
              <Text className="text-2xl font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
