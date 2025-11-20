import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "convex/react";
import { use, useEffect, useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import LoadingScreen from "../Loading";
import api from "../../../api/api";
import useAsyncStorage from "../../hooks/asyncStorageData";



type IncomeCategory =
  | "Work"
  | "Investment"
  | "Savings"
  | "Side Hustle"
  | "Other";
type Frequency = "OneTime" | "Monthly";
type Props = {
  onClose: () => void;
  onSuccess: () => void;
};


export default function addIncome({onClose, onSuccess} : Props) {
  const [userCredentialsID, setUserCredentialsID] =
    useState<string | null>(null);
  const [incomeName, setIncomeName] = useState<string>("");
  const [incomeCategoryValue, setIncomeCategoryValue] =
    useState<IncomeCategory>("Other");
  const [amount, setAmount] = useState<number>(0);
  const [expectedPayOut, setExpectedPayOut] = useState<Date>(new Date());
  const [frequency, setFrequency] = useState<Frequency>("OneTime");
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigation = useNavigation();

  const userDetails = useAsyncStorage()

  useEffect(() => {
    if(userDetails && userDetails._id){
      setUserCredentialsID(userDetails._id)
    }
  }, [userDetails])

  const handleNewIncomeRecord = async () => {
    if (loading || isProcessing) return;
    setIsProcessing(true);

    try {
      if (!userCredentialsID || !incomeName || !amount || !expectedPayOut) {
        Alert.alert("Missing data", "Please fill out all fields.");
        return;
      }

      setLoading(true);

      const response = await api.post("/income/addIncome", {
        userCredentialsID,
        incomeName, 
        incomeCategory: incomeCategoryValue, 
        amount, 
        expectedPayOut: expectedPayOut.toString(), 
        frequency
      })

      if(response.status === 200){
          setLoading(false);
          Alert.alert("Success", "Income record added successfully!");
          onSuccess();
      }

      setLoading(false);
    } catch (error : any) {
      Alert.alert("Error", error.response.data.message || "Failed to add income");
    } finally {
      setLoading(false);
      setIsProcessing(false);
    }
  };

  return (
    <View className="flex gap-y-3 w-full">
      {/*Income Name View*/}
      <View className="flex flex-col gap-y-3">
        <Text className="font-semibold">Income Details:</Text>

        {/* Income Name */}
        <TextInput
          className="border rounded-md py-5 px-3"
          placeholder="Income name"
          value={incomeName}
          onChangeText={(text) => setIncomeName(text)}
        ></TextInput>

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
        ></TextInput>
      </View>

      {/*Income Category View*/}
      <Text className="font-semibold mt-2">Category:</Text>
      <View className="border border-black rounded-lg overflow-hidden">
        <Picker
          selectedValue={incomeCategoryValue}
          onValueChange={(itemValue) => setIncomeCategoryValue(itemValue)}
        >
          <Picker.Item label="Work" value="Work" />
          <Picker.Item label="Investment" value="Investment" />
          <Picker.Item label="Savings" value="Savings" />
          <Picker.Item label="Side Hustle" value="Side Hustle" />
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

      {/* expectedPayOut */}
      <View className="flex flex-row justify-between">
        {frequency === "OneTime" ? (
          <Text>Expected Payout : </Text>
        ) : (
          <Text>Monthly Payout : </Text>
        )}

        {expectedPayOut && (
          <TouchableOpacity
            className="border border-gray-300 rounded-md px-3 bg-gray-50"
            onPress={() => setShowDatePicker(true)}
          >
            <Text>{expectedPayOut.toDateString()}</Text>
          </TouchableOpacity>
        )}

        {showDatePicker && (
          <DateTimePicker
            value={expectedPayOut || new Date()}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setExpectedPayOut(selectedDate);
            }}
          />
        )}
      </View>

      <View className="flex flex-row justify-between mt-5 w-full">
        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 p-3 bg-green-400 rounded-lg items-center mr-2"
          onPress={handleNewIncomeRecord}
          disabled={loading || isProcessing}
        >
          <Text className="text-xl font-semibold text-white">Add</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={1}
          className="flex-1 p-3 bg-gray-400 rounded-lg items-center ml-2"
          onPress={onClose}
        >
          <Text className="text-xl font-semibold text-white">Close</Text>
        </TouchableOpacity>
      </View>

      {loading && <LoadingScreen />}
    </View>
  );
}
