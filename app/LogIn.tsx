import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LogIn() {
  return (
    <View className="gap-4 w-full">
      <View className=" gap-6">
        <TextInput
          className="text-base w-full px-8 py-5 bg-[#FAF7F0] rounded-3xl black/60"
          placeholder="Email Address"
          keyboardType="email-address"
        />

        <TextInput
          className="bg-[#FAF7F0] text-base w-full px-8 py-5 rounded-3xl black/60"
          placeholder="Password"
          secureTextEntry={true}
        />
      </View>
      <View className="items-end">
        <Text className="text-sm">Forgot password?</Text>
      </View>
      <TouchableOpacity
        className="bg-[#36978C] flex items-center justify-center mt-16 w-52 h-14 px-4 self-center rounded-3xl"
        onPress={() => Alert.alert("Button Pressed", "You clicked WEW!")}
      >
        <Text className="text-2xl text-black/60 font-medium">Log In</Text>
      </TouchableOpacity>
    </View>
  );
}
