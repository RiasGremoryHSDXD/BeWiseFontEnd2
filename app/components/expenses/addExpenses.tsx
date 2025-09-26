import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import LoadingScreen from "../Loading";
type ExpensesCategory = "Insurance" | "Bills" | "Game" | "Grocery" | "Other";

export default function addExpenses() {
  const [userCredentialsID, setUserCredentialsID] =
    useState<Id<"userCredentials"> | null>(null);
  const [expensesName, setExpensesName] = useState<string>("");
  const [expensesCategoryValue, setExpensesCategoryValue] =
    useState<ExpensesCategory>("Other");
  const [amount, setAmount] = useState<string>("");
  const [datePaid, setDatePaid] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const insertNewExpensesRow = useMutation(
    api.functions.expenses.insertNewExpenses.insertNewExpenses
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        const user = JSON.parse(storedUser);

        setUserCredentialsID(user.id || "");
      }
    };

    loadUserInfo();
  }, []);

  const handleNewExpensesRecord = async () => {
    if (loading || isProcessing) return;

    setIsProcessing(true);
    try {
      if (!userCredentialsID || !expensesName || !amount || !datePaid) {
        Alert.alert("Missing Data", "Please fill out all field");
        return;
      }

      setLoading(true);
      await insertNewExpensesRow({
        userCredentialsID,
        expensesName,
        expensesCategory: expensesCategoryValue,
        amount: parseFloat(amount),
        datePaid: datePaid.toISOString(),
      });

      setLoading(false);

      Alert.alert("Success", "Expenses record add successfully!");
    } catch (e) {
      Alert.alert("Error", "Failed to insert expenses record");
      console.error(e);
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex gap-y-5 w-full">
      {/*Expenses Category*/}
      <View>
        <Text className="text-lg">Category</Text>

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

      {/*Expenses Name */}
      <View className="gap-2">
        <Text>Expenses Name:</Text>
        <TextInput
          className="border p-3 rounded-md"
          placeholder="Expenses Name"
          value={expensesName}
          onChangeText={(text) => setExpensesName(text)}
        />
      </View>

      {/*Amount*/}
      <View className="gap-2">
        <Text>Amount:</Text>
        <TextInput
          className="border p-3 rounded-md"
          placeholder="Amount"
          value={amount}
          onChangeText={(text) => setAmount(text)}
        />
      </View>

      {/* Date Paid*/}
      <View className="flex gap-y-5">
        <View className="flex flex-row">
          <Text className="font-medium">Date Paid: </Text>

          {datePaid && <Text>{datePaid.toDateString()}</Text>}

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

        <TouchableOpacity
          className="flex items-center p-3 rounded-lg bg-blue-400"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="text-white font-semibold">PICK DATE</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        activeOpacity={1}
        className="p-2 bg-red-400 rounded-lg flex items-center"
        onPress={handleNewExpensesRecord}
        disabled={loading || isProcessing}
      >
        <Text className="text-2xl font-semibold text-white">Add</Text>
      </TouchableOpacity>

      {loading && <LoadingScreen />}
    </View>
  );
}
