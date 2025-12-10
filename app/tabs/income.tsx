import React, { useCallback, useEffect, useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "@react-native-vector-icons/ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";

// CUSTOM IMPORTS
import api from "../../api/api"; // Your Axios Instance
import AddIncomeModal from "../components/income/addIncome";
import IncomeHistory from "../components/income/incomeHistory";
import IncomeList from "../components/income/incomeList";
import CategoriesAmount from "../components/categoriesAmount";
import ReusableModal from "../components/reusableModal";

// --- FIX: Update Interface to match Child Component ---
interface Income {
  _id: string;
  incomeName: string;
  incomeCategory: "Work" | "Investment" | "Savings" | "Side Hustle" | "Other";
  amount: number;
  frequency: string;
  expectedPayOut: string;
}

export default function IncomeScreen() {
  // --- UI STATE ---
  const [clickAddIncome, setClickAddIncome] = useState<boolean>(false);
  const [toogleShowBalance, setToogleShowBalance] = useState<boolean>(true);
  const [clickHistory, setClickHistroy] = useState<boolean>(false);

  // --- DATA STATE ---
  const [incomeList, setIncomeList] = useState<Income[]>([]);
  const [refreshKey, setRefreshKey] = useState<number>(0);

  // --- CALCULATION STATE ---
  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<number>(0);
  const [categoriesData, setCategoriesData] = useState([
    { label: "Work", amount: 0 },
    { label: "Investment", amount: 0 },
    { label: "Savings", amount: 0 },
    { label: "Side Hustle", amount: 0 },
    { label: "Other", amount: 0 },
  ]);

  // 1. REFRESH TRIGGER
  const triggerRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // 2. FETCH DATA FUNCTION
  const fetchIncome = async () => {
    try {
      const response = await api.get("/income/readIncome");
      if (response.status === 200) {
        setIncomeList(response.data.income);
      }
    } catch (error) {
      console.error("Failed to fetch income", error);
    }
  };

  // 3. FETCH ON TAB FOCUS
  useFocusEffect(
    useCallback(() => {
      fetchIncome();
    }, [])
  );

  // 4. FETCH ON TRIGGER (Add/Delete/Update)
  useEffect(() => {
    if (refreshKey > 0) {
      fetchIncome();
    }
  }, [refreshKey]);

  // 5. CALCULATE TOTALS AUTOMATICALLY
  useEffect(() => {
    let total = 0;
    let work = 0,
      inv = 0,
      save = 0,
      side = 0,
      other = 0;

    incomeList.forEach((item) => {
      if (item.frequency !== "Monthly") return;

      const amt = Number(item.amount) || 0;
      total += amt;

      switch (item.incomeCategory) {
        case "Work":
          work += amt;
          break;
        case "Investment":
          inv += amt;
          break;
        case "Savings":
          save += amt;
          break;
        case "Side Hustle":
          side += amt;
          break;
        case "Other":
          other += amt;
          break;
      }
    });

    setTotalMonthlyIncome(total);
    setCategoriesData([
      { label: "Work", amount: work },
      { label: "Savings", amount: save },
      { label: "Investment", amount: inv },
      { label: "Side Hustle", amount: side },
      { label: "Other", amount: other },
    ]);
  }, [incomeList]);

  const monthlyIncome = incomeList.filter(
    (item) => item.frequency === "Monthly"
  );
  return (
    <SafeAreaView className="flex w-full h-full bg-[#81D8D0] p-3 gap-y-[1%]">
      {/* --- HEADER: ADD BUTTON --- */}
      <View className="flex justify-end items-end">
        <TouchableOpacity
          className="bg-[#D9D9D9] rounded-3xl px-5 py-2 border border-black/20"
          onPress={() => setClickAddIncome(true)}
        >
          <Text className="text-base text-[#616161]">+ Add Incomes</Text>
        </TouchableOpacity>
      </View>

      {/* --- TOTAL INCOME CARD --- */}
      <View className="flex px-8 py-2 flex-row justify-between items-center border border-green-600/40 bg-[#499A49]/15 rounded-3xl">
        <Image
          source={require("../../assets/images/Income-Arrow.png")}
          style={{ width: 100, height: 90 }}
        />

        <View className="flex gap-y-2 ">
          <View>
            <Text className="text-xl font-semibold text-[#676565]">
              Total Monthly Income
            </Text>
          </View>
          <View className="flex flex-row justify-between">
            <Text className="text-3xl text-green-600">
              ₱{" "}
              {toogleShowBalance ? totalMonthlyIncome.toLocaleString() : "****"}
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

      {/* --- CATEGORIES CHART --- */}
      <CategoriesAmount
        title="Income Category"
        categories={categoriesData}
        color="green"
        allItems={monthlyIncome}
      />

      {/* --- INCOME LIST / HISTORY --- */}
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

        {clickHistory ? (
          <IncomeHistory />
        ) : (
          <IncomeList data={incomeList} refreshTrigger={triggerRefresh} />
        )}
      </View>

      {/* --- ADD INCOME MODAL --- */}
      <ReusableModal
        visible={clickAddIncome}
        onRequestClose={() => setClickAddIncome(false)}
      >
        <AddIncomeModal
          onClose={() => setClickAddIncome(false)}
          onSuccess={() => {
            setClickAddIncome(false);
            triggerRefresh();
          }}
        />
      </ReusableModal>
    </SafeAreaView>
  );
}
