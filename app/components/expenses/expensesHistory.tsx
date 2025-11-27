import React, { useEffect, useState } from "react";
import HistoryList from "../historyList";
import api from "../../../api/api";

// 1. UPDATE INTERFACE: Match the ExpensesHistory Backend Model exactly
interface ExpensesHistoryItem {
  _id: string;
  userId: string;
  expensesName: string; // Note: Expenses model uses 'expensesName'
  expensesCategory: "Insurance" | "Bills" | "Game" | "Grocery" | "Other";
  amount: number;
  datePaid: string;     // Note: Expenses model uses 'datePaid'
  frequency: string;
}

export default function ExpensesHistoryScreen() {
  // 2. STATE: Initialize as an empty array of ExpensesHistoryItem
  const [historyData, setHistoryData] = useState<ExpensesHistoryItem[]>([]);

  useEffect(() => {
    const fetchExpensesHistory = async () => {
      try {
        const response = await api.get("/history/readExpensesHistory");

        if (response.status === 200) {
          setHistoryData(response.data.history);
        }
      } catch (error) {
        console.error("Failed to fetch expenses history", error);
      }
    };

    fetchExpensesHistory();
  }, []);

  // 5. MAPPING: Transform backend data to match HistoryList props
  const formattedExpensesHistory = historyData.map((item) => ({
    _id: item._id,
    name: item.expensesName,      
    category: item.expensesCategory,
    amount: item.amount,
    date: item.datePaid.split("T")[0], // Format ISO string to YYYY-MM-DD
  }));

  return (
    <HistoryList
      data={formattedExpensesHistory}
      color="red"
      icon={require("../../../assets/images/add_expenses_icon.png")}
    />
  );
}