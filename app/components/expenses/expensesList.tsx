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
import UpdateExpenses from "./updateExpenses";
import api from "../../../api/api";

// Interface matching the Parent's data
interface Expense {
  _id: string;
  expensesName: string;
  expensesCategory: "Insurance" | "Bills" | "Hobby" | "Daily Need" | "Other";
  amount: number;
  frequency: string;
  datePaid: string;
}

interface ExpensesListProps {
  data: Expense[];
  refreshTrigger: () => void;
}

export default function ExpensesList({
  data,
  refreshTrigger,
}: ExpensesListProps) {
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const handleDeleteButton = (expenseId: string) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            try {
              setIsDeleting(true);
              await api.delete(`/expenses/deleteExpense/${expenseId}`);
              refreshTrigger();

              Alert.alert("Success", "Expense deleted successfully");
            } catch (error) {
              console.error(error);
              Alert.alert("Error", "Failed to delete expense");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleUpdateExpense = (expense: Expense) => {
    setSelectedExpense(expense);
    setIsUpdating(true);
  };

  return (
    <View className="w-full">
      {isDeleting && <Loading />}

      <FlatList
        showsVerticalScrollIndicator={false}
        data={data}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ gap: 8, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-center text-gray-500 mt-10">
            No expense records found.
          </Text>
        }
        renderItem={({ item: expense }) => (
          <View className="bg-white rounded-3xl h-20 p-4">
            <View className="flex-row justify-between items-center h-full">
              <View className="flex flex-row justify-center items-center gap-x-3">
                <Image
                  source={require("../../../assets/images/add_expenses_icon.png")}
                  style={{ width: 32, height: 32 }}
                  resizeMode="contain"
                />
                <View>
                  <Text
                    className="text-lg font-semibold text-gray-800 mb-1"
                    numberOfLines={1}
                  >
                    {expense.expensesName}
                  </Text>
                  <Text className="text-sm text-gray-500 capitalize">
                    {expense.expensesCategory}
                  </Text>
                </View>
              </View>

              <View
                className={`${expense.frequency === "Monthly" ? "bg-yellow-100" : "bg-gray-200"} py-1 px-3 rounded-full `}
              >
                <Text className="text-sm font-medium">{expense.frequency}</Text>
              </View>

              <View className="items-end justify-center ">
                <Text className="text-lg font-bold text-red-600 mb-1">
                  ₱{formatAmount(expense.amount)}
                </Text>
                <View className="flex-row gap-3">
                  <TouchableOpacity
                    onPress={() => handleUpdateExpense(expense)}
                  >
                    <Feather name="edit" size={18} color="black" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleDeleteButton(expense._id)}
                  >
                    <FontAwesome5 name="trash-alt" size={17} color="#D90000" />
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
          <View className="bg-white rounded-xl w-[94%] p-5 flex justify-center items-center">
            {selectedExpense && (
              <UpdateExpenses
                expensesID={selectedExpense._id}
                expensesName={selectedExpense.expensesName}
                expensesCategory={selectedExpense.expensesCategory}
                expensesAmount={selectedExpense.amount}
                expensesDatePaid={new Date(selectedExpense.datePaid)}
                expensesFrequency={selectedExpense.frequency}
                onSuccessUpdate={() => {
                  setIsUpdating(false);
                  setSelectedExpense(null);
                  refreshTrigger(); // Refresh Parent
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
