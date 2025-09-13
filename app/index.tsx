import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import CreateAccount from "./CreateAccount";
import LogIn from "./LogIn";


export default function Index() {

  const [userExistAcc, setUserExistAcc] = useState(false)
  const tasks = useQuery(api.tasks.get)

  return (
    <View className="flex-1 items-center w-full h-full bg-[#81D8D0]">

      <View className="flex-[40] w-full items-center justify-center">
        <Image
          source={require("../assets/images/AppLogo.png")}
        />
      </View>
      
      <View className="flex-[60] w-[80%]">
        <View className="w-full">
          {
          userExistAcc ? (
            <>
              <LogIn/>
              <View className="flex flex-row justify-end mt-[85px]">
                  <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setUserExistAcc(false)}
                  >
                      <Text className="text-2xl text-[#36978C] font-semibold">- Sign Up</Text>
                  </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <CreateAccount/>

              
              <View className="flex flex-row justify-end mt-10">
                  <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setUserExistAcc(true)}
                  >
                      <Text className="text-2xl text-[#36978C] font-semibold">- Log In</Text>
                  </TouchableOpacity>
              </View> 
            </>)}
        </View>
      </View>
          
      
      {/* <View 
        className="absolute bottom-0 w-full h-[110px]" 
        pointerEvents="none"
      >
        <Image
          source={require("../assets/images/BackGroundImg.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View> */}

    </View>
  );
}
