import { api } from "@/convex/_generated/api";
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
import IncomeHistory from "../components/income/incomeHistory";
import IncomeList from "../components/income/incomeList";
import CategoriesAmount from "../components/categoriesAmount";

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
  const [clickHistory, setClickHistroy] = useState<boolean>(false);

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

  const incomeCategories = [
    { label: 'Work', amount: workIncome },
    { label: 'Savings', amount: savingIncome },
    { label: 'Investments', amount: investmentIncome },
    { label: 'Side Hustle', amount: sideHustleIncome },
    { label: 'Other', amount: otherIncome },
  ];
  return (
    <SafeAreaView className="flex w-full h-full bg-[#81D8D0] p-3 gap-y-[1%]">
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
      <View className="flex px-8 py-6 flex-row justify-between items-center border border-green-600/40 bg-[#499A49]/15 rounded-3xl">
        <View>
          <Image
            source={require("../../assets/images/Income-Arrow.png")}
            style={{ width: 60, height: 60 }}
          ></Image>
        </View>
        <View className="flex gap-y-2 ">
          <View>
            <Text className="text-xl font-semibold text-[#676565]">
              Total Monthly Income
            </Text>
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
      <CategoriesAmount
        title="Income Category"
        categories={incomeCategories}
        color="green"
      />

      {/*Income List */}
      <View className="flex-1 gap-2">
        <View className="flex justify-center items-start">
          <TouchableOpacity
            className={`${clickHistory ? "bg-[#969799]" : "bg-[#BBF7D0]"} py-2 px-4 rounded-full`}
            activeOpacity={1}
            onPress={() => setClickHistroy(!clickHistory)}
          >
            <Text
              className={`${clickHistory ? "text-white" : "text-black"} font-medium text-lg tracking-wider`}
            >
              {clickHistory ? "< History" : "Active >"}
            </Text>
          </TouchableOpacity>
        </View>

        {clickHistory ? <IncomeHistory /> : <IncomeList />}
      </View>

      <Modal
        visible={clickAddIncome}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setClickAddIncome(false)}
      >
        <View className="flex-1 bg-black/50 justify-center items-center">
          <View className="flex justify-center items-center bg-white w-[85%] p-6 rounded-2xl shadow-lg">
            <AddIncomeModal onClose={() => setClickAddIncome(false)} />
          </View>
        </View>
      </Modal> 
    </SafeAreaView>
  );
}