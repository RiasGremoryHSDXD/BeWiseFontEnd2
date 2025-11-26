import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

// 1. Define the User Shape
interface User {
  _id: string;
  username: string;
  email: string;
  profileImage?: string;
}

// 2. Define Context Shape
interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (user: User, token: string) => Promise<void>; // Adjusted to match implementation logic
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // 3. Load Data on Start Up
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        const storedToken = await AsyncStorage.getItem("authToken");

        if (storedUser && storedToken) {
          setUser(JSON.parse(storedUser));
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Failed to load auth data", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  // Global Login Function
  // FIXED: Changed parameter order to match typical (user, token) usage or updated interface
  // Let's standardize on: login(user, token)
  const login = async (userData: User, newToken: string) => {
    try {
      await AsyncStorage.setItem("authToken", newToken);
      await AsyncStorage.setItem("user", JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);

      router.replace("/tabs/home");
    } catch (error) {
      console.error("Login error", error);
    }
  };

  // Global Log out Function
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("authToken");
      await AsyncStorage.removeItem("user");

      setToken(null);
      setUser(null);

      router.replace("/");
    } catch (error) {
      console.error("Logout error", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};