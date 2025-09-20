import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LogOutButton() {
  const router = useRouter();

  const LogOutAccount = () => router.replace("/");
  return (
    <SafeAreaView className="flex-1 justify-center items-center w-full h-full bg-[#81D8D0]">
      {/* Head */}
      <View className="flex-1 mt-36 w-[90%] items-center justify-between flex-col p-2 ">
        <View className="flex flex-col w-full items-center justify-center gap-5 ">
          <Text className="text-5xl font-medium">Profile</Text>
          <MaterialCommunityIcons
            name="account-circle"
            size={120}
            color="black"
          />
          <Text className="text-2xl font-medium">John Doe</Text>
        </View>
        <View className="w-full">
          <TouchableOpacity
            className="flex flex-row gap-3  rounded-full items-center p-10 w-full"
            onPress={LogOutAccount}
          >
            <Ionicons name="exit-outline" size={24} color="red" />
            <Text className="text-red-600 text-xl">Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
