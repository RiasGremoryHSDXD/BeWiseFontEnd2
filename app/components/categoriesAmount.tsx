import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import CategoryItemsModal from "./categoryItemsModal";

interface Category {
  label: string;
  amount: number | string;
}

interface Item {
  _id: string;
  expensesName?: string;
  incomeName?: string;
  expensesCategory?: string;
  incomeCategory?: string;
  amount: number;
  frequency: string;
  datePaid?: string;
  expectedPayOut?: string;
}

interface Props {
  title: string;
  categories: Category[];
  color: string;
  allItems: Item[];
}

export default function CategoriesAmount({
  title,
  categories,
  color,
  allItems,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleCategoryPress = (categoryLabel: string) => {
    setSelectedCategory(categoryLabel);
    setModalVisible(true);
  };

  // Filter and transform items for the selected category
  const getFilteredItems = () => {
    return allItems
      .filter((item) => {
        const category = item.expensesCategory || item.incomeCategory;
        return category === selectedCategory;
      })
      .map((item) => ({
        _id: item._id,
        name: item.expensesName || item.incomeName || "",
        category: item.expensesCategory || item.incomeCategory || "",
        amount: item.amount,
        frequency: item.frequency,
        date: item.datePaid || item.expectedPayOut || "",
      }));
  };

  return (
    <>
      <View className="flex flex-row flex-wrap justify-between bg-[#FAF7F0] py-6 px-4 rounded-2xl">
        {/* Title */}
        <View className="w-full mb-3">
          <Text className="text-xl font-semibold">{title}</Text>
        </View>

        {/* Dynamic Categories */}
        {categories.map((item, index) => (
          <TouchableOpacity
            onPress={() => handleCategoryPress(item.label)}
            key={index}
            className="w-[46%] border p-3 border-black/10 justify-center items-center bg-[#F2ECEC] rounded-lg mb-3"
            activeOpacity={0.7}
          >
            <Text className="text-lg font-medium">{item.label}</Text>
            <Text
              className={`font-medium ${
                color === "red" ? "text-red-600" : "text-green-600"
              }`}
            >
              ₱ {item.amount}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category Items Modal */}
      <CategoryItemsModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        categoryName={selectedCategory}
        items={getFilteredItems()}
        color={color as "red" | "green"}
      />
    </>
  );
}
