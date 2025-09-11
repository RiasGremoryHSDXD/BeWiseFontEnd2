import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function LogIn() {
  return (
    <View className="flex gap-10">
      <TextInput
        className='text-xl bg-white px-[15px] py-[15px] rounded-2xl'
        placeholder="Email"
        keyboardType="email-address"
      />

      <TextInput
        className='text-xl bg-white px-[15px] py-[15px] rounded-xl'
        placeholder="Password"
        secureTextEntry={true}
      />        
        <View className="flex items-end">
            <Text>Forgot password?</Text>
        </View>

        <TouchableOpacity
            className="bg-[#36978C] flex items-center w-1/2 py-4  self-center rounded-[100px]"
            onPress={() => Alert.alert("Button Pressed", "You clicked WEW!")}>
            <Text className="text-2xl text-black font-medium">Log In</Text>
        </TouchableOpacity>
    </View>
  );
}
