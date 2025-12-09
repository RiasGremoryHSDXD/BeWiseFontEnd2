import React from "react";
import {
  Modal,
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";

// Generic interface that works for both Expenses and Income
interface CategoryItem {
  _id: string;
  name: string;
  category: string;
  amount: number;
  frequency: string;
  date: string;
}

interface Props {
  visible: boolean;
  onClose: () => void;
  categoryName: string;
  items: CategoryItem[];
  color: "red" | "green";
}

export default function CategoryItemsModal({
  visible,
  onClose,
  categoryName,
  items,
  color,
}: Props) {
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const totalAmount = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="bg-white rounded-t-3xl h-[85%] p-5">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-4 pb-3 border-b border-gray-200">
            <View>
              <Text className="text-2xl font-bold text-gray-800">
                {categoryName}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {items.length} {items.length === 1 ? "item" : "items"}
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              className="bg-gray-200 rounded-full p-2"
              activeOpacity={0.7}
            >
              <AntDesign name="close" size={24} color="black" />
            </TouchableOpacity>
          </View>

          {/* Total Amount Card */}
          <View
            className={`${
              color === "red"
                ? "bg-red-50 border-red-200"
                : "bg-green-50 border-green-200"
            } border rounded-2xl p-4 mb-4`}
          >
            <Text className="text-gray-600 mb-1">Total Amount</Text>
            <Text
              className={`text-3xl font-bold ${
                color === "red" ? "text-red-600" : "text-green-600"
              }`}
            >
              ₱ {formatAmount(totalAmount)}
            </Text>
          </View>

          {/* Items List */}
          <FlatList
            data={items}
            keyExtractor={(item) => item._id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <View className="flex-1 justify-center items-center py-10">
                <Text className="text-gray-400 text-lg">
                  No items in this category
                </Text>
              </View>
            }
            renderItem={({ item }) => {
              return (
                <View className="bg-gray-50 rounded-2xl p-4 mb-3 border border-gray-200">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1 mr-3">
                      <Text
                        className="text-lg font-semibold text-gray-800 mb-2"
                        numberOfLines={1}
                      >
                        {item.name}
                      </Text>

                      <View className="flex-row items-center gap-2">
                        {/* Frequency Badge */}
                        <View
                          className={`${
                            item.frequency === "Monthly"
                              ? "bg-yellow-200"
                              : "bg-gray-300"
                          } py-1 px-3 rounded-full`}
                        >
                          <Text className="text-sm font-medium">
                            {item.frequency}
                          </Text>
                        </View>

                        {/* Date */}
                        <Text className="text-sm text-gray-500">
                          {formatDate(item.date)}
                        </Text>
                      </View>
                    </View>

                    {/* Amount */}
                    <Text
                      className={`text-xl font-bold ${
                        color === "red" ? "text-red-600" : "text-green-600"
                      }`}
                    >
                      ₱{formatAmount(item.amount)}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
