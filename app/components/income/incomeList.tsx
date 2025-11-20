import { Feather, FontAwesome5 } from "@expo/vector-icons";
import React, { useEffect, useState, useCallback } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import Loading from "../Loading";
import UpdateIncome from "./updateIncomes";
import api from "../../../api/api";
import useAsyncStorageData from "../../hooks/asyncStorageData";

// 1. DEFINE INTERFACE MANUALLY (No Convex Types)
interface Income {
  _id: string; // MongoDB uses _id, not id
  incomeName: string;
  incomeCategory: string;
  amount: number;
  expectedPayOut: string;
  frequency: string;
}

interface IncomeProps{
  refreshTrigger?: number;
}

export default function IncomeList({refreshTrigger} : IncomeProps) {
  // 2. UPDATE STATE TYPES (Use string, not Id<"x">)
  const [userCredentialsID, setUserCredentialsID] = useState<string | null>(null);
  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Update State
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  // Store the entire Income object, not just the ID, to pass to the modal
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

  const userDetails = useAsyncStorageData();

  useEffect(() => {
    if (userDetails && userDetails._id) {
      setUserCredentialsID(userDetails._id);
    }
  }, [userDetails]);

  // Function to fetch income from MongoDB
  const fetchIncome = async () => {
    try {
      const response = await api.get("/income/readIncome");
      if (response.status === 200) {
        setIncomeList(response.data.income);
      }
    } catch (error) {
      console.error("Failed to fetch income:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchIncome();
    }, [])
  );

  useEffect(() => {
    if(refreshTrigger !== undefined){
      fetchIncome();
    }
  }, [refreshTrigger])

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDeleteButton = (incomeId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this income?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await api.delete(`/income/deleteIncome/${incomeId}`);
              // Optimistic update
              setIncomeList((prev) => prev.filter((item) => item._id !== incomeId));
              Alert.alert("Success", "Income deleted successfully");
            } catch (error) {
              console.error(error);
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

  // 3. UPDATE HANDLER (Pass entire object)
  const handleUpdateIncome = (income: Income) => {
    setSelectedIncome(income); // Set the full object
    setIsUpdating(true);
  };

  return (
    <View className="w-full flex-1">
      {isDeleting && <Loading />}

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <Loading />
          <Text className="mt-2 text-gray-500">Loading income...</Text>
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={incomeList}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ gap: 8, paddingBottom: 20 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">
              No income records found.
            </Text>
          }
          renderItem={({ item: income }) => (
            <View className="bg-white rounded-3xl h-20 p-4 shadow-sm">
              <View className="flex-row justify-between items-center h-full">
                <View className="justify-center items-center">
                  <Image
                    source={require("../../../assets/images/add_income_icon.png")}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>

                <View className="px-3 justify-center items-start flex-1">
                  <Text className="text-lg font-semibold text-gray-800 mb-1" numberOfLines={1}>
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
                  <View className="flex-row gap-3">
                    <TouchableOpacity onPress={() => handleUpdateIncome(income)}>
                      <Feather name="edit" size={18} color="black" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDeleteButton(income._id)}>
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
          )}
        />
      )}

      {/* Update Modal */}
      <Modal
        visible={isUpdating}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsUpdating(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl w-[94%] p-5 flex justify-center items-center max-h-[80%]">
            {/* 4. PASS DATA TO UPDATE COMPONENT */}
            {selectedIncome && (
              <UpdateIncome
                // Pass raw string ID
                incomeID={selectedIncome._id}
                incomeName={selectedIncome.incomeName}
                incomeCategory={selectedIncome.incomeCategory}
                incomeAmount={selectedIncome.amount}
                incomeExpectedPayOut={new Date(selectedIncome.expectedPayOut)}
                incomeFrequency={selectedIncome.frequency}
                onSuccessUpdate={() => {
                  setIsUpdating(false);
                  setSelectedIncome(null);
                  fetchIncome(); // Refresh list
                }}
                onClose={() => setIsUpdating(false)}
              />
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}