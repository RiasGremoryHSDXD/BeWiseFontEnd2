import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { Foundation } from "@expo/vector-icons";
import { CategoryType } from "@/app/types/categoryType";
interface EditShowBudgetProps {
  visible: boolean;
  onRequestClose: () => void;
  category: CategoryType | null;
}

export default function EditShowBudget({
  visible,
  onRequestClose,
}: EditShowBudgetProps) {
  const [amount, setAmount] = useState("");

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View className="flex-1 bg-black/70 justify-center items-center  w-full">
        <View className="bg-[#FAF7F0] p-5 w-[90%] gap-y-5 rounded-2xl">
          <View className="flex flex-row gap-2 mb-2 items-center">
            <Foundation name="target" size={25} color="black" />
            <Text className="text-xl font-semibold">Budget</Text>
          </View>
          <View className="flex flex-col gap-2 mb-2">
            <Text className="font-semibold">Enter Amount:</Text>
            <TextInput
              className="p-5 bg-white border rounded-3xl"
              keyboardType="numeric"
            ></TextInput>
          </View>

          <View className="flex flex-row justify-between gap-5">
            <TouchableOpacity
              onPress={onRequestClose}
              className="flex-1 p-2 bg-[#FFFDC2] rounded-xl items-center justify-center border "
            >
              <Text className="text-xl font-semibold ">Continue</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onRequestClose}
              className="flex-1 p-2 bg-[#898E8C] rounded-xl items-center justify-center border "
            >
              <Text className="text-xl font-semibold text-white">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
