import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../Loading";

export default function ExpensesList() {
  const [userCredentialsID, setUserCredentialsID] =
    useState<Id<"userCredentials"> | null>(null);
  const [isDeleting, setIsDeleing] = useState<boolean>(false);

  const selectExpensesList = useQuery(
    api.functions.expenses.expensesList.expensesList,
    userCredentialsID ? { userCredentialsID } : "skip"
  );

  const deleteExpensesOnList = useMutation(
    api.functions.expenses.deleteExpenses.deleteExpenses
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserCredentialsID(user.id || "");
        }
      } catch (error) {
        Alert.alert(
          "Error Local Storage [Income List]",
          "Error retrieving data in local storage"
        );
      }
    };

    loadUserInfo();
  }, []);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDeleteButton = (expensesID: Id<"expenses">) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this expenses?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsDeleing(true);
              await deleteExpensesOnList({ expensesID: expensesID });
            } catch (error) {
              Alert.alert("Error", "Failed to delete income");
            } finally {
              setIsDeleing(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View className="w-full flex-1">
      {isDeleting && <Loading />}
      {selectExpensesList === undefined ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingVertical: 8, gap: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {selectExpensesList.map((expenses) => (
            <View
              className=" bg-white rounded-3xl h-20 p-4 w-full"
              key={expenses._id.toString()}
            >
              <View className="flex-row items-center justify-between h-full">
                <View className="justify-center items-center">
                  <Image
                    source={require("../../../assets/images/add_expenses_icon.png")}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>

                <View className="px-3 justify-center items-center">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {expenses.expensesName}
                  </Text>
                  <Text className="text-sm text-gray-500 capitalize">
                    {expenses.expensesCategory}
                  </Text>
                </View>

                <View className="items-end justify-between">
                  <Text className="text-lg font-bold text-red-600 mb-1">
                    ₱{formatAmount(expenses.amount)}
                  </Text>
                  <View className="flex-row rounded-full px-2 gap-2 py-1 shadow-sm">
                    <Feather name="edit" size={18} color="black" />

                    <TouchableOpacity
                      onPress={() => handleDeleteButton(expenses._id)}
                    >
                      <FontAwesome5
                        name="trash-alt"
                        size={17}
                        color="#D90000"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
