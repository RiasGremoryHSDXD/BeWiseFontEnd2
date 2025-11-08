import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";
import ReusableModal from "./components/reusableModal";
import ReuseableButton from "./components/reusableButton";
import api from "../api/api"
import axios from "axios";

export default function CreateAccount() {
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorFields, setErrorFields] = useState<{
    user_name: boolean;
    email: boolean;
    password: boolean;
  }>({
    user_name: false,
    email: false,
    password: false,
  });
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const [emailAlreadyExist, setEmailAlreadyExist] = useState<boolean>(false);
  const [emailNotValid, setEmailNotValid] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const handleSignUp = async () => {
    // Reset error states
    const newErrorFields = {
      user_name: !username,
      email: !email,
      password: !password,
    };

    setErrorFields(newErrorFields);

    if (!username || !email || !password) 
    {
      return;
    }

    try
    {
      const response = await api.post("/auth/register", 
      {
        username,
        email,
        password,
      });

      if(response.status === 201)
        {
          setUserName("");
          setEmail("");
          setPassword("");
          setErrorFields({ user_name: false, email: false, password: false });
          setShowSuccessModal(true)
        }
    }catch(error)
    {
      if(axios.isAxiosError(error) && error.response)
      {

        const errorMessage = error.response.data.message || "An error occured"

        if(errorMessage === "The Email already taken")
        {
          setEmailAlreadyExist(true);
        }
        else
        {
          setEmailNotValid(true);
        }
      }
      else
      {
        setEmailNotValid(true);
        console.error("Sign Error: ", error)
      }
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
              errorFields.user_name ? "border border-red-500" : ""
            }`}
            placeholder="Name"
            placeholderTextColor={errorFields.user_name ? "#ef4444" : ""}
            value={username}
            onChangeText={(text) => {
              setUserName(text);
              clearFieldError("user_name");
            }}
          />
          {errorFields.user_name && (
            <Text className="text-red-500 text-sm ml-2 ">Name is required</Text>
          )}
        </View>

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

        {/* Sign Up Button */}  
        <ReuseableButton
          reuseableButtonDesign="bg-[#36978C] flex items-center justify-center mt-8 w-52 h-14 px-4 self-center rounded-3xl"
          textButtonDesign="text-2xl text-black/60 font-medium"
          textButton="Sign Up"
          onPress={handleSignUp}
        />
      </View>

      {/* Success Modal */}
      <ReusableModal
        visible={showSuccessModal}
        onRequestClose={() => setShowSuccessModal(false)}
      >
        {/* Success Icon */}
        <View className="items-center mb-4">
          <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
            <Text className="text-green-600 text-4xl">✓</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Account Created
          </Text>
          <Text className="text-gray-600 text-center text-base leading-6">
            Your account was created successfully. Welcome!
          </Text>
        </View>
          
         {/* Action Button */} 
        <ReuseableButton
          textButtonDesign="text-white text-lg font-semibold text-center"
          textButton="Continue"
          onPress={() => setShowSuccessModal(false)}
        />
      </ReusableModal>

      {/* Email Address Is Used Modal */}
      <ReusableModal
        visible={emailAlreadyExist}
        onRequestClose={() => setEmailAlreadyExist(false)}
      >
        {/* Error Icon */}
        <View className="items-center mb-4">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
            <Text className="text-red-600 text-4xl">X</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Email already used
          </Text>
          <Text className="text-gray-600 text-center text-base leading-6">
            Please use a different email address.
          </Text>
        </View>

        {/* Action Button */}
        <ReuseableButton
          textButtonDesign="text-white text-lg font-semibold text-center"
          textButton="Try Again"
          onPress={() => setEmailAlreadyExist(false)}
        />
      </ReusableModal>

      {/* Email Address Invalid Format Modal */}
      <ReusableModal
        visible={emailNotValid}
        onRequestClose={() => setEmailNotValid(false)}
      >
        {/* Error Icon */}
        <View className="items-center mb-4">
          <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
            <Text className="text-red-600 text-4xl">X</Text>
          </View>
          <Text className="text-2xl font-bold text-gray-800 mb-2">
            Invalid Email
          </Text>
          <Text className="text-gray-600 text-center text-base leading-6">
            Please enter a valid email address.
          </Text>
        </View>

        {/* Action Button */}
        <ReuseableButton
          textButtonDesign="text-white text-lg font-semibold text-center"
          textButton="Try Again"
          onPress={() => setEmailNotValid(false)}
        />
      </ReusableModal>
    </>
  );
}
