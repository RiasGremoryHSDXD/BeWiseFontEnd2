import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import LogOutBotton from "../LogOutBotton";

export default function home() {

  const [toogleShowBalance, setToogleShowBalance] = useState<boolean>(true)

  const currentBalance = 25000
  const income = 24000
  const expenses = 4000
  const currentSpent = 8000
  const currentBudget = 25000
  const percentageSpent = Math.round((currentSpent / currentBudget) * 100)
  
  
  return (
    <View className="flex-1 justify-center gap-y-6 items-center w-full h-full bg-[#81D8D0]">

      <View
        className="w-[90%]"
      >
        <LogOutBotton/>
      </View>


      {/*Current Balance*/}
      <View
        className="flex-[0.15] w-[90%] flex-row justify-between items-center px-4 bg-white/30 rounded-3xl"
      >
        <View className="flex gap-y-2">
          <Text>Current Balance</Text>

          <View className="flex flex-row gap-2">
            <Image
              source={require('../../assets/images/peso_sign.png')}
              style={{width: 30, height: 30}}
            >
            </Image>
            
            <Text className="text-3xl">{toogleShowBalance ? currentBalance : '****'}</Text>
        
          </View>
        </View>

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

      {/*Total Income  & Expenses*/}
      <View
        className="flex-[0.10] w-[90%]"
      >
        <View
          className="flex-1 flex-row justify-between w-full h-full"
        >
          
          {/*Income */}
          <View
            className="flex-[0.45] flex-row w-full bg-white gap-5 p-2 items-center rounded-3xl"
          >
            <Image
              source={require('../../assets/images/Income_icon.png')}
              style={{width: 40, height: 40}}
            >
            </Image>

            <View>
              <Text>Income</Text>
              <Text className="text-green-400">₱ {income}</Text>
            </View>

          </View>

          {/* Expenses*/}
          <View
            className="flex-[0.45] flex-row gap-5 p-2 items-center w-full bg-white rounded-3xl"
          >
            <Image
              source={require("../../assets/images/expenses_icon.png")}
              style={{width:40, height: 40}}
            >
            </Image>

            <View>
              <Text>Expenses</Text>
              <Text className="text-red-400">₱ {expenses}</Text>
            </View>
          </View>

        </View>
      </View>

      {/* Montly Budget */}
      <View className="flex-[0.2] w-[90%] bg-white p-3 rounded-3xl gap-y-2">
        <View className="flex flex-row items-center bg-red">
          <Image
            source={require('../../assets/images/montly_budget_icon.png')}
            style={{width: 40, height: 40}}
          >
          </Image>

          <Text>Montly Budget</Text>
        </View>

        
        <View className="flex flex-row justify-between">
          <Text>Spent: ₱ {currentSpent}</Text>
          <Text>Budget: ₱ {currentBudget}</Text>
        </View>

        {/*Progess Bar */}
        <View className="bg-gray-200 rounded-full h-3 mb-2">
          <View
            className="bg-[#36978C] h-full rounded-full"
            style={{width: `${percentageSpent}%`}}
          >
          </View>
        </View>

        <View className="flex justify-center items-center">
          <Text>Total budget used: {percentageSpent}%</Text>
        </View>
      </View>

      {/*Recent Transaction */}
      <View className="flex-[0.3] w-[90%] p-4 bg-[#36978C] rounded-3xl">

        <View className="flex flex-row justify-between">
          <Text>Recent Transaction</Text>
          
          <TouchableOpacity>
            <Text>View All {`>`}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}