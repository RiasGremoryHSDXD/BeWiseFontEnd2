
import AsyncStorage from "@react-native-async-storage/async-storage";
import Ionicons from "@react-native-vector-icons/ionicons";
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
import AddExpenses from "../components/expenses/addExpenses";
import ExpensesHistory from "../components/expenses/expensesHistory";
import CategoriesAmount from "../components/categoriesAmount";
import ReusableModal from "../components/reusableModal";


export default function income() {
  const [clickAddExpense, setClickAddExpense] = useState<boolean>(false);

  // keep your separate state variables as you
  const [totalMonthlyExpenses, setTotalMonthlyExpenses] = useState<number>(0);
  const [insuranceExpenses, setInsuranceExpeses] = useState<number>(0);
  const [gameExpenses, setGameExpenses] = useState<number>(0);
  const [billExpenses, setBillExpenses] = useState<number>(0);
  const [groceryExpenses, setGroceryExpenses] = useState<number>(0);
  const [otherExpenses, setOtherExpenses] = useState<number>(0);
  const [toggleShowBalance, setToggleShowBalance] = useState<boolean>(true);
  const [clickHistory, setClickHistroy] = useState<boolean>(false);

  // const totalExpenses = useQuery(
  //   api.functions.expenses.totalExpenses.totalExpenses,
  //   userCredentialsID ? { userCredentialsID } : "skip"
  // );

  // const totalEachCategoryTotalExpenses = useQuery(
  //   api.functions.expenses.totalEachCategoryExpenses.totalEachCategoryExpenses,
  //   userCredentialsID ? { userCredentialsID } : "skip"
  // );

  // useEffect(() => {
  //   const loadUserInfo = async () => {
  //     try {
  //       const storedUser = await AsyncStorage.getItem("user");
  //       if (storedUser) {
  //         const user = JSON.parse(storedUser);
  //         setUserCredentialsID(user.id || "");
  //       }
  //     } catch (error) {
  //       Alert.alert(
  //         "Error Local Storage [expenses.tsx file]",
  //         "Error retrieving data in local storage"
  //       );
  //     }
  //   };

  //   loadUserInfo();
  // }, []);


  // useEffect(() => {
  //   if (totalExpenses !== undefined) setTotalMonthlyExpenses(totalExpenses);
  // }, [totalExpenses]);

  const expenseCategories = [
    { label: 'Insurance', amount: insuranceExpenses },
    { label: 'Bill', amount: billExpenses },
    { label: 'Game', amount: gameExpenses },
    { label: 'Grocery', amount: groceryExpenses },
    { label: 'Other', amount: otherExpenses },
  ];


  // useEffect(() => {
  //   if (totalEachCategoryTotalExpenses !== undefined) {
  //     setInsuranceExpeses(totalEachCategoryTotalExpenses.Insurance);
  //     setBillExpenses(totalEachCategoryTotalExpenses.Bills);
  //     setGameExpenses(totalEachCategoryTotalExpenses.Game);
  //     setGroceryExpenses(totalEachCategoryTotalExpenses.Grocery);
  //     setOtherExpenses(totalEachCategoryTotalExpenses.Other);
  //   }
  // }, [
  //   totalEachCategoryTotalExpenses,
  //   totalEachCategoryTotalExpenses?.Insurance,
  //   totalEachCategoryTotalExpenses?.Bills,
  //   totalEachCategoryTotalExpenses?.Game,
  //   totalEachCategoryTotalExpenses?.Grocery,
  //   totalEachCategoryTotalExpenses?.Other,
  // ]);

  return (
    <SafeAreaView className="flex w-full h-full bg-[#81D8D0] p-3 gap-y-[1%]">
      {/* Add Expenses control */}
      <View className="flex  justify-end items-end">
        <TouchableOpacity
          className="bg-[#D9D9D9] rounded-3xl px-5 py-2 border border-r-black"
          onPress={() => setClickAddExpense(true)}
        >
          <Text className="text-base text-[#616161]">+ Add Expenses</Text>
        </TouchableOpacity>
      </View>

      {/* Total Monthly Expenses */}
      <View className="flex py-5 px-8 flex-row justify-between items-center border border-red-500/20 bg-[#9A4949]/20 rounded-3xl">
        <View>
          <Image
            source={require("../../assets/images/Expenses-Arrow.png")}
            style={{ width: 60, height: 60 }}
          />
        </View>

        <View className="flex gap-y-2">
          <View>
            <Text className="text-xl font-semibold text-[#676565]">
              Total Monthly Expenses
            </Text>
          </View>

          <View className="flex flex-row justify-between items-center">
            <Text className="text-3xl font-semibold text-red-600">
              ₱ {toggleShowBalance ? totalMonthlyExpenses : "****"}
            </Text>

            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setToggleShowBalance(!toggleShowBalance)}
            >
              <Ionicons
                name={toggleShowBalance ? "eye" : "eye-off"}
                size={28}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Expenses Category */}
      <CategoriesAmount 
        title="Expenses Category"
        categories={expenseCategories}
        color="red"
      />

      {/**Expenses List */}
      <View className="flex-1 gap-2">
        <View className="flex justify-center items-start">
          <TouchableOpacity
            className={`${clickHistory ? "bg-[#969799]" : "bg-[#FECACA]"} py-2 px-4 rounded-full`}
            activeOpacity={1}
            onPress={() => setClickHistroy(!clickHistory)}
          >
            <Text
              className={`${clickHistory ? "text-white" : "text-black"} font-medium text-lg  tracking-wider`}
            >
              {clickHistory ? "< History" : "Active >"}
            </Text>
          </TouchableOpacity>
        </View>
        {clickHistory ? <ExpensesHistory /> : <Text>No Expenses</Text>}
      </View>

      {/* Click Add Expenses Button Modal */}
      <ReusableModal
        visible={clickAddExpense} 
        onRequestClose={() => setClickAddExpense(false)}
      >
        <AddExpenses closeModal={() => setClickAddExpense(false)}/>
      </ReusableModal>

    </SafeAreaView>
  );
}
