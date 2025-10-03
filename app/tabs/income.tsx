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
    <SafeAreaView
      className='flex-1 w-full h-full bg-[#81D8D0] p-3 gap-y-[1%]'
    >

      {/*Add Income*/}
      <View
        className='flex flex-[0.06] justify-end items-end'
      >
        <TouchableOpacity
          className='bg-[#D9D9D9] rounded-3xl px-5 py-2 border border-r-black'
          onPress={() => setClickAddIncome(true)}
        >
          <Text className="text-base text-[#616161]">+ Add Income</Text>
        </TouchableOpacity>
      </View>

      {/* Total Monlty Income */}
      <View
        className='flex flex-[0.15] py-2 px-8 flex-row justify-between items-center bg-[#499A4926] rounded-3xl'
      >
        <View>
          <Image
            source={require("../../assets/images/Income-Arrow.png")}
            style={{ width: 60, height: 60 }}
          ></Image>
        </View>
        <View className="flex gap-y-2 ">
          <View>
            <Text className="text-xl font-semibold text-[#676565]">Total Monthly Income</Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text className="text-3xl text-green-600">
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
      <View
        className='flex-[0.35] p-3 bg-[#FAF7F0] rounded-3xl'
      >
        <Text className="font-semibold ml-2">Income Categories</Text>
        <View
          className="flex-row flex-wrap w-full h-full gap-y-3 p-4 justify-between"
        >
          <View
            className="flex justify-center items-center  w-[48%] h-[25%] bg-green-200 rounded-xl"
          >
            <Text className="font-semibold">Work</Text>
            <Text className="text-green-600 font-bold">₱ {workIncome}</Text>
          </View>

          <View
            className="flex justify-center items-center w-[48%] h-[25%] bg-green-200 rounded-xl"
          >
            <Text className="font-semibold">Savings</Text>
            <Text className="text-green-600 font-bold">₱ {savingIncome}</Text>
          </View>

          <View
            className="flex justify-center items-center w-[48%] h-[25%] bg-green-200 rounded-xl"
          >
            <Text className="font-semibold">Investments</Text>
            <Text className="text-green-600 font-bold">₱ {investmentIncome}</Text>
          </View>

          <View
            className="flex justify-center items-center w-[48%] h-[25%] bg-green-200 rounded-xl"
          >
            <Text className="font-semibold">Side Hustle</Text>
            <Text className="text-green-600 font-bold">₱ {sideHustleIncome}</Text>
          </View>

          <View
            className="flex justify-center items-center w-[48%] h-[25%] bg-green-200 rounded-xl"
          >
            <Text className="font-semibold">Other</Text>
            <Text className="text-green-600 font-bold">₱ {otherIncome}</Text>
          </View>
        </View>
      </View>

      {/**Income List */}
      <View
        className='flex-[0.45] justify-center items-center'
      >
        <IncomeList/>
      </View>

      <Modal
        visible={clickAddIncome}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClickAddIncome(false)}
      >
        <View
          className="flex-1 bg-black/50 justify-center items-center"
        >
          <View
            className="flex justify-center items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg"
          >
            <AddIncomeModal/>

            <TouchableOpacity
              className="p-2 mt-2 bg-green-400 rounded-lg"
              onPress={() => setClickAddIncome(false)}
            >
              <Text
                className="text-2xl font-bold text-white"
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  )
}
