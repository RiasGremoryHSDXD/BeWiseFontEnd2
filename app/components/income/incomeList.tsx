import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../Loading";
import UpdateIncome from "./updateIncomes";
import { Feather, FontAwesome5 } from "@expo/vector-icons";

export default function IncomeList() {
  const [userCredentialsID, setUserCredentialsID] =
    useState<Id<"userCredentials"> | null>(null);
  const [incomeID, setIncomeID] = useState<Id<"income"> | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const selectIncomeList = useQuery(
    api.functions.income.incomeList.incomeList,
    userCredentialsID ? { userCredentialsID } : "skip"
  );

  const incomeInfoData = useQuery(
    api.functions.income.incomeInfo.incomeInfo,
    incomeID ? { incomeID } : "skip"
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
        { text: "Cancel" },
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await deleteIncomeOnList({ incomeID: incomeId });
            } catch (error) {
              Alert.alert("Error", "Failed to delete income");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpdateIncome = (income_id: Id<"income">) => {
    setIncomeID(income_id);
    setIsUpdating(true);
  };

  return (
    <View className="w-full">
      {isDeleting && <Loading />}

      {selectIncomeList === undefined ? (
        <Text>Loading...</Text>
      ) : (
        <ScrollView
          contentContainerStyle={{ gap: 8 }}
          showsVerticalScrollIndicator={false}
        >
          {selectIncomeList.map((income) => (
            <View
              className="bg-white rounded-3xl h-20 p-4"
              key={income._id.toString()}
            >
              <View className="flex-row justify-between items-center h-full">
                {/* Left Icon */}
                <View className="justify-center items-center">
                  <Image
                    source={require("../../../assets/images/add_income_icon.png")}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>

                {/* Middle Content */}
                <View className="px-3 justify-center items-center">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {income.incomeName}
                  </Text>
                  <Text className="text-sm text-gray-500 capitalize">
                    {income.incomeCategory}
                  </Text>
                </View>

                {/* Right Side */}
                <View className="items-end justify-between">
                  <Text className="text-lg font-bold text-green-600 mb-1">
                    ₱{formatAmount(income.amount)}
                  </Text>
                  <View className="flex-row gap-2 rounded-full px-2 py-1 shadow-sm">
                    {/* Update Button */}
                    <TouchableOpacity
                      onPress={() => handleUpdateIncome(income._id)}
                    >
                      <Feather name="edit" size={18} color="black" />
                    </TouchableOpacity>

                    {/* Delete Button */}
                    <TouchableOpacity
                      onPress={() => handleDeleteButton(income._id)}
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

      {/* Update Modal */}
      <Modal
        visible={isUpdating}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsUpdating(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl w-[94%] p-5 flex justify-center items-center">
            {!incomeInfoData ? (
              <View>
                <Loading />
                <Text>Loading...</Text>
              </View>
            ) : (
              <UpdateIncome
                incomeID={incomeInfoData?._id}
                incomeName={incomeInfoData?.incomeName}
                incomeCategory={incomeInfoData?.incomeCategory}
                incomeAmount={incomeInfoData?.amount}
                incomeExpectedPayOut={new Date(incomeInfoData?.expectedPayOut)}
                incomeFrequency={incomeInfoData?.frequency}
                onSuccessUpdate={() => {
                  setIsUpdating(false);
                  setIncomeID(null);
                }}
              />
            )}

            <TouchableOpacity
              className="bg-red-400 w-full items-center p-2 mt-2 rounded-lg"
              onPress={() => setIsUpdating(false)}
            >
              <Text className="font-semibold text-lg text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
