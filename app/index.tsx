import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CreateAccount from "./CreateAccount";
import LogIn from "./LogIn";

export default function Index() {
  const [userExistAcc, setUserExistAcc] = useState(false);
  const tasks = useQuery(api.tasks.get);

  return (
    <View className="flex-1 bg-[#FFFFFF]">
      <View
        className="absolute bottom-0 w-full h-[260px] opacity-30"
        pointerEvents="none"
      >
        <Image
          source={require("../assets/images/BackgroundImage.png")}
          className="w-full h-full"
          resizeMode="cover"
        />
      </View>

      <SafeAreaView className="flex-1">
        <View className="flex-1 items-center px-16">
          <View className="mt-20">
            <Image
              source={require("../assets/images/BeWise-Logo.png")}
              className="w-[200px] h-[200px]"
              resizeMode="contain"
            />
          </View>

          <View
            className={`justify-start w-full ${
              userExistAcc ? "mt-40" : "mt-20"
            }`}
          >
            {userExistAcc ? (
              <>
                <LogIn />
                <View className="flex flex-row justify-end mt-10">
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setUserExistAcc(false)}
                  >
                    <Text className="text-2xl text-[#36978C] font-extrabold">
                      - Sign Up
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <CreateAccount />
                <View className="flex flex-row justify-end mt-10">
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => setUserExistAcc(true)}
                  >
                    <Text className="text-2xl text-[#36978C] font-extrabold">
                      - Log In
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
