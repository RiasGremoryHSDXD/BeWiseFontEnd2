import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ReusableModal from "./components/reusableModal";
import ReuseableButton from "./components/reusableButton";
import api from "../api/api"
import axios from "axios";
import { useAuth } from "./context/authContext";

export default function LogIn() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [logInError, setLogInError] = useState<boolean>(false);
  const [errorFields, setErrorFields] = useState<{
    email: boolean;
    password: boolean;
  }>({
    email: false,
    password: false,
  });

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const togglePassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const { login } = useAuth();

  const handleSignIn = async () => {
    // Reset error states
    const newErrorFields = {
      email: !email,
      password: !password,
    };

    setErrorFields(newErrorFields);

    if (!email || !password) return;

    setLoading(true);

    try
    {
      const response = await api.post("/auth/login", 
        {
          email,
          password
        }
      )

      if(response.status !== 200)
      {
        setLogInError(true);
        setLoading(false);
        return;
      }

      const { token, user } = response.data

      await login(user, token);

    }catch(error)
    {
      if(axios.isAxiosError(error) && error.response)
      {
        const errorMessage = error.response.data.message || "An error occured"

        if(errorMessage === "Invalid email or password")
        {
          setLogInError(true);
        }
        else
        {
          console.error("Sign Error", error)
        }
      }
      else
      {
        console.error("Sign Error (Possible Wrong IP address in front end .env)", error)
      }
    }
    finally {
      setLoading(false);
    }
  };

  const clearFieldError = (field: string) => {
    if (errorFields[field as keyof typeof errorFields]) {
      setErrorFields((prev) => ({
        ...prev,
        [field]: false,
      }));
    }
  };

  return (
    <>
      <View className="flex gap-3">
        <View>
          <TextInput
            className={`text-base w-full px-8 py-5 bg-[#FAF7F0] rounded-3xl ${
              errorFields.email ? "border border-red-500" : ""
            }`}
            placeholder="Email Address"
            placeholderTextColor={errorFields.email ? "#ef4444" : ""}
            keyboardType="email-address"
            value={email}
            onChangeText={(text) => {
              setEmail(text.trim().toLocaleLowerCase());
              clearFieldError("email");
            }}
          />
          {errorFields.email && (
            <Text className="text-red-500 text-sm ml-2 ">
              Email is required
            </Text>
          )}
        </View>

        <View className="w-full">
          <View
            className={`flex flex-row items-center w-full px-4 py-2 rounded-3xl bg-[#FAF7F0] ${
              errorFields.password ? "border border-red-500" : ""
            }`}
          >
            <TextInput
              className="flex-1 text-base px-2 py-3"
              placeholder="Password"
              placeholderTextColor={errorFields.password ? "#ef4444" : ""}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                clearFieldError("password");
              }}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={togglePassword}>
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={25}
                color="#000"
              />
            </TouchableOpacity>
          </View>

          {/* Error Message */}
          {errorFields.password && (
            <Text className="text-red-500 text-sm ml-2 mt-1">
              Password is required
            </Text>
          )}
        </View>

        <ReuseableButton
          reuseableButtonDesign="bg-[#36978C] flex items-center w-1/2 py-4 self-center rounded-[100px]"
          textButtonDesign="text-2xl text-black font-medium"
          textButton="Log In"
          onPress={handleSignIn}
        />
      </View>

      {/* Login Error Modal */}
      <ReusableModal
        visible={logInError}
        onRequestClose={() => setLogInError(false)}
      >
        {/* Error Icon */}
        <View className="items-center mb-4">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
            <Text className="text-red-600 text-4xl">✕</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Login Failed!
          </Text>
          <Text className="text-gray-600 text-center text-base leading-6">
            Invalid email or password. Please check your credentials and try
            again.
          </Text>
        </View>

        {/* Action Button */}
        <ReuseableButton
          reuseableButtonDesign="bg-[#36978C] py-3 px-6 rounded-2xl mt-6"
          textButtonDesign="text-white text-lg font-semibold text-center"
          textButton="Try Again"
          onPress={() => setLogInError(false)}
        />
      </ReusableModal>

      {/* Loading Overlay */}
      {loading && (
        <View className="absolute inset-0 flex  items-center">
          <ActivityIndicator size={100} color="#36978C" />
        </View>
      )}
    </>
  );
}
