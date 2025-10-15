import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import HistoryList from "../historyList";

export default function expensesHistory() {
  const selectedExpensesHistroy = [
    {
      _id: "eh_001",
      userCredentialsID: "u_123",
      expensesName: "Electric Bill",
      expensesCategory: "Bills",
      amount: 2500.0,
      datePaid: "2025-09-28",
      frequency: "Monthly",
    },
    {
      _id: "eh_002",
      userCredentialsID: "u_123",
      expensesName: "Internet Subscription",
      expensesCategory: "Bills",
      amount: 1500.0,
      datePaid: "2025-09-25",
      frequency: "Monthly",
    },
    {
      _id: "eh_003",
      userCredentialsID: "u_123",
      expensesName: "Groceries at SM",
      expensesCategory: "Grocery",
      amount: 4200.0,
      datePaid: "2025-09-20",
      frequency: "OneTime",
    },
    {
      _id: "eh_004",
      userCredentialsID: "u_123",
      expensesName: "Mobile Game Top-up",
      expensesCategory: "Game",
      amount: 800.0,
      datePaid: "2025-09-18",
      frequency: "OneTime",
    },
    {
      _id: "eh_005",
      userCredentialsID: "u_123",
      expensesName: "Health Insurance",
      expensesCategory: "Insurance",
      amount: 3500.0,
      datePaid: "2025-09-10",
      frequency: "Monthly",
    },
    {
      _id: "eh_006",
      userCredentialsID: "u_123",
      expensesName: "Taxi Rides",
      expensesCategory: "Other",
      amount: 600.0,
      datePaid: "2025-09-05",
      frequency: "OneTime",
    },
  ];

  const selectedData = selectedExpensesHistroy.map((items) => ({
    _id: items._id,
    name: items.expensesName,
    category: items.expensesCategory,
    amount: items.amount,
    date: items.datePaid
  })) 

  return (
    <HistoryList 
      data={selectedData}
      color="red"
      icon={require("../../../assets/images/add_expenses_icon.png")}
    />
  );
}
