import { Ionicons } from "@react-native-vector-icons/ionicons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { useAuth } from "./context/authContext";

export default function LogOutBotton() {
  // Destructure the logout function directly from the context
  const { logout } = useAuth();

  return (
    <TouchableOpacity
      className="bg-white self-start rounded-full p-2"
      onPress={logout}
    >
      <Ionicons name="person-circle-outline" size={35} />
    </TouchableOpacity>
  );
}
