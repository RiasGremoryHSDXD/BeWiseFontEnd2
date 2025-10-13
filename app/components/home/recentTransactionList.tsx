import { View, Text, FlatList, Image } from "react-native";
import React from "react";

export default function RecentTransactionList() {
  const recentTransaction = [
    {
      id: 1,
      type: "income",
      incomeName: "Salary",
      incomeCategory: "Work",
      amount: 9000,
      expectedPayOut: "2025-09-01",
      frequency: "Monthly",
      imageSource: require("../../../assets/images/add_income_icon.png"),
    },
    {
      id: 2,
      type: "expense",
      expensesName: "Grocery",
      expensesCategory: "Grocery",
      amount: 5000,
      datePaid: "2025-08-29",
      frequency: "OneTime",
      imageSource: require("../../../assets/images/add_expenses_icon.png"),
    },
    {
      id: 3,
      type: "expense",
      expensesName: "Grocery",
      expensesCategory: "Grocery",
      amount: 5000,
      datePaid: "2025-08-29",
      frequency: "OneTime",
      imageSource: require("../../../assets/images/add_expenses_icon.png"),
    },
  ];

  const renderItem = ({ item }: any) => {
    const isIncome = item.type === "income";
    const name = isIncome ? item.incomeName : item.expensesName;
    const category = isIncome ? item.incomeCategory : item.expensesCategory;
    const date = isIncome ? item.expectedPayOut : item.datePaid;
    const amountColor = isIncome ? "text-green-500" : "text-red-500";
    const sign = isIncome ? "+" : "-";

    return (
      <View className="flex-row w-full items-center justify-between py-3.5 ">
        {/* Left Side */}
        <View className="flex-row items-center space-x-3">
          <View className={` rounded-full p-2.5`}>
            <Image
              source={item.imageSource}
              style={{ width: 30, height: 30 }}
            />
          </View>

          <View>
            <Text className="text-white text-base font-semibold">{name}</Text>
            <Text className="text-[#D9F8F7] text-sm">{category}</Text>
          </View>
        </View>

        {/* Right Side */}
        <View className="items-end">
          <Text className={`text-base font-semibold ${amountColor}`}>
            {sign} {item.amount.toLocaleString()}
          </Text>
          <Text className="text-[#D9F8F7] text-xs">{date}</Text>
        </View>
      </View>
    );
  };

  return (
    <View className=" overflow-hidden">
      <FlatList
        data={recentTransaction}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-white/25" />
        )}
      />
    </View>
  );
}
