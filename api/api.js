import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// It will crash the app on startup with a clear message.
if (!API_URL) {
  throw new Error(
    "FATAL ERROR: EXPO_PUBLIC_API_URL is not defined. Please create a .env file and restart the server."
  );
}

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);
console.log("EXPO_PUBLIC_API_URL =", process.env.EXPO_PUBLIC_API_URL);

export default api;
