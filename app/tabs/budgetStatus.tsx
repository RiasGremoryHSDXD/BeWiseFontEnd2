import {
  Foundation,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import React, { useState } from "react";
import { Text, View, TouchableOpacity, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EditTotalBudget from '../components/budgetStatus/editTotalBudget'
import SetNewBudget from "../components/budgetStatus/setNewBudget";
import ReusableModal from "../components/reusableModal";


const currentBudget = 25000;
const currentSpent = 8000;
const expenses = 4000;
const remaining = currentBudget - currentSpent;
const percentageSpent = Math.round((currentSpent / currentBudget) * 100);

// Category Data
const categories = [
  { name: "Insurance", spent: 5000, budget: 10000, color: "purple" },
  { name: "Bills", spent: 2000, budget: 6000, color: "green" },
  { name: "Other", spent: 1000, budget: 4000, color: "gray" },
  { name: "Game", spent: 300, budget: 2000, color: "blue" },
  { name: "Grocery", spent: 2000, budget: 3000, color: "orange" },
];

export default function BudgetStatus() {

  const [clickEditTotalBudget, setClickEditTotalBudget] = useState<boolean>(false)
  const [clickSetNewBudget, setClickSetNewBudget] = useState<boolean>(false)

  return (
    <SafeAreaView className="flex justify-start items-center w-full h-full bg-[#81D8D0] pt-5">
      {/* Edit button */}
      <View className="w-[90%] flex flex-row justify-end mb-2">
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-row items-center gap-2 px-4 py-2 bg-gray-200 border border-black/20 rounded-full shadow-sm"
          onPress={() => setClickEditTotalBudget(true)}
        >
          <MaterialCommunityIcons
            name="rename-box-outline"
            size={18}
            color="#676565"
          />
          <Text className="text-sm font-medium text-[#676565]">Edit Total Budget</Text>
        </TouchableOpacity>
      </View>

      {/* Budget board */}
      <View className="w-[90%] py-6 px-6 flex-col gap-y-4 items-center bg-[#FFFB82]/20 rounded-3xl">
        <View className="flex flex-row justify-between items-center w-full">
          <View className="flex flex-col">
            <Text>Total Budget</Text>
            <Text className="font-semibold">₱ {currentBudget}</Text>
          </View>
          <View className="flex flex-col">
            <Text>Total Spent</Text>
            <Text className="font-semibold">₱ {expenses}</Text>
          </View>
          <View className="flex flex-col">
            <Text>Remaining</Text>
            <Text className="font-semibold">₱ {remaining}</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View className="bg-gray-200 rounded-full h-3 w-full">
          <View
            className="bg-[#36978C] h-full rounded-full"
            style={{ width: `${percentageSpent}%` }}
          />
        </View>

        <Text className="text-sm">Total budget used: {percentageSpent}%</Text>
      </View>

      <View className="flex flex-col bg-[#FAF7F0] gap-y-6 p-6 rounded-3xl w-[90%] mt-5">
        <View className="flex flex-row gap-2 mb-2 items-center">
          <Foundation name="target" size={30} color="black" />
          <Text className="text-xl font-semibold">Budget Status</Text>
        </View>

        <View className="flex flex-col gap-y-5">
          {categories.map((cat, index) => {
            const percent = Math.round((cat.spent / cat.budget) * 100);
            return (
              <View key={index} className="flex w-full">
                {/* Row Title */}
                <View className="flex flex-row justify-between">
                  <View className="flex flex-row gap-x-2">
                    <Octicons name="dot-fill" size={22} color={cat.color} />
                    <Text className="text-base font-medium">{cat.name}</Text>
                  </View>
                  <View className="flex flex-row gap-x-1">
                    <Text className="text-sm font-medium">₱{cat.spent} /</Text>
                    <Text className="text-sm font-medium">₱{cat.budget}</Text>
                  </View>
                </View>

                {/* Percentage */}
                <View className="items-end">
                  <Text className="text-xs">{percent}%</Text>
                </View>

                {/* Progress bar (taller) */}
                <View className="bg-gray-200 rounded-full h-3.5 w-full">
                  <View
                    className="bg-[#36978C] h-full rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Budget buttons (bigger) */}
      <View className="flex-row justify-between w-[90%] gap-5 mt-5">
        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 flex-row items-center justify-center gap-3 py-4 px-5 border border-black/50 bg-[#FFFDC2] rounded-3xl"
          onPress={() => setClickSetNewBudget(true)}
        >
          <Foundation name="target" size={22} color="black" />
          <Text className="text-base font-medium">Set New Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.7}
          className="flex-1 flex-row items-center justify-center gap-3 py-4 px-5 border border-black/50 bg-[#36978C] rounded-3xl"
          onPress={() => console.log("Adjust Categories pressed")}
        >
          <MaterialCommunityIcons
            name="rename-box-outline"
            size={22}
            color="black"
          />
          <Text className="text-base font-medium">Adjust Categories</Text>
        </TouchableOpacity>
      </View>
    
    {/*Click Edit Total Budget Button Modal */}
    <ReusableModal
      visible={clickEditTotalBudget}
      onRequestClose={() => setClickEditTotalBudget(false)}
    >
      <EditTotalBudget closeModal={ () => setClickEditTotalBudget(false) }/>
    </ReusableModal>
    
    {/* Click Set New Budget Button Modal */}
    <ReusableModal
      visible={clickSetNewBudget}
      onRequestClose={() => setClickSetNewBudget(false)}
    >
      <SetNewBudget closeModal={ () => setClickSetNewBudget(false) }/>
    </ReusableModal>

    </SafeAreaView>
  );
}
