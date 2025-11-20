import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import Loading from "../Loading";
import api from "../../../api/api";

type IncomeCategory =
  | "Work"
  | "Investment"
  | "Savings"
  | "Side Hustle"
  | "Other";
type Frequency = "OneTime" | "Monthly";

// Updated Props Interface (No Convex Types)
type UpdateIncomeProps = {
  incomeID: string;
  incomeName: string;
  incomeCategory: string;
  incomeAmount: number;
  incomeExpectedPayOut: Date;
  incomeFrequency: string;
  onSuccessUpdate: () => void;
  onClose: () => void;
};

export default function UpdateIncome({
  incomeID,
  incomeName,
  incomeCategory,
  incomeAmount,
  incomeExpectedPayOut,
  incomeFrequency,
  onSuccessUpdate,
  onClose,
}: UpdateIncomeProps) {
  // Initialize state with props
  const [newIncomeName, setNewIncomeName] = useState<string>(incomeName);
  const [newIncomeCategory, setNewIncomeCategory] = useState<IncomeCategory>(
    incomeCategory as IncomeCategory
  );
  const [newAmount, setNewAmount] = useState<number>(incomeAmount);
  const [newDateExpectedPayOut, setNewDateExpectedPayout] = useState<Date>(
    new Date(incomeExpectedPayOut)
  );
  const [newFrequency, setNewFrequency] = useState<Frequency>(
    incomeFrequency as Frequency
  );
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync state if props change (optional, but good for modals)
  useEffect(() => {
    setNewIncomeName(incomeName);
    setNewIncomeCategory(incomeCategory as IncomeCategory);
    setNewAmount(incomeAmount);
    setNewDateExpectedPayout(new Date(incomeExpectedPayOut));
    setNewFrequency(incomeFrequency as Frequency);
  }, [
    incomeName,
    incomeCategory,
    incomeAmount,
    incomeExpectedPayOut,
    incomeFrequency,
  ]);

  const handleUpdateButton = async () => {
    if (loading || isProcessing) return;
    setIsProcessing(true);
    setLoading(true);

    try {
      // Validation
      if (
        !incomeID ||
        !newIncomeName ||
        !newIncomeCategory ||
        !newAmount ||
        !newDateExpectedPayOut ||
        !newFrequency
      ) {
        Alert.alert("Missing Data", "Please fill out all fields");
        return;
      }

      // API Call
      const response = await api.put(`/income/updateIncome/${incomeID}`, {
        incomeName: newIncomeName,
        incomeCategory: newIncomeCategory,
        amount: newAmount,
        expectedPayOut: newDateExpectedPayOut.toISOString(),
        frequency: newFrequency,
      });

      if (response.status === 200) {
        Alert.alert("Success", "Income updated successfully.");
        onSuccessUpdate(); // Trigger parent refresh
      }
    } catch (error: any) {
      console.error(error);
      if (error.response) {
        Alert.alert(
          "Update failed",
          error.response.data.message || "Could not update income"
        );
      } else {
        Alert.alert("Error", "Network error or server unreachable");
      }
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <View className="w-full gap-y-3">
      {loading && <Loading />}

      <Text className="font-semibold">Income Name:</Text>
      <TextInput
        className="border rounded-lg p-3"
        value={newIncomeName}
        onChangeText={(text) => setNewIncomeName(text)}
      />

      <Text className="font-semibold">Category</Text>
      <View className="border border-black rounded-lg overflow-hidden">
        <Picker
          selectedValue={newIncomeCategory}
          onValueChange={(itemValue) => setNewIncomeCategory(itemValue)}
        >
          <Picker.Item label="Work" value="Work" />
          <Picker.Item label="Investment" value="Investment" />
          <Picker.Item label="Savings" value="Savings" />
          <Picker.Item label="Side Hustle" value="Side Hustle" />
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
        <Text className="font-semibold">Expected PayOut : </Text>

        <TouchableOpacity
          className="border border-gray-300 rounded-md px-3 py-2 bg-gray-50"
          onPress={() => setShowDatePicker(true)}
        >
          <Text className="font-semibold">
            {newDateExpectedPayOut
              ? newDateExpectedPayOut.toDateString()
              : "Selected date"}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={newDateExpectedPayOut}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setNewDateExpectedPayout(selectedDate);
            }}
          />
        )}
      </View>

      <View className="flex-row justify-between mt-4 gap-2">
        <TouchableOpacity
          onPress={handleUpdateButton}
          className="bg-blue-500 items-center p-3 rounded-lg flex-1"
          disabled={loading || isProcessing}
        >
          <Text className="font-semibold text-lg text-white">Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}