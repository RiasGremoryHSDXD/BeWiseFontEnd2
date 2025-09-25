import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddExpenses from "../components/expenses/addExpenses";
import ExpensesList from "../components/expenses/expensesList";

export default function income() {
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<number>(59000);
  const [workIncome, setWorkIncome] = useState<number>(29000);
  const [investmentIncome, setInvestmentIncome] = useState<number>(19000);
  const [otherIncome, setOtherIncome] = useState<number>(900);
  const [savingIncome, setSavingIncome] = useState<number>(2000);
  const [sideHustleIncome, setSideHustleIncome] = useState<number>(9000);
  const [toogleShowBalance, setToogleShowBalance] = useState<boolean>(true);
  const [clickAddExpenses, setClickAddExpenses] = useState<boolean>(false)

  return (
    <SafeAreaView className="flex-1 justify-center gap-5 items-center w-full  bg-[#81D8D0]">
      <View className="flex flex-row mt-8 justify-between items-center w-[90%]">
        <TouchableOpacity
          className="bg-[#D9D9D9] rounded-3xl px-5 py-2 self-start border border-r-black"
          onPress={() => setClickAddExpenses(true)}
        >
          <Text className="text-base text-[#616161]">+ Add Expense</Text>
        </TouchableOpacity>
      </View>

      {/*Current Monthly Expenses  */}
      <View className="flex w-[90%] p-8 flex-row justify-between items-center  bg-[#9A4949]/15 rounded-3xl">
        <View>
          <Image
            source={require("../../assets/images/Expenses-Arrow.png")}
            style={{ width: 80, height: 50 }}
          ></Image>
        </View>
        <View className="flex gap-y-2 ">
          <View>
            <Text className="text-xl text-[#676565]">
              Total Monthly Expenses
            </Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text className="text-3xl text-[#FAF7F0]">
              ₱ {toogleShowBalance ? totalMonthlyIncome : "****"}
            </Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setToogleShowBalance(!toogleShowBalance)}
            >
              <Ionicons
                name={toogleShowBalance ? `eye` : `eye-off`}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/*Income Categories */}
      <View className="flex flex-row justify-between bg-[#FAF7F0] px-8 py-5 gap-5 rounded-3xl w-[90%] h-[40%]">
        
        <View
          className="flex gap-y-2"
        >
          <View
            className=" bg-gray-200 flex justify-center items-center pt-5 pb-5 pr-8 pl-8 rounded-xl"
          >
            <Text className="font-semibold">Insurance</Text>
            <Text className="text-red-400">₱ 29,000</Text>
          </View>

          <View
            className="bg-gray-200 flex justify-center items-center pt-5 pb-5 pr-8 pl-8 rounded-xl"
          >
            <Text className="font-semibold">Bills</Text>
            <Text className="text-red-400">₱ 19,000</Text>
          </View>


          <View
            className="bg-gray-200 flex justify-center items-center pt-5 pb-5 pr-8 pl-8 rounded-xl"
          >
            <Text className="font-semibold">Other</Text>
            <Text className="text-red-400">₱ 900</Text>
          </View>
        </View>
        
        <View
          className="flex gap-y-2"
        >
          <View
            className="bg-gray-200 flex justify-center items-center pt-5 pb-5 pr-8 pl-8 rounded-xl"
          >
            <Text className="font-semibold">Game</Text>
            <Text className="text-red-400">₱ 2,000</Text>
          </View>

          <View
            className="bg-gray-200 flex justify-center items-center pt-5 pb-5 pr-8 pl-8 rounded-xl"
          >
            <Text className="font-semibold">Grocery</Text>
            <Text className="text-red-400">₱ 9,000</Text>
          </View>
        </View>
      </View>

      {/*Expenses List */}
      <ExpensesList/>

      <Modal
        visible={clickAddExpenses}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClickAddExpenses(false)}
      >
        
        <View
          className="flex-1 bg-black/50 justify-center items-center"
        >
          <View
            className="flex justify-center items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg"
          >
            <AddExpenses/>

            <TouchableOpacity
              className="p-2 mt-2 bg-green-400 rounded-lg"
              onPress={() => setClickAddExpenses(false)}
            >
              <Text
                className="text-2xl font-bold text-white"
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>

      </Modal>
    </SafeAreaView>
  );
}
