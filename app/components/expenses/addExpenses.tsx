import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import LoadingScreen from "../Loading";
import api from "../../../api/api";

type ExpensesCategory = "Insurance" | "Bills" | "Game" | "Grocery" | "Other";
type Frequency = "OneTime" | "Monthly";

type Props = {
  closeModal: () => void;
  onSuccess: () => void;
};

export default function AddExpenses({ closeModal, onSuccess }: Props) {
  const [expensesName, setExpensesName] = useState<string>("");
  const [expensesCategoryValue, setExpensesCategoryValue] = useState<ExpensesCategory>("Other");
  const [amount, setAmount] = useState<number>(0);
  const [datePaid, setDatePaid] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<Frequency>("OneTime");
  const [loading, setLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleNewExpensesRecord = async () => {
    if (loading || isProcessing) return;
    setIsProcessing(true);

    try {
      if (!expensesName || !amount || !datePaid) {
        Alert.alert("Missing Data", "Please fill out all fields");
        return;
      }

      setLoading(true);

      const response = await api.post("/expenses/addExpense", {
        expensesName,
        expensesCategory: expensesCategoryValue,
        amount,
        datePaid: datePaid.toISOString(), // Standardize date format
        frequency,
      });

      if (response.status === 200) {
        setLoading(false);
        Alert.alert("Success", "Expenses record added successfully!");
        onSuccess(); // Trigger parent refresh
      }
    } catch (error: any) {
      console.error(error);
      Alert.alert("Error", error.response?.data?.message || "Failed to add expense");
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex gap-y-3 w-full">
      {/* Expenses Name */}
      <View className="flex flex-col gap-y-3">
        <Text className="font-semibold">Expenses Details:</Text>
        <TextInput
          className="border rounded-md py-5 px-3"
          placeholder="Expenses Name"
          value={expensesName}
          onChangeText={(text) => setExpensesName(text)}
        />

        {/* Amount */}
        <TextInput
          className="border rounded-md py-5 px-3"
          placeholder="Amount"
          value={amount === 0 ? "" : amount.toString()}
          onChangeText={(text) => {
            if (text === "") {
              setAmount(0);
            } else {
              const num = parseFloat(text);
              setAmount(isNaN(num) ? 0 : num);
            }
          }}
          keyboardType="numeric"
        />
      </View>

      {/* Category */}
      <Text className="font-bold mt-2">Category</Text>
      <View className="border border-black rounded-lg overflow-hidden">
        <Picker
          selectedValue={expensesCategoryValue}
          onValueChange={(itemValue) => setExpensesCategoryValue(itemValue)}
        >
          <Picker.Item label="Insurance" value="Insurance" />
          <Picker.Item label="Bills" value="Bills" />
          <Picker.Item label="Game" value="Game" />
          <Picker.Item label="Grocery" value="Grocery" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      {/* Frequency */}
      <Text className="font-semibold mt-2">Frequency</Text>
      <View className="border border-black rounded-lg overflow-hidden">
        <Picker
          selectedValue={frequency}
          onValueChange={(itemValue) => setFrequency(itemValue)}
        >
          <Picker.Item label="OneTime" value="OneTime" />
          <Picker.Item label="Monthly" value="Monthly" />
        </Picker>
      </View>

      {/* Date Paid */}
      <View className="flex flex-row justify-between">
        {frequency === "OneTime" ? (
          <Text>Expected Paid Date : </Text>
        ) : (
          <Text>Started Paid Date : </Text>
        )}

        <TouchableOpacity
          className="border border-gray-300 rounded-md bg-gray-50 px-3"
          onPress={() => setShowDatePicker(true)}
        >
          <Text>{datePaid.toDateString()}</Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={datePaid || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDatePaid(selectedDate);
            }}
          />
        )}
      </View>
      
      <View className="flex flex-row justify-between mt-5 w-full">
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 p-3 bg-red-400 rounded-lg items-center mr-2"
          onPress={handleNewExpensesRecord}
          disabled={loading || isProcessing}
        >
          <Text className="text-xl font-semibold text-white">Add</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 p-3 bg-gray-400 rounded-lg items-center ml-2"
          onPress={closeModal}
        >
          <Text className="text-xl font-semibold text-white">Close</Text>
        </TouchableOpacity>
      </View>

      {loading && <LoadingScreen />}
    </View>
  );
}