import Ionicons from "@react-native-vector-icons/ionicons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function income() {

  const [totalMonthlyIncome, setTotalMonthlyIncome] = useState<number>(59000)
  const [workIncome, setWorkIncome] = useState<number>(29000)
  const [investmentIncome, setInvestmentIncome] = useState<number>(19000)
  const [otherIncome, setOtherIncome] = useState<number>(900)
  const [savingIncome, setSavingIncome] = useState<number>(2000)
  const [sideHustleIncome, setSideHustleIncome] = useState<number>(9000)
  const [toogleShowBalance, setToogleShowBalance] = useState<boolean>(true)

  return (
    <View className="flex-1  justify-center items-center w-full h-full bg-[#81D8D0]">

        {/*Current Monthly Income  */}
        <View className="flex-[0.15] w-[90%] flex-row justify-between items-center px-4 bg-white/30 rounded-3xl">
          
          <View>
              <Text>Total Monthly Income</Text>
              <Text className="text-3xl">₱ {toogleShowBalance ? totalMonthlyIncome : "****"}</Text>
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

        {/*Income Categories */}
        <View className="flex-[0.30] bg-red-400">
          <Text>Income Categories</Text>

          <View className="flex h-full flex-row bg-white">

            <View className="flex flex-col gap-y-2">
             
              <View className="border rounded-xl flex justify-center items-center">
                <Text>Work</Text>
                <Text>{workIncome}</Text>

              </View>

            <View className="border rounded-xl flex justify-center items-center">
              <Text>Investment</Text>
              <Text>{investmentIncome}</Text>
            </View>

            <View className="border rounded-xl flex justify-center items-center">
              <Text>Other</Text>
              <Text>{otherIncome}</Text>
            </View>
            </View>

            <View className="bg-yellow-300 gap-y-2">
              <View className="border rounded-xl flex justify-center items-center"> 
                <Text>Saving</Text>
                <Text>{savingIncome}</Text>
              </View>

              <View className="border rounded-xl flex justify-center items-center">
                <Text>Side Hustle</Text>
                <Text>{sideHustleIncome}</Text>
              </View>
            </View>

        </View>

        </View>

        {/*Income History */}
        <View></View>
    </View>
  );
}