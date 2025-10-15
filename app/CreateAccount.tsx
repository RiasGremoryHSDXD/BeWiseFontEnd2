import { api } from "@/convex/_generated/api";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

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

  const createAccount = useMutation(
    api.functions.credentials.insertNewUser.insertNewUser
  );
  const emailValidation = useQuery(
    api.functions.credentials.validateUserEmail.validateUserEmail,
    {
      email,
    }
  );

  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const validEmailRegex = /^[A-Za-z0-9._%+-]+@(gmail\.com|email\.com)$/;

  const handleSignUp = async () => {
    // Reset error states
    const newErrorFields = {
      user_name: !username,
      email: !email,
      password: !password,
    };

    setErrorFields(newErrorFields);

    if (!username || !email || !password) {
      return;
    }

    if (emailValidation === undefined) return;

    if (!validEmailRegex.test(email)) {
      setEmailNotValid(true);
      return;
    }

    if (emailValidation) {
      setEmailAlreadyExist(true);
      return;
    }

    await createAccount({ username, email, password });

    setUserName("");
    setEmail("");
    setPassword("");
    setErrorFields({ user_name: false, email: false, password: false });
    setShowSuccessModal(true);
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


        <TouchableOpacity
          className="bg-[#36978C] flex items-center justify-center mt-8 w-52 h-14 px-4 self-center rounded-3xl"
          onPress={handleSignUp}
        >
          <Text className="text-2xl text-black/60 font-medium">Sign Up</Text>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-8 mx-6 w-80 shadow-2xl">
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
            <TouchableOpacity
              className="bg-[#36978C] py-3 px-6 rounded-2xl mt-6"
              onPress={() => setShowSuccessModal(false)}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Continue
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Email Address Is Used Modal */}
      <Modal
        visible={emailAlreadyExist}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEmailAlreadyExist(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-8 mx-6 w-80 shadow-2xl">
            {/* Wrong Icon */}
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
            <TouchableOpacity
              className="bg-[#36978C] py-3 px-6 rounded-2xl mt-6"
              onPress={() => setEmailAlreadyExist(false)}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Email Address Invalid Format Modal */}
      <Modal
        visible={emailNotValid}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setEmailNotValid(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-8 mx-6 w-80 shadow-2xl">
            {/* Wrong Icon */}
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
            <TouchableOpacity
              className="bg-[#36978C] py-3 px-6 rounded-2xl mt-6"
              onPress={() => setEmailNotValid(false)}
            >
              <Text className="text-white text-lg font-semibold text-center">
                Try Again
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}
