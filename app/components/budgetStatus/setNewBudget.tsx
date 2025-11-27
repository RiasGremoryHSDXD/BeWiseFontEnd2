import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useState } from "react";
import { Picker } from "@react-native-picker/picker";

type ExpensesCategory =
  | "Insurance"
  | "Bills"
  | "Hobby"
  | "Daily Need"
  | "Other";
type Prop = {
  closeModal: () => void;
};
export default function setNewBudget({ closeModal }: Prop) {
  const [budgetName, setBudgetName] = useState<string>("");
  const [amount, setAmount] = useState<number>(0);
  const [budgetCategoryValue, setBudgetCategoryValue] =
    useState<ExpensesCategory>("Other");

  return (
    <View className="w-full gap-y-3">
      <Text className="font-semibold">Set new budget</Text>

      <TextInput
        className="border rounded-md py-5 px-3"
        placeholder="Budget Name"
        value={budgetName}
        onChangeText={(text) => setBudgetName(text)}
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

      {/*Expenses Category*/}
      <Text className="font-bold mt-2">Category</Text>
      <View className="border border-black rounded-lg overflow-hidden">
        <Picker
          selectedValue={budgetCategoryValue}
          onValueChange={(itemValue) => setBudgetCategoryValue(itemValue)}
        >
          <Picker.Item label="Insurance" value="Insurance" />
          <Picker.Item label="Bills" value="Bills" />
          <Picker.Item label="Hobby" value="Hobby" />
          <Picker.Item label="Daily Need" value="Daily Need" />
          <Picker.Item label="Other" value="Other" />
        </Picker>
      </View>

      <View className="flex flex-row justify-between mt-5 w-full">
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 p-3 bg-red-400 rounded-lg items-center mr-2"
          onPress={() => console.log("successfully Added a new Budget")}
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
    </View>
  );
}
