import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "../../../api/api";
import Loading from "../Loading";

type UpdateExpensesProps = {
  expensesID: string;
  expensesName: string;
  expensesCategory: string;
  expensesAmount: number;
  expensesDatePaid: Date;
  expensesFrequency: string;
  onSuccessUpdate: () => void;
  onClose: () => void;
};

type ExpensesCategory =
  | "Insurance"
  | "Bills"
  | "Hobby"
  | "Daily Need"
  | "Other";
type Frequency = "OneTime" | "Monthly";

export default function UpdateExpenses({
  expensesID,
  expensesName,
  expensesCategory,
  expensesAmount,
  expensesDatePaid,
  expensesFrequency,
  onSuccessUpdate,
  onClose,
}: UpdateExpensesProps) {
  const [newExpensesName, setNewExpensesName] = useState<string>(expensesName);
  const [newExpensesCategoryValue, setNewExpensesCategoryValue] =
    useState<ExpensesCategory>(expensesCategory as ExpensesCategory);
  const [newAmount, setNewAmount] = useState<number>(expensesAmount);
  const [newDatePaid, setNewDatePaid] = useState<Date>(expensesDatePaid);
  const [newFrequency, setNewFrequency] = useState<Frequency>(
    expensesFrequency as Frequency
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync state if props change
  useEffect(() => {
    setNewExpensesName(expensesName);
    setNewExpensesCategoryValue(expensesCategory as ExpensesCategory);
    setNewAmount(expensesAmount);
    setNewDatePaid(expensesDatePaid);
    setNewFrequency(expensesFrequency as Frequency);
  }, [
    expensesName,
    expensesCategory,
    expensesAmount,
    expensesDatePaid,
    expensesFrequency,
  ]);

  const handleUpdateButton = async () => {
    if (loading || isProcessing) return;
    setIsProcessing(true);
    setLoading(true);

    try {
      if (
        !expensesID ||
        !newExpensesName ||
        !newExpensesCategoryValue ||
        !newAmount ||
        !newDatePaid ||
        !newFrequency
      ) {
        Alert.alert("Missing Data", "Please fill out all fields");
        return;
      }

      const response = await api.put(`/expenses/updateExpense/${expensesID}`, {
        expensesName: newExpensesName,
        expensesCategory: newExpensesCategoryValue,
        amount: newAmount,
        datePaid: newDatePaid.toISOString(),
        frequency: newFrequency,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Expenses updated successfully.");
        onSuccessUpdate();
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert(
        "Update failed",
        error.response?.data?.message || "Could not update expenses."
      );
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <View className="w-full gap-y-3">
      {loading && <Loading />}

      <Text className="font-semibold">Expense Name</Text>
      <TextInput
        className="border rounded-lg p-3"
        value={newExpensesName}
        onChangeText={(text) => setNewExpensesName(text)}
      />

      <Text className="font-semibold">Category</Text>
      <View className="border border-black rounded-lg overflow-hidden">
        <Picker
          selectedValue={newExpensesCategoryValue}
          onValueChange={(itemValue) => setNewExpensesCategoryValue(itemValue)}
        >
          <Picker.Item label="Insurance" value="Insurance" />
          <Picker.Item label="Bills" value="Bills" />
          <Picker.Item label="Hobby" value="Hobby" />
          <Picker.Item label="Daily Need" value="Daily Need" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <Text className="font-semibold">Amount</Text>
      <TextInput
        className="border rounded-lg p-3"
        value={newAmount === 0 ? "" : newAmount.toString()}
        onChangeText={(text) => {
          if (text === "") {
            setNewAmount(0);
          } else {
            const num = parseFloat(text);
            setNewAmount(isNaN(num) ? 0 : num);
          }
        }}
        keyboardType="numeric"
      />

      <Text className="font-semibold">Frequency</Text>
      <View className="border border-black rounded-lg overflow-hidden">
        <Picker
          selectedValue={newFrequency}
          onValueChange={(itemValue) => setNewFrequency(itemValue)}
        >
          <Picker.Item label="OneTime" value="OneTime" />
          <Picker.Item label="Monthly" value="Monthly" />
        </Picker>
      </View>

      <View className="flex flex-row justify-between items-center">
        <Text className="font-semibold">Date Paid : </Text>

        <TouchableOpacity
          className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
          onPress={() => setShowDatePicker(true)}
          activeOpacity={0.7}
        >
          <Text className="font-semibold">
            {newDatePaid ? newDatePaid.toDateString() : "Select date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={newDatePaid || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setNewDatePaid(selectedDate);
            }}
          />
        )}
      </View>

      <View className="flex-row justify-between mt-4 gap-2">
        <TouchableOpacity
          onPress={handleUpdateButton}
          className="bg-blue-400 items-center p-3 rounded-lg flex-1"
          disabled={loading || isProcessing}
        >
          <Text className="font-semibold text-lg text-white">Update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onClose}
          className="bg-gray-400 items-center p-3 rounded-lg flex-1"
        >
          <Text className="font-semibold text-lg text-white">Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
