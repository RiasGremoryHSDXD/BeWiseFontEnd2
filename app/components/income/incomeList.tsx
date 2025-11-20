import { Feather, FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Loading from "../Loading";
import UpdateIncome from "./updateIncomes";
import api from "../../../api/api";

// Interface matching the Parent's data
interface Income {
  _id: string;
  incomeName: string;
  incomeCategory: "Work" | "Investment" | "Savings" | "Side Hustle" | "Other";
  amount: number;
  expectedPayOut: string;
  frequency: string;
}

interface IncomeProps {
  data: Income[];             // <--- WE USE THIS NOW
  refreshTrigger: () => void; // <--- CALL THIS ON DELETE/UPDATE
}

export default function IncomeList({ data, refreshTrigger }: IncomeProps) {
  // DELETE: const [incomeList, setIncomeList] ... (Don't use local state)
  // DELETE: const fetchIncome ... (Parent does this now)
  // DELETE: useFocusEffect ... (Parent does this now)

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedIncome, setSelectedIncome] = useState<Income | null>(null);

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
              
              // SUCCESS! Tell Parent to refresh everything
              refreshTrigger(); 
              
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

  const handleUpdateIncome = (income: Income) => {
    setSelectedIncome(income);
    setIsUpdating(true);
  };

  return (
    <View className="w-full flex-1">
      {isDeleting && <Loading />}

      {/* CRITICAL: Use the 'data' prop, not local state */}
      <FlatList
        showsVerticalScrollIndicator={false}
        data={data} 
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

      {/* Update Modal */}
      <Modal
        visible={isUpdating}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsUpdating(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl w-[94%] p-5 flex justify-center items-center max-h-[80%]">
            {selectedIncome && (
              <UpdateIncome
                incomeID={selectedIncome._id}
                incomeName={selectedIncome.incomeName}
                incomeCategory={selectedIncome.incomeCategory}
                incomeAmount={selectedIncome.amount}
                incomeExpectedPayOut={new Date(selectedIncome.expectedPayOut)}
                incomeFrequency={selectedIncome.frequency}
                onSuccessUpdate={() => {
                  setIsUpdating(false);
                  setSelectedIncome(null);
                  // SUCCESS! Tell Parent to refresh everything
                  refreshTrigger(); 
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