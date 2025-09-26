import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useMutation } from "convex/react";
import { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
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
    try {
      if (!userCredentialsID || !expensesName || !amount || !datePaid) {
        Alert.alert("Missing Data", "Please fill out all field");
        return;
      }

      await insertNewExpensesRow({
        userCredentialsID,
        expensesName,
        expensesCategory: expensesCategoryValue,
        amount: parseFloat(amount),
        datePaid: datePaid.toISOString(),
      });

      Alert.alert("Success", "Expenses record add successfully!");
    } catch (e) {
      Alert.alert("Error", "Failed to insert expenses record");
      console.error(e);
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
        <View className="gap-2">
          <TouchableOpacity
            className="flex items-center p-2 rounded-lg bg-blue-500"
            onPress={() => setShowDatePicker(true)}
          >
            <Text className="text-white font-semibold">PICK DATE</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="flex items-center p-2 rounded-lg bg-green-500 "
            onPress={handleNewExpensesRecord}
          >
            <Text className="text-white font-semibold ">ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
