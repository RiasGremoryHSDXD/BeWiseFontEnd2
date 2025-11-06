import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useMutation, useQuery } from "convex/react";
import React, { useEffect, useState, useCallback, memo } from "react";
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

// --- Utility function moved outside the component to avoid re-creation ---
const formatAmount = (amount: number) =>
  new Intl.NumberFormat("en-PH", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

interface ExpenseItemProps {
  expense: {
    _id: Id<"expenses">;
    expensesName: string;
    expensesCategory: string;
    amount: number;
  };
  onDelete: (id: Id<"expenses">) => void;
  onUpdate: (id: Id<"expenses">) => void;
}

// --- Memoized Expense Item for performance ---
const ExpenseItem = memo(({ expense, onDelete, onUpdate }: ExpenseItemProps) => {
  return (
    <View className="bg-white rounded-3xl h-20 p-4 w-full">
      <View className="flex-row items-center justify-between h-full">
        {/* Left Icon */}
        <Image
          source={require("../../../assets/images/add_expenses_icon.png")}
          style={{ width: 32, height: 32 }}
          resizeMode="contain"
        />

        {/* Middle Content */}
        <View className="px-3 items-center">
          <Text className="text-lg font-semibold text-gray-800 mb-1">
            {expense.expensesName}
          </Text>
          <Text className="text-sm text-gray-500 capitalize">
            {expense.expensesCategory}
          </Text>
        </View>

        {/* Right Side */}
        <View className="items-end justify-between">
          <Text className="text-lg font-bold text-red-600 mb-1">
            ₱{formatAmount(expense.amount)}
          </Text>
          <View className="flex-row gap-4 py-1">
            <TouchableOpacity onPress={() => onUpdate(expense._id)}>
              <Feather name="edit" size={18} color="black" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onDelete(expense._id)}>
              <FontAwesome5 name="trash-alt" size={17} color="#D90000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
});

export default function ExpensesList() {
  const [userCredentialsID, setUserCredentialsID] =
    useState<Id<"userCredentials"> | null>(null);
  const [expensesID, setExpensesID] = useState<Id<"expenses"> | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const selectExpensesList = useQuery(
    api.functions.expenses.expensesList.expensesList,
    userCredentialsID ? { userCredentialsID } : "skip"
  );

  const expenseInfoData = useQuery(
    api.functions.expenses.expensesInfo.expenseInfo,
    expensesID ? { expensesID } : "skip"
  );

  const deleteExpensesOnList = useMutation(
    api.functions.expenses.deleteExpenses.deleteExpenses
  );

  // Load user once
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserCredentialsID(user.id || "");
        }
      } catch {
        Alert.alert("Error", "Failed to retrieve user info.");
      }
    };
    loadUserInfo();
  }, []);

  // Delete handler
  const handleDeleteButton = useCallback(
    (expensesID: Id<"expenses">) => {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this expense?",
        [
          { text: "Cancel" },
          {
            text: "Yes",
            onPress: async () => {
              try {
                setIsDeleting(true);
                await deleteExpensesOnList({ expensesID });
              } catch {
                Alert.alert("Error", "Failed to delete expense.");
              } finally {
                setIsDeleting(false);
              }
            },
          },
        ]
      );
    },
    [deleteExpensesOnList]
  );

  // Update handler
  const handleUpdateButton = useCallback((expensesID: Id<"expenses">) => {
    setExpensesID(expensesID);
    setIsUpdating(true);
  }, []);

  // Memoized renderItem
  const renderItem = useCallback(
    ({ item }: { item: any }) => (
      <ExpenseItem
        expense={item}
        onDelete={handleDeleteButton}
        onUpdate={handleUpdateButton}
      />
    ),
    [handleDeleteButton, handleUpdateButton]
  );

  if (selectExpensesList === undefined) {
    return <Loading />;
  }

  const ITEM_HEIGHT = 80; // Approximate item height for getItemLayout

  return (
    <View className="w-full flex-1">
      {isDeleting && <Loading />}

      <FlatList
        showsVerticalScrollIndicator={false}
        data={selectExpensesList}
        keyExtractor={(item) => item._id.toString()}
        contentContainerStyle={{ gap: 8, paddingBottom: 16 }}
        renderItem={renderItem}
        removeClippedSubviews
        initialNumToRender={10}
        maxToRenderPerBatch={5} // reduced batch size
        windowSize={3} // smaller window
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />

      {/* Update Modal */}
      <Modal
        visible={isUpdating}
        transparent
        animationType="fade"
        onRequestClose={() => setIsUpdating(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-xl w-[94%] p-5 items-center">
            {!expenseInfoData ? (
              <View>
                <Loading />
                <Text>Loading...</Text>
              </View>
            ) : (
              <MemoizedUpdateExpenses
                expensesID={expenseInfoData._id}
                expensesName={expenseInfoData.expensesName}
                expensesCategory={expenseInfoData.expensesCategory}
                expensesAmount={expenseInfoData.amount}
                expensesDatePaid={expenseInfoData.datePaid}
                expensesFrequency={expenseInfoData.frequency}
                onSuccessUpdate={() => {
                  setIsUpdating(false);
                  setExpensesID(null);
                }}
              />
            )}

            <TouchableOpacity
              className="bg-red-400 w-full items-center p-2 mt-2 rounded-lg"
              onPress={() => setIsUpdating(false)}
            >
              <Text className="font-semibold text-lg text-white">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// Memoized UpdateExpenses for performance
const MemoizedUpdateExpenses = memo(UpdateExpenses);
