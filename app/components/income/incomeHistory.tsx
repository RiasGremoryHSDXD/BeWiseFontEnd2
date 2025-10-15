import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import HistoryList from "../historyList";

export default function incomeHistory() {
  const selecteIncomeHistory = [
    {
      _id: "ih_001",
      userCredentialsID: "u_123",
      incomeName: "Monthly Salary",
      incomeCategory: "Work",
      amount: 30000.0,
      expectedPayOut: "2025-10-01",
      frequency: "Monthly",
    },
    {
      _id: "ih_002",
      userCredentialsID: "u_123",
      incomeName: "Freelance Project",
      incomeCategory: "Side Hustle",
      amount: 5000.0,
      expectedPayOut: "2025-09-25",
      frequency: "OneTime",
    },
    {
      _id: "ih_003",
      userCredentialsID: "u_123",
      incomeName: "Stock Dividend",
      incomeCategory: "Investment",
      amount: 1200.0,
      expectedPayOut: "2025-09-15",
      frequency: "Monthly",
    },
    {
      _id: "ih_004",
      userCredentialsID: "u_123",
      incomeName: "Savings Interest",
      incomeCategory: "Savings",
      amount: 800.0,
      expectedPayOut: "2025-09-30",
      frequency: "Monthly",
    },
    {
      _id: "ih_005",
      userCredentialsID: "u_123",
      incomeName: "Gift Money",
      incomeCategory: "Other",
      amount: 2000.0,
      expectedPayOut: "2025-08-10",
      frequency: "OneTime",
    },
  ];

  const formattedIncomeHistory = selecteIncomeHistory.map((item) => ({
    _id: item._id,
    name: item.incomeName,
    category: item.incomeCategory,
    amount: item.amount,
    date: item.expectedPayOut,
  }));

  return (
    <HistoryList 
      data={formattedIncomeHistory}
      color="green"
      icon={require("../../../assets/images/add_income_icon.png")}
    />
  );
}
