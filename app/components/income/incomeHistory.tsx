import React, { useEffect, useState } from "react";
import HistoryList from "../historyList";
import api from "../../../api/api";

// 1. UPDATE INTERFACE: Match the Backend Model exactly
interface IncomeHistoryItem {
  _id: string;
  userId: string;
  incomeName: string;
  incomeCategory: "Work" | "Investment" | "Savings" | "Side Hustle" | "Other";
  amount: number;
  paidDate: string; 
  frequency: string;
}

export default function IncomeHistoryScreen() {
  // 2. FIX STATE: Define as an Array [] and initialize as empty []
  const [historyData, setHistoryData] = useState<IncomeHistoryItem[]>([]);

  useEffect(() => {
    const fetchIncomeHistory = async () => {
      try {
        // Ensure this route matches your backend route exactly
        const response = await api.get("/history/readIncomeHistory"); 
        
        if (response.status === 200) {
          // 3. DATA MAPPING: Ensure 'response.data.history' matches your Controller's return key
          setHistoryData(response.data.history); 
        }
      } catch (error) {
        console.error("Failed to fetch income history", error);
      }
    };

    fetchIncomeHistory();
  }, []);

  // 4. MAPPING: Now .map() works because historyData is guaranteed to be an array
  const formattedIncomeHistory = historyData.map((item) => ({
    _id: item._id,
    name: item.incomeName,
    category: item.incomeCategory,
    amount: item.amount,
    date: item.paidDate.split("T")[0] , // Updated to match interface
  }));

  return (
    <HistoryList
      data={formattedIncomeHistory}
      color="green"
      icon={require("../../../assets/images/add_income_icon.png")}
    />
  );
}