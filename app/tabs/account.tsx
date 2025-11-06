import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import UpdateUserNameModal from "../components/updateUserName/updateName";
import BudgetAssistance from "../components/budgetAssistant/budgetAssistant"
import Analytics from "../components/analytics/analytics";
import ReusableModal from "../components/reusableModal";

export default function LogOutButton() {
  const router = useRouter();
  const [userID, setUserID] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [showUpdateUserName, setShowUpdateUsername] = useState(false);
  const [clickBudgetAssistance, setClickBudgetAssistance] = useState<boolean>(false)
  const [clickAnalytics, setClickAnalytics] = useState<boolean>(false)

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
  }, []);

  const handleUsernameUpdate = (newUsername: string) => {
    setUserName(newUsername);
    setShowUpdateUsername(false);
  };

  const LogOutAccount = () => router.replace("/");

  return (
    <SafeAreaView className="flex-1 justify-center gap-2 items-center w-full h-full bg-[#81D8D0]">
      <View className="mt-8 flex items-end w-[90%]">
        <TouchableOpacity onPress={() => setShowUpdateUsername(true)}>
          <Feather name="edit" size={25} color="black" />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View className="flex-1 w-[90%] items-center justify-between flex-col p-2">
        <View className="flex flex-col w-full items-center justify-center gap-5">
          <MaterialCommunityIcons
            name="account-circle"
            size={120}
            color="black"
          />
          <Text className="text-xl font-medium">{userName}</Text>
        </View>

        {/* Menu Buttons */}
        <View className="w-full gap-4 mb-8">
          <TouchableOpacity 
            className="bg-white/90 w-full rounded-2xl p-4 flex-row items-center gap-4 shadow"
            onPress={() => setClickBudgetAssistance(true)}
          >
            <MaterialCommunityIcons name="chat-processing" size={28} color="#36978C" />
            <Text className="text-base font-medium text-gray-800">Chat Assistance</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            className="bg-white/90 w-full rounded-2xl p-4 flex-row items-center gap-4 shadow"
            onPress={() => setClickAnalytics(true)}  
          >
            <MaterialCommunityIcons name="chart-box" size={28} color="#36978C" />
            <Text className="text-base font-medium text-gray-800">Analytics</Text>
          </TouchableOpacity>

          {/* Log Out Button */}
          <TouchableOpacity
            className="bg-red-500/90 w-full rounded-2xl p-4 flex-row items-center justify-center gap-3 shadow mt-4"
            onPress={LogOutAccount}
          >
            <Ionicons name="exit-outline" size={28} color="white" />
            <Text className="text-base font-semibold text-white">Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Click Rename Button Modal */}
      <ReusableModal
        visible={showUpdateUserName}
        onRequestClose={() => setShowUpdateUsername(false)}
      >
        <View className="flex w-full items-end">  
          <TouchableOpacity onPress={() => setShowUpdateUsername(false)}>
            <Text className="text-2xl font-bold text-gray-600">✕</Text>
          </TouchableOpacity>
        </View>

        <UpdateUserNameModal onUsernameUpdated={handleUsernameUpdate} /> 
      </ReusableModal>

      {/**Click Budget Assistance Button Modal */}  
      <ReusableModal
        visible={clickBudgetAssistance}
        onRequestClose={() => setClickBudgetAssistance(false)}
        reusableModalDesign="flex-1 bg-black/50 justify-center items-center"
        reuseableModalContainerDesign = 'flex justify-center items-center bg-white w-[85%] py-6 rounded-2xl shadow-lg'
      >
        <BudgetAssistance onClose={() => setClickBudgetAssistance(false)}/>
      </ReusableModal>

      {/**Click Analytics Button Modal */}  
      <ReusableModal
        visible={clickAnalytics}
        onRequestClose={() => setClickAnalytics(false)}
        reuseableModalContainerDesign="flex-1 bg-black/50 justify-center items-center"
      >
        <Analytics onClose={() => setClickAnalytics(false)}/>
      </ReusableModal>

    </SafeAreaView>
  );
}