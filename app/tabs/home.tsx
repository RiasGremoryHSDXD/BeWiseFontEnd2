import { FontAwesome6, Foundation } from "@expo/vector-icons";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function home() {
  const [toogleShowBalance, setToogleShowBalance] = useState<boolean>(true);

  const currentBalance = 25000;
  const income = 24000;
  const expenses = 4000;
  const currentSpent = 8000;
  const currentBudget = 25000;
  const percentageSpent = Math.round((currentSpent / currentBudget) * 100);

  return (
    <SafeAreaView className="flex-1 justify-center gap-5 items-center w-full bg-[#81D8D0]">
      <View className="w-[90%] mt-8"></View>

      {/*Current Balance*/}
      <View className="flex w-[90%] py-8 flex-row justify-between items-center px-5 bg-white/30 rounded-3xl">
        <View className="flex gap-y-2">
          <Text className="text-xl color-[#676565]">Current Balance</Text>

          <View className="flex flex-row gap-2">
            <FontAwesome6 name="peso-sign" size={30} color="black" />

            <Text className="text-3xl">
              {toogleShowBalance ? currentBalance : "****"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setToogleShowBalance(!toogleShowBalance)}
        >
          <Ionicons name={toogleShowBalance ? `eye` : `eye-off`} size={32} />
        </TouchableOpacity>
      </View>

      {/*Total Income  & Expenses*/}
      <View className="flex flex-row gap-5 w-[90%]">
        {/*Income */}
        <View className="flex-1 flex-row w-full  bg-white gap-5 py-3 px-4 items-center rounded-3xl ">
          <View>
            <Image
              source={require("../../assets/images/Income_icon.png")}
              style={{ width: 30, height: 30 }}
            ></Image>
          </View>
          <View>
            <Text>Income</Text>
            <Text className="text-xl text-green-500">₱ {income}</Text>
          </View>
        </View>

        {/* Expenses*/}
        <View className="flex-1 flex-row gap-5 py-3 px-4 items-center w-full bg-white rounded-3xl">
          <View>
            <Image
              source={require("../../assets/images/expenses_icon.png")}
              style={{ width: 30, height: 30 }}
            ></Image>
          </View>
          <View>
            <Text>Expenses</Text>
            <Text className="text-xl text-red-500">₱ {expenses}</Text>
          </View>
        </View>
      </View>

      {/* Monthly Budget */}
      <View className="flex w-[90%] bg-[#FAF7F0] p-5 rounded-3xl gap-y-4">
        {/* head */}
        <View className="flex flex-row gap-3 items-center ">
          <Foundation name="target" size={30} color="black" />
          <Text className="text-xl">Monthly Budget</Text>
        </View>
        {/* sub-head */}
        <View className="flex flex-row justify-between">
          <Text className="text-base">Spent: ₱ {currentSpent}</Text>
          <Text className="text-base">Budget: ₱ {currentBudget}</Text>
        </View>

        {/*Progress Bar */}
        <View className="bg-gray-200 rounded-full h-3 mb-2">
          <View
            className="bg-[#36978C] h-full rounded-full"
            style={{ width: `${percentageSpent}%` }}
          ></View>
        </View>

        {/*Progress Text */}
        <View className="flex justify-center items-center">
          <Text>Total budget used: {percentageSpent}%</Text>
        </View>
      </View>

      {/*Recent Transaction Table*/}
      <View className="flex-1 gap-y-5 w-[90%] p-5 bg-[#36978C] rounded-3xl">
        {/* head */}
        <View className="flex flex-row justify-between">
          <Text className="text-lg text-white">Recent Transactions</Text>
        </View>
        {/* data */}
        <View className=" flex-1 items-center justify-center">
          <Text className="text-2xl opacity-50">No Recent Transactions</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
