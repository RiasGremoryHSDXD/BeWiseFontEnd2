import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useRouter } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";

export default function LogOutBotton() {
  const router = useRouter();

  const LogOutAccount = () => router.replace("/");
  return (
    <TouchableOpacity
      className="bg-white self-start rounded-full p-2"
      onPress={LogOutAccount}
    >
      <Ionicons name="person-circle-outline" size={35} />
    </TouchableOpacity>
  );
}
