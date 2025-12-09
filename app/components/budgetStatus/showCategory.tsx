import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import ShowBudget from "./showBudget";
import { Foundation } from "@expo/vector-icons";

interface Category {
  label: string;
  amount: number | string;
  color?: string;
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
  allItems: Item[];
  totalBudget?: number;
}

const CATEGORY_COLORS = [
  "#36978C", // Teal
  "#FF6B6B", // Red
  "#4ECDC3", // Turquoise
  "#FFD93D", // Yellow
  "#957DAD", // Purple
];

export default function ShowCategory({
  title,
  categories,
  allItems,
  totalBudget,
}: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleCategoryPress = (categoryLabel: string) => {
    setSelectedCategory(categoryLabel);
    setModalVisible(true);
  };

  // Get color for category
  const getCategoryColor = (index: number, category: Category) => {
    return category.color || CATEGORY_COLORS[index % CATEGORY_COLORS.length];
  };

  // Calculate total amount for a category from allItems
  const calculateCategoryTotal = (categoryLabel: string): number => {
    const categoryItems = allItems.filter((item) => {
      const category = item.expensesCategory || item.incomeCategory;
      return category === categoryLabel;
    });

    return categoryItems.reduce((total, item) => {
      const amount =
        typeof item.amount === "number"
          ? item.amount
          : parseFloat(item.amount) || 0;
      return total + amount;
    }, 0);
  };

  // Filter items for the selected category
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

  // Calculate payment completion for a category
  const calculatePaymentProgress = (categoryLabel: string) => {
    // Get all items in this category
    const categoryItems = allItems.filter((item) => {
      const category = item.expensesCategory || item.incomeCategory;
      return category === categoryLabel;
    });

    if (categoryItems.length === 0) return 0;

    // Count how many items are paid (have a date in the past or today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const paidItems = categoryItems.filter((item) => {
      const itemDate = new Date(item.datePaid || item.expectedPayOut || "");
      itemDate.setHours(0, 0, 0, 0);
      return itemDate <= today;
    });

    // Calculate percentage
    const percentage = Math.round(
      (paidItems.length / categoryItems.length) * 100
    );
    return percentage;
  };

  // Format amount for display
  const formatAmount = (amount: number | string): string => {
    const numAmount =
      typeof amount === "number" ? amount : parseFloat(amount) || 0;
    return numAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  return (
    <>
      <View className="flex flex-col bg-[#FAF7F0] p-6 rounded-3xl mt-2">
        {/* Title */}
        <View className="flex flex-row gap-2 mb-3 items-center">
          <Foundation name="target" size={30} color="black" />
          <Text className="text-xl font-semibold">{title}</Text>
        </View>

        {/* Dynamic Categories */}
        <View className="flex flex-col gap-y-5">
          {categories.map((item, index) => {
            const paymentProgress = calculatePaymentProgress(item.label);
            const dotColor = getCategoryColor(index, item);

            // Calculate actual total from allItems
            const actualTotal = calculateCategoryTotal(item.label);

            // Use the calculated total, or fall back to the amount in categories if it exists
            const displayAmount = actualTotal > 0 ? actualTotal : item.amount;

            // Count items in this category
            const categoryItemsCount = allItems.filter((expense) => {
              const category =
                expense.expensesCategory || expense.incomeCategory;
              return category === item.label;
            }).length;

            return (
              <TouchableOpacity
                onPress={() => handleCategoryPress(item.label)}
                key={index}
                className="w-full flex p-3 justify-center items-center rounded-lg border-b-black/20"
                activeOpacity={0.7}
              >
                <View className="flex flex-row justify-between items-center w-full">
                  {/* Category Name with Colored Dot */}
                  <View className="flex flex-row items-center gap-2">
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: dotColor,
                      }}
                    />
                    <Text className="text-lg font-medium">{item.label}</Text>
                  </View>

                  <Text className="text-lg ">
                    ₱ {formatAmount(displayAmount)}
                  </Text>
                </View>
                <View className="items-end w-full">
                  <Text className="text-sm">{paymentProgress}% paid</Text>
                </View>

                {/* Progress Bar */}
                <View className="flex bg-gray-200 rounded-full h-3 w-full mt-1">
                  <View
                    className="bg-[#36978C] h-full rounded-full "
                    style={{ width: `${Math.min(paymentProgress, 100)}%` }}
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Category Items Modal */}
      <ShowBudget
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        categoryName={selectedCategory}
        items={getFilteredItems()}
      />
    </>
  );
}
