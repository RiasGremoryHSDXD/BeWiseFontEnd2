import Ionicons from "@react-native-vector-icons/ionicons";
import React, { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddExpenses from "../components/expenses/addExpenses";
import ExpensesList from "../components/expenses/expensesList";

export default function income() {
  const [clickAddIncome, setClickAddIncome] = useState<boolean>(false);

  // keep your separate state variables as you requested
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<number>(59000);
<<<<<<< HEAD
  const [workIncome, setWorkIncome] = useState<number>(29000);
  const [investmentIncome, setInvestmentIncome] = useState<number>(19000);
  const [otherIncome, setOtherIncome] = useState<number>(900);
  const [savingIncome, setSavingIncome] = useState<number>(2000);
  const [sideHustleIncome, setSideHustleIncome] = useState<number>(9000);
  const [toogleShowBalance, setToogleShowBalance] = useState<boolean>(true);
  const [clickAddExpenses, setClickAddExpenses] = useState<boolean>(false);
=======
  const [insuranceExpenses, setInsuranceExpeses] = useState<number>(29000)
  const [gameExpenses, setGameExpenses] = useState<number>(2000)
  const [billExpenses, setBillExpenses] = useState<number>(19000)
  const [groceryExpenses, setGroceryExpenses] = useState<number>(9000)
  const [otherExpenses, setOtherExpenses] = useState<number>(900)

  const [toggleShowBalance, setToggleShowBalance] = useState<boolean>(true);
>>>>>>> 6e6e597bc3cf0b03b846a66b1cbe3d468b3ecf2f

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

<<<<<<< HEAD
      {/*Income Categories */}
      <View className="flex flex-1 bg-[#FAF7F0] px-8 py-5 gap-5 rounded-3xl w-[90%]">
        {/* Head */}
        <View>
          <Text className="text-2xl font-medium">Expenses categories</Text>
        </View>
        <TouchableOpacity className="border border-slate-500 bg-black/5 self-start rounded-lg py-7 px-14">
          <FontAwesome6 name="plus" size={24} color="gray" />
        </TouchableOpacity>
        {/* Content */}
        <View className="flex flex-col"></View>
      </View>
=======
      {/* Income Category (explicit cards, no array) */}
      <View className="flex-[0.35] justify-center items-center">
        <View className="flex-row flex-wrap w-full h-full gap-y-3 p-4 justify-between bg-[#FAF7F0] rounded-3xl">
          <View className="flex justify-center items-center w-[48%] h-[25%] bg-red-200 rounded-xl">
            <Text className="font-semibold">Insurance</Text>
            <Text className="text-red-600 font-bold">₱ {insuranceExpenses}</Text>
          </View>
>>>>>>> 6e6e597bc3cf0b03b846a66b1cbe3d468b3ecf2f

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
<<<<<<< HEAD
        <View className="flex-1 bg-black/70 justify-center items-center">
          <View className="flex gap-3 justify-center border border-[#36978C] items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg">
            <AddExpenses />
            <View className="border-b-2 border-dashed border-[#36978C] w-full mt-6" />
            <TouchableOpacity
              className="p-2 mt-6 border border-green-800 rounded-lg"
              onPress={() => setClickAddExpenses(false)}
            >
              <Text className="text-2xl text-green-800 font-bold ">Close</Text>
=======
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="flex justify-center items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg">
            <AddExpenses />

            <TouchableOpacity
              className="p-2 mt-2 bg-green-400 rounded-lg"
              onPress={() => setClickAddIncome(false)}
            >
              <Text className="text-2xl font-bold text-white">Close</Text>
>>>>>>> 6e6e597bc3cf0b03b846a66b1cbe3d468b3ecf2f
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
