import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UpdateUserNameModal from "../components/updateUserName/updateName";

export default function LogOutButton() {
  const router = useRouter();
  const [userID, setUserID] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [showUpdateUserName, setShowUpdateUsername] = useState(false);

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserID(user.id || "");
          setUserEmail(user.email || "");
          setUserName(user.username || "");
        }
      } catch (e) {
        Alert.alert("Error", "Error in retrieving Data in local Storage");
      }
    };

    loadUserInfo();
  });

  const LogOutAccount = () => router.replace("/");

  return (
    <SafeAreaView className="flex-1 justify-center gap-2 items-center w-full h-full bg-[#81D8D0]">
      <View className="mt-8 flex items-end w-[90%] ">
        <TouchableOpacity onPress={() => setShowUpdateUsername(true)}>
          <Feather name="edit" size={25} color="black" />
        </TouchableOpacity>
      </View>
      {/* Head */}
      <View className="flex-1 w-[90%] items-center justify-between flex-col p-2 ">
        <View className="flex flex-col w-full items-center justify-center gap-5 ">
          <Text className="text-2xl font-medium">{userEmail}</Text>
          <MaterialCommunityIcons
            name="account-circle"
            size={120}
            color="black"
          />
          <Text className="text-xl font-medium">{userName}</Text>
        </View>

        <View className="w-full  ">
          <TouchableOpacity
            className="flex flex-row gap-3 rounded-full justify-center items-center p-10 w-full"
            onPress={LogOutAccount}
          >
            <Ionicons name="exit-outline" size={40} color="#A91B0D" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={showUpdateUserName}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowUpdateUsername(false)}
      >
        <View className="flex-1 bg-black/70 justify-center items-center">
          <View className="flex  border border-[#36978C] bg-white w-[85%] p-6 rounded-2xl shadow-lg">
            <View className="flex-row justify-between items-center w-full">
              <View />
              <TouchableOpacity onPress={() => setShowUpdateUsername(false)}>
                <Text className="text-2xl font-bold text-gray-600">✕</Text>
              </TouchableOpacity>
            </View>

            <UpdateUserNameModal />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
