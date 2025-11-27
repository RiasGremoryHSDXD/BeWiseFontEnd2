import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Define the User interface based on your backend response
interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

const useAsyncStorageData = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem("user");
        if (jsonValue != null) {
          setUser(JSON.parse(jsonValue));
        } else {
          setUser(null);
        }
      } catch (e) {
        console.error("Error reading user data from AsyncStorage:", e);
        setUser(null);
      }
    };

    fetchUserData();
  }, []);

  return user;
};

export default useAsyncStorageData;