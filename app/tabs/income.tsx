import { api } from "@/convex/_generated/api";
import { FontAwesome6 } from "@expo/vector-icons";
import { Id } from "@/convex/_generated/dataModel";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useQuery } from "convex/react";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AddIncomeModal from "../components/income/addIncome";
import IncomeList from "../components/income/incomeList";

export default function income() {
  const [userCredentialsID, setUserCredentialsID] =
    useState<Id<"userCredentials"> | null>(null);
  const [clickAddIncome, setClickAddIncome] = useState<boolean>(false);
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<number>(0);
  const [workIncome, setWorkIncome] = useState<number>(0);
  const [investmentIncome, setInvestmentIncome] = useState<number>(0);
  const [otherIncome, setOtherIncome] = useState<number>(0);
  const [savingIncome, setSavingIncome] = useState<number>(0);
  const [sideHustleIncome, setSideHustleIncome] = useState<number>(0);
  const [toogleShowBalance, setToogleShowBalance] = useState<boolean>(true);

  const totalIncome = useQuery(
    api.functions.income.totalIncome.totalIncome,
    userCredentialsID ? { userCredentialsID } : "skip"
  );

  const totalEachCategoryTotalIncome = useQuery(
    api.functions.income.totalEachCategoryIncome.totalEachCategoryIncome,
    userCredentialsID ? { userCredentialsID } : "skip"
  );

  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setUserCredentialsID(user.id || "");
        }
      } catch (error) {
        Alert.alert(
          "Error Local Storage [income.tsx file]",
          "Error retrieving data in local storage"
        );
      }
    };

    loadUserInfo();
  }, []);

  useEffect(() => {
    if (totalIncome !== undefined) setTotalMonthlyIncome(totalIncome);
  }, [totalIncome]);

  useEffect(() => {
    if (totalEachCategoryTotalIncome !== undefined) {
      setWorkIncome(totalEachCategoryTotalIncome.Work);
      setInvestmentIncome(totalEachCategoryTotalIncome.Investment);
      setSavingIncome(totalEachCategoryTotalIncome.Savings);
      setSideHustleIncome(totalEachCategoryTotalIncome["Side Hustle"]);
      setOtherIncome(totalEachCategoryTotalIncome.Other);
    }
  }, [
    totalEachCategoryTotalIncome,
    totalEachCategoryTotalIncome?.Work,
    totalEachCategoryTotalIncome?.Investment,
    totalEachCategoryTotalIncome?.Savings,
    totalEachCategoryTotalIncome?.["Side Hustle"],
    totalEachCategoryTotalIncome?.Other,
  ]);

  return (
    <SafeAreaView className="flex w-full h-full border bg-[#81D8D0] p-3 gap-y-3">
      {/*Add Income*/}
      <View className="flex justify-end items-end">
        <TouchableOpacity
          className="bg-[#D9D9D9] rounded-3xl px-5 py-2 border border-r-black"
          onPress={() => setClickAddIncome(true)}
        >
          <Text className="text-base text-[#616161]">+ Add Income</Text>
        </TouchableOpacity>
      </View>

      {/* Total Monthly Income */}
      <View className="flex flex-row justify-between items-center border border-green-800/20 bg-[#499A49]/15 rounded-3xl">
        <View className="ml-4 z-10">
          <Image
            source={require("../../assets/images/Income-Arrow.png")}
            style={{ width: 130, height: 100 }}
          ></Image>
        </View>
        <View className="flex gap-y-2 p-8 ">
          <View>
            <Text className="text-xl font-semibold text-[#676565]">
              Total Monthly Income
            </Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text className="text-3xl text-white">
              ₱ {toogleShowBalance ? totalMonthlyIncome : "****"}
            </Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setToogleShowBalance(!toogleShowBalance)}
            >
              <Ionicons
                name={toogleShowBalance ? `eye` : `eye-off`}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/**Income Category */}
      <View className="flex w-full py-6 px-4 bg-[#FAF7F0] gap-5 rounded-3xl ">
        <View className="w-full">
          <Text className="text-xl font-semibold">Income Categories</Text>
        </View>
        <View className="flex-row flex-wrap justify-between gap-4">
          <View className="flex border p-3 border-black/15 justify-center items-center w-[48%] bg-[#F2ECEC] rounded-xl">
            <Text className="text-lg font-medium">Work</Text>
            <Text className="text-lg text-green-600 font-medium">
              ₱ {workIncome}
            </Text>
          </View>

          <View className="flex border p-3 border-black/15 justify-center items-center w-[48%] bg-[#F2ECEC] rounded-xl">
            <Text className="text-lg font-medium">Savings</Text>
            <Text className="text-lg text-green-600 font-medium">
              ₱ {savingIncome}
            </Text>
          </View>

          <View className="flex border p-3 border-black/15 justify-center items-center w-[48%] bg-[#F2ECEC] rounded-xl">
            <Text className="text-lg font-medium">Investments</Text>
            <Text className="text-lg text-green-600 font-medium">
              ₱ {investmentIncome}
            </Text>
          </View>

          <View className="flex border p-3 border-black/15 justify-center items-center w-[48%] bg-[#F2ECEC] rounded-xl">
            <Text className="text-lg font-medium">Side Hustle</Text>
            <Text className="text-lg text-green-600 font-medium">
              ₱ {sideHustleIncome}
            </Text>
          </View>

          <View className="flex border p-3 border-black/15 justify-center items-center w-[48%] bg-[#F2ECEC] rounded-xl">
            <Text className="text-lg font-medium">Other</Text>
            <Text className="text-lg text-green-600 font-medium">
              ₱ {otherIncome}
            </Text>
          </View>
        </View>
      </View>

      {/* Income List */}
      <View className="flex-1">
        <View className="flex flex-row w-full justify-between mb-2">
          <TouchableOpacity className="p-2 bg-green-200 rounded-lg items-center justify-center">
            <Text className="text-lg font-medium"> Active </Text>
          </TouchableOpacity>
          <TouchableOpacity className="items-center justify-center">
            <Text className="text-lg font-medium text-[#ffffff]">
              History {">"}
            </Text>
          </TouchableOpacity>
        </View>
        <IncomeList />
      </View>

      {/* Add Income Modal */}
      <Modal
        visible={clickAddIncome}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClickAddIncome(false)}
      >
        <View className="flex-1 bg-black/80 justify-center items-center">
          <View className="flex justify-center items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg gap-y-5">
            <AddIncomeModal />
            <TouchableOpacity
              className="p-2 mt-2 border rounded-lg"
              onPress={() => setClickAddIncome(false)}
            >
              <Text className="text-2xl font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
