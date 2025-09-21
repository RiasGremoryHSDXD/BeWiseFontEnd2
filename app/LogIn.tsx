import { api } from "@/convex/_generated/api";
import { Ionicons } from "@react-native-vector-icons/ionicons";
import { useQuery } from "convex/react";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Modal, Text, TextInput, TouchableOpacity, View } from "react-native";

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

  const togglePassword = () => {
    setShowPassword((showPassword) => !showPassword);
  };

  const logInCredentialsValidation = useQuery(
    api.functions.credentials.logInUser.logInUser,
    { email, password }
  );

  const handleSignIn = async () => {
    // Reset error states
    const newErrorFields = {
      email: !email,
      password: !password,
    };

    setErrorFields(newErrorFields);

    if (!email || !password) return;

    if (logInCredentialsValidation === undefined) return;

    if (!logInCredentialsValidation.success) {
      setLogInError(true);
      return;
    }

    router.replace("/tabs/home");

    // Alert.alert("Login successfully", "Welcome back!")
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
      <View className="flex gap-10">
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

        <View className="flex flex-row items-center px-4 justify-between bg-[#FAF7F0] rounded-3xl ">
          <TextInput
            className={`flex-1 text-base py-5 ml-2 ${
              errorFields.password ? "border border-red-500" : ""
            }`}
            placeholder="Password"
            placeholderTextColor={errorFields.password ? "#ef4444" : ""}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              clearFieldError("password");
            }}
          />
          <TouchableOpacity onPress={togglePassword}>
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={25}
              color="#000"
            />
          </TouchableOpacity>

          {errorFields.password && (
            <Text className="text-red-500 text-sm ml-2 ">
              Password is required
            </Text>
          )}
        </View>

        <View className="flex items-end">
          <Text>Forgot password?</Text>
        </View>

        <TouchableOpacity
          className="bg-[#36978C] flex items-center w-1/2 py-4 self-center rounded-[100px]"
          onPress={handleSignIn}
        >
          <Text className="text-2xl text-black font-medium">Log In</Text>
        </TouchableOpacity>
      </View>

      {/* Login Error Modal */}
      <Modal
        visible={logInError}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setLogInError(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-3xl p-8 mx-6 w-80 shadow-2xl">
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
            <TouchableOpacity
              className="bg-[#36978C] py-3 px-6 rounded-2xl mt-6"
              onPress={() => setLogInError(false)}
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
