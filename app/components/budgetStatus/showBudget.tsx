import { View, Text, TouchableOpacity, Modal } from "react-native";
import { useState } from "react";
import {
  Foundation,
  MaterialCommunityIcons,
  Octicons,
} from "@expo/vector-icons";
import { CategoryType } from "../../types/categoryType";
import EditShowBudget from "../budgetStatus/editBudget";

interface ShowBudgetProps {
  visible: boolean;
  onRequestClose: () => void;
  category: CategoryType | null;
}

export default function showBudget({
  visible,
  onRequestClose,
  category,
}: ShowBudgetProps) {
  if (!category) return null;

  const categories = [
    { name: "Car Insurance", spent: 5000, budget: 10000, color: "purple" },
    { name: "Life Insurance", spent: 2000, budget: 6000, color: "green" },
    { name: "Health Insurance", spent: 1000, budget: 4000, color: "gray" },
    { name: "Home Insurance", spent: 300, budget: 2000, color: "blue" },
  ];

  const [selectEditShowBudget, setSelectedEditShowBudget] =
    useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
    null
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      {/* Para Background Black */}
      <View className="flex-1 bg-black/50 justify-center items-center p-5 w-full">
        {/* Modal Box */}
        <View className="w-full p-6 bg-[#FAF7F0] rounded-2xl">
          <View className="flex flex-row gap-2 mb-2 items-center">
            <Foundation name="target" size={25} color="black" />
            <Text className="text-lg font-semibold">
              {category?.name} Budget
            </Text>
          </View>

          {categories.map((cat, index) => {
            const percent = Math.round((cat.spent / cat.budget) * 100);

            return (
              <TouchableOpacity
                key={index}
                className="flex w-full mt-3"
                onPress={() => {
                  setSelectedCategory(cat);
                  setSelectedEditShowBudget(true);
                }}
              >
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

                {/* Progress bar */}
                <View className="bg-gray-200 rounded-full h-3.5 w-full mb-3">
                  <View
                    className="bg-[#36978C] h-full rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}

          {/* Navigation Buttons*/}
          <View className="flex-row mt-5 justify-center items-center w-full gap-x-5">
            <TouchableOpacity
              onPress={onRequestClose}
              className="flex p-3 w-[50%] bg-[#898E8C] rounded-xl items-center justify-center border "
            >
              <Text className="font-semibold text-xl text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <EditShowBudget
        visible={selectEditShowBudget}
        onRequestClose={() => setSelectedEditShowBudget(false)}
        category={selectedCategory}
      ></EditShowBudget>
    </Modal>
  );
}
