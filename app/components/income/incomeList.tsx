import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
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

export default function IncomeList() {
  const [userCredentialsID, setUserCredentialsID] =
    useState<Id<"userCredentials"> | null>(null);
  const [isDeleting, setIsDeleing] = useState<boolean>(false);

  const selectIncomeList = useQuery(
    api.functions.income.incomeList.incomeList,
    userCredentialsID ? { userCredentialsID } : "skip"
  );

  const deleteIncomeOnList = useMutation(
    api.functions.income.deleteIncome.deleteIncome
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

  const handleDeleteButton = (incomeId: Id<"income">) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this income?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsDeleing(true);
              await deleteIncomeOnList({ incomeID: incomeId });
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
      {selectIncomeList === undefined ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ paddingVertical: 8, gap: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {selectIncomeList.map((income) => (
            <View
              className="bg-white rounded-3xl h-20 p-4"
              key={income._id.toString()}
            >
              <View className="flex-row justify-between items-center h-full ">
                <View className="justify-center items-center">
                  <Image
                    source={require("../../../assets/images/add_income_icon.png")}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>

                <View className="px-3 justify-center items-center">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {income.incomeName}
                  </Text>
                  <Text className="text-sm text-gray-500 capitalize">
                    {income.incomeCategory}
                  </Text>
                </View>

                <View className="items-end justify-between">
                  <Text className="text-lg font-bold text-green-600 mb-1">
                    ₱{formatAmount(income.amount)}
                  </Text>
                  <View className="flex-row gap-2 rounded-full px-2 py-1 shadow-sm">
                    <Image
                      source={require("../../../assets/images/edit_button.png")}
                      style={{ width: 16, height: 16, marginRight: 8 }}
                      resizeMode="contain"
                    />

                    <TouchableOpacity
                      onPress={() => handleDeleteButton(income._id)}
                    >
                      <Image
                        source={require("../../../assets/images/delete_button.png")}
                        style={{ width: 16, height: 16 }}
                        resizeMode="contain"
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
