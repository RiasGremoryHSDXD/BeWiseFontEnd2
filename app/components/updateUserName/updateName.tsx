import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

interface UpdateUsernameProps {
  onUsernameUpdated?: (newUsername: string) => void;
}

export default function UpdateUsername({ onUsernameUpdated }: UpdateUsernameProps) {
  const [newUsername, setNewUsername] = useState("");

  const handleUpdate = async () => {
    if (!newUsername.trim()) {
      Alert.alert("Error", "Please enter a username");
      return;
    }

    try {
      const storedUser = await AsyncStorage.getItem("user");
      if (!storedUser) {
        Alert.alert("Error", "No user found");
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user.id;

      if (!userId) {
        Alert.alert("Error", "User ID not found");
        return;
      }

      // Update local storage
      user.username = newUsername.trim();
      await AsyncStorage.setItem("user", JSON.stringify(user));

      // Call the callback to update parent component
      if (onUsernameUpdated) {
        onUsernameUpdated(newUsername.trim());
      }

      setNewUsername("");
      Alert.alert("Success", "Username updated successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to update username");
    }
  };

  return (
    <View className="flex gap-y-5 w-full">
      <Text className="text-xl font-semibold text-center">Update Username</Text>

      <View className="gap-2">
        <Text>New Username: </Text>
        <TextInput
          className="border p-4 rounded-md"
          placeholder="Ex. raz"
          value={newUsername}
          onChangeText={setNewUsername}
        />

        <View className="items-center mt-2">
          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-lg"
            onPress={handleUpdate}
          >
            <Text className="text-center text-xl font-medium text-white">
              Proceed
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}