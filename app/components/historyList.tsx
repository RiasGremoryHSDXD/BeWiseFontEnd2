// components/HistoryList.tsx
import React from "react";
import { FlatList, Image, Text, View } from "react-native";

interface HistoryItem {
  _id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
}

interface HistoryListProps {
  data: HistoryItem[];
  color: "red" | "green"; // red for expenses, green for income
  icon: any; // image source (require)
}

export default function HistoryList({  data, color, icon }: HistoryListProps) {
  const formatAmount = (amount: number) =>
    new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <View className="w-full">

      {data?.length === 0 ? (
        <Text>No records found.</Text>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={data}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={{ gap: 8 }}
          renderItem={({ item }) => (
            <View className="bg-white rounded-3xl h-20 p-4 w-full">
              <View className="flex-row items-center justify-between h-full">
                {/* Left Icon */}
                <View className="justify-center items-center">
                  <Image
                    source={icon}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>

                {/* Middle */}
                <View className="px-3 justify-center items-center">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {item.name}
                  </Text>
                  <Text className="text-sm text-gray-500 capitalize">
                    {item.category}
                  </Text>
                </View>

                {/* Right */}
                <View className="items-end justify-between">
                  <Text
                    className={`text-lg font-bold mb-1 ${
                      color === "red" ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    ₱{formatAmount(item.amount)}
                  </Text>
                  <View className="flex-row rounded-full px-2 gap-4 py-1 shadow-sm">
                    <Text>{item.date}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}
        />
      )}
    </View>
  );
}

/**
 * List of file that this code is being reuse
 * 
 * > expensesHistory.tsx
 * > incomeHistory.tsx
 * 
 */