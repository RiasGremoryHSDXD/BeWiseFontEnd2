import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { FontAwesome6, Foundation } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [toogleShowBalance, setToogleShowBalance] = useState<boolean>(true);
  const [userCredentialsID, setUserCredentialsID] =
    useState<Id<"userCredentials"> | null>(null);

  const income = 24000;
  const expenses = 4000;
  const currentSpent = 8000;
  const currentBudget = 25000;
  const percentageSpent = Math.round((currentSpent / currentBudget) * 100);

  // Convex Query for Current Balance
  const currentBalance = useQuery(
    api.functions.balance.currentBalance.currentBalance,
    userCredentialsID ? { userCredentialsID } : "skip"
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserCredentialsID(user.id || "");
        }
      } catch (e) {
        Alert.alert("Error", "Failed to retrieve user from local storage");
      }
    };

    loadUserInfo();
  }, []);

  return (
    <SafeAreaView className="flex h-full justify-center gap-5 items-center w-full bg-[#81D8D0]">
      <View className="w-[90%] mt-8" />

      {/* Current Balance */}
      <View className="flex w-[90%] py-8 flex-row justify-between items-center px-5 border border-white/50 bg-white/30 rounded-3xl">
        <View className="flex gap-y-2">
          <Text className="text-xl text-[#676565]">Current Balance</Text>

          <View className="flex flex-row gap-2 items-center">
            <FontAwesome6 name="peso-sign" size={30} color="black" />
            <Text className="text-3xl font-semibold">
              {toogleShowBalance
                ? (currentBalance?.currentBalance ?? "0")
                : "****"}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setToogleShowBalance(!toogleShowBalance)}
        >
          <Ionicons name={toogleShowBalance ? "eye" : "eye-off"} size={32} />
        </TouchableOpacity>
      </View>

      {/* Total Income & Expenses */}
      <View className="flex flex-row gap-5 w-[90%]">
        {/* Income */}
        <View className="flex-1 flex-row items-center bg-white gap-5 py-3 px-4 rounded-3xl">
          <Image
            source={require("../../assets/images/Income_icon.png")}
            style={{ width: 30, height: 30 }}
          />
          <View>
            <Text>Income</Text>
            <Text className="text-xl font-semibold text-green-500">
              ₱ {income}
            </Text>
          </View>
        </View>

        {/* Expenses */}
        <View className="flex-1 flex-row items-center bg-white gap-5 py-3 px-4 rounded-3xl">
          <Image
            source={require("../../assets/images/expenses_icon.png")}
            style={{ width: 30, height: 30 }}
          />
          <View>
            <Text>Expenses</Text>
            <Text className="text-xl font-semibold text-red-500">
              ₱ {expenses}
            </Text>
          </View>
        </View>
      </View>

      {/* Monthly Budget */}
      <View className="flex w-[90%] bg-[#FAF7F0] p-5 rounded-3xl gap-y-4">
        {/* Head */}
        <View className="flex flex-row gap-3 items-center">
          <Foundation name="target" size={30} color="black" />
          <Text className="text-xl font-semibold">Monthly Budget</Text>
        </View>

        {/* Sub-head */}
        <View className="flex flex-row justify-between">
          <Text className="text-base">Spent: ₱ {currentSpent}</Text>
          <Text className="text-base">Budget: ₱ {currentBudget}</Text>
        </View>

        {/* Progress Bar */}
        <View className="bg-gray-200 rounded-full h-3">
          <View
            className="bg-[#36978C] h-full rounded-full"
            style={{ width: `${percentageSpent}%` }}
          />
        </View>

        {/* Progress Text */}
        <View className="flex justify-center items-center">
          <Text>Total budget used: {percentageSpent}%</Text>
        </View>
      </View>

      {/* Recent Transactions */}
      <View className="flex-1 gap-y-5 w-[90%] p-5 bg-[#36978C] rounded-3xl">
        {/* Head */}
        <View className="flex flex-row justify-between">
          <Text className="text-lg font-semibold text-white">
            Recent Transactions
          </Text>
        </View>

        {/* Data */}
        <View className="flex-1 items-center justify-center">
          <Text className="text-2xl text-white/70">No Recent Transactions</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
