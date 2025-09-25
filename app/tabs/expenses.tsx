import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import { Alert, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddExpenses from "../components/expenses/addExpenses";
import ExpensesList from "../components/expenses/expensesList";

export default function income() {
  const [clickAddIncome, setClickAddIncome] = useState<boolean>(false);

  // keep your separate state variables as you 
  const [userCredentialsID, setUserCredentialsID] = useState<Id<"userCredentials"> | null>(null)
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<number>(59000);
  const [insuranceExpenses, setInsuranceExpeses] = useState<number>(29000)
  const [gameExpenses, setGameExpenses] = useState<number>(2000)
  const [billExpenses, setBillExpenses] = useState<number>(19000)
  const [groceryExpenses, setGroceryExpenses] = useState<number>(9000)
  const [otherExpenses, setOtherExpenses] = useState<number>(900)

  const [toggleShowBalance, setToggleShowBalance] = useState<boolean>(true);

  const totalExpenses = useQuery(
    api.functions.expenses.totalExpenses.totalExpenses,
    userCredentialsID ? { userCredentialsID } : "skip"
  )
  
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user")
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setUserCredentialsID(user.id || "")
        }
      } catch (error) {
        Alert.alert('Error Local Storage [Income List]', 'Error retrieving data in local storage')
      }
    }

    loadUserInfo()
  }, [])

  useEffect(() => {
    if(totalExpenses !== undefined) setTotalMonthlyIncome(totalExpenses)
  }, [totalExpenses])

  return (
    <SafeAreaView className="flex-1 w-full h-full bg-[#81D8D0] p-3 gap-y-[1%]">
      {/* Add Income control */}
      <View className="flex flex-[0.06] justify-end items-end">
        <TouchableOpacity
          className="bg-[#D9D9D9] rounded-3xl px-5 py-2 border border-r-black"
          onPress={() => setClickAddIncome(true)}
        >
          <Text className="text-base text-[#616161]">+ Add Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* Total Monthly Income */}
      <View className="flex flex-[0.15] py-2 px-8 flex-row justify-between items-center bg-red-100 rounded-3xl">
        <View>
          <Image
            source={require("../../assets/images/Expenses-Arrow.png")}
            style={{ width: 80, height: 50 }}
          />
        </View>

        <View className="flex gap-y-2">
          <View>
            <Text className="text-xl text-[#676565]">Total Monthly Expenses</Text>
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-3xl text-[#FAF7F0]">
              ₱ {toggleShowBalance ? totalMonthlyIncome : "****"}
            </Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setToggleShowBalance(!toggleShowBalance)}
            >
              <Ionicons name={toggleShowBalance ? "eye" : "eye-off"} size={28} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Income Category (explicit cards, no array) */}
      <View className="flex-[0.35] justify-center items-center">
        <View className="flex-row flex-wrap w-full h-full gap-y-3 p-4 justify-between bg-[#FAF7F0] rounded-3xl">
          <View className="flex justify-center items-center w-[48%] h-[25%] bg-red-200 rounded-xl">
            <Text className="font-semibold">Insurance</Text>
            <Text className="text-red-600 font-bold">₱ {insuranceExpenses}</Text>
          </View>

          <View className="flex justify-center items-center w-[48%] h-[25%] bg-red-200 rounded-xl">
            <Text className="font-semibold">Game</Text>
            <Text className="text-red-600 font-bold">₱ {gameExpenses}</Text>
          </View>

          <View className="flex justify-center items-center w-[48%] h-[25%] bg-red-200 rounded-xl">
            <Text className="font-semibold">Bills</Text>
            <Text className="text-red-600 font-bold">₱ {billExpenses}</Text>
          </View>

          <View className="flex justify-center items-center w-[48%] h-[25%] bg-red-200 rounded-xl">
            <Text className="font-semibold">Grocery</Text>
            <Text className="text-red-600 font-bold">₱ {groceryExpenses}</Text>
          </View>

          <View className="flex justify-center items-center w-[48%] h-[25%] bg-red-200 rounded-xl">
            <Text className="font-semibold">Other</Text>
            <Text className="text-red-600 font-bold">₱ {otherExpenses}</Text>
          </View>
        </View>
      </View>

      {/* Income List (keeps your existing component) */}
      <View className="flex-[0.45] justify-center items-center">
        <ExpensesList />
      </View>

      {/* Add Income Modal */}
      <Modal
        visible={clickAddIncome}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClickAddIncome(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="flex justify-center items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg">
            <AddExpenses />

            <TouchableOpacity
              className="p-2 mt-2 bg-green-400 rounded-lg"
              onPress={() => setClickAddIncome(false)}
            >
              <Text className="text-2xl font-bold text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
