import {
  Foundation,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const currentBalance = 25000;
const income = 24000;
const expenses = 4000;
const currentSpent = 8000;
const currentBudget = 25000;
const remaining = currentBudget - currentSpent;
const percentageSpent = Math.round((currentSpent / currentBudget) * 100);

export default function budgetStatus() {
  return (
    <SafeAreaView className="flex justify-center items-center gap-y-5 w-full h-full bg-[#81D8D0]">
      {/* Budget board */}
      <View className="flex w-[90%] mt-8 py-8 flex-col gap-y-5 items-center px-7 border border-[#FFFB82]/50 bg-[#FFFB82]/20 rounded-3xl">
        <View className="flex flex-row justify-between items-center w-full">
          <View className="flex flex-col gap-y-2">
            <Text>Total Budget</Text>
            <Text>₱ {currentBudget}</Text>
          </View>
          <View className="flex flex-col gap-y-2">
            <Text>Total Spent</Text>
            <Text>₱ {expenses}</Text>
          </View>
          <View className="flex flex-col gap-y-2">
            <Text>Remaining</Text>
            <Text>₱ {remaining}</Text>
          </View>
        </View>
        {/* Progress Bar */}
        <View className="bg-gray-200 rounded-full h-3 w-full mb-2">
          <View
            className="bg-[#36978C] h-full rounded-full"
            style={{ width: `${percentageSpent}%` }}
          ></View>
        </View>
        <View className="flex justify-center items-center">
          <Text>Total budget used: {percentageSpent}%</Text>
        </View>
      </View>

      {/* Budget Status */}

      <View className="flex-1 flex-col bg-[#FAF7F0] gap-y-5 p-5 border border-black/50 rounded-3xl w-[90%]">
        <View className="flex flex-row gap-3 mb-3  items-center ">
          <Foundation name="target" size={30} color="black" />
          <Text className="text-xl font-medium">Budget Status</Text>
        </View>
        <View className="flex w-full ">
          <View className="flex flex-row justify-between">
            <View className="flex flex-row gap-x-2">
              <Octicons name="dot-fill" size={24} color="purple" />
              <Text className="text-xl font-medium">Insurance</Text>
            </View>
            <View className="flex flex-row gap-x-2">
              <Text className="text-lg font-medium">₱ 5,000 / </Text>
              <Text className="text-lg font-medium">P10,000</Text>
            </View>
          </View>
          <View className="items-end">
            <Text>{percentageSpent} %</Text>
          </View>
          <View className="bg-gray-200 rounded-full h-3 w-full mb-2">
            <View
              className="bg-[#36978C] h-full rounded-full"
              style={{ width: `${percentageSpent}%` }}
            ></View>
          </View>
        </View>
      </View>

      {/* Budget buttons */}
      <View className="flex flex-row justify-between w-[90%]">
        <View className="flex flex-row items-center justify-center gap-3 py-4 px-5 border border-black/50 bg-[#FFFDC2] rounded-3xl">
          <Foundation name="target" size={24} color="black" />
          <Text className="text-base font-medium">Set New Budget</Text>
        </View>
        <View className="flex flex-row items-center justify-center gap-3 py-4 px-5 border border-black/50 bg-[#36978C] rounded-3xl">
          <MaterialCommunityIcons
            name="rename-box-outline"
            size={24}
            color="black"
          />
          <Text className="text-base font-medium">Adjust Categories</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
