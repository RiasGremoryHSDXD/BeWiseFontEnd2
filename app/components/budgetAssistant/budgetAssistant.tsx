import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import config from "../../../api/config";
import { SYSTEM_PROMPT } from "../../../api/aiRules";

// --- 1. Define Interface for Financial Data ---
type FinancialData = {
  budgetStatus: any[];
  expenses: any[];
  income: any[];
  balance: any[];
};

type Props = {
  onClose: () => void;
  financialContext?: FinancialData; // Optional: Pass real data here later
};

// --- 2. Local Dummy Data (Replaces Convex Import) ---
const dummyBudgetStatus = [
  {
    userCredentials: "user_001",
    budgetStatusName: "Monthly Budget - October",
    currentAmount: 15000,
    totalAmount: 20000,
  },
  {
    userCredentials: "user_002",
    budgetStatusName: "Student Budget - October",
    currentAmount: 3000,
    totalAmount: 5000,
  },
];

const dummyExpenses = [
  {
    userCredentialsID: "user_001",
    expensesName: "Meralco Bill",
    expensesCategory: "Bills",
    amount: 1200,
    datePaid: "2025-10-05",
    frequency: "Monthly",
  },
  {
    userCredentialsID: "user_001",
    expensesName: "Groceries - Puregold",
    expensesCategory: "Grocery",
    amount: 3500,
    datePaid: "2025-10-07",
    frequency: "Weekly",
  },
  {
    userCredentialsID: "user_002",
    expensesName: "Steam Game Purchase",
    expensesCategory: "Game",
    amount: 600,
    datePaid: "2025-10-09",
    frequency: "OneTime",
  },
];

const dummyIncome = [
  {
    userCredentialsID: "user_001",
    incomeName: "Monthly Salary",
    incomeCategory: "Work",
    amount: 25000,
    expectedPayOut: "2025-10-15",
    frequency: "Monthly",
  },
  {
    userCredentialsID: "user_002",
    incomeName: "Freelance Art Commission",
    incomeCategory: "Side Hustle",
    amount: 1200,
    expectedPayOut: "2025-10-10",
    frequency: "OneTime",
  },
];

const dummyBalance = [
  {
    userCredentialsID: "user_001",
    currentBalance: 18000,
    lastUpdate: "2025-10-13",
  },
  {
    userCredentialsID: "user_002",
    currentBalance: 2900,
    lastUpdate: "2025-10-13",
  },
];

// -------------------------------------------------

export default function BudgetAssistant({ onClose, financialContext }: Props) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = config.GOOGLE_API_KEY;
  const MODEL_NAME = config.MODEL_NAME;

  // Use passed data or fallback to local dummy data
  const context = financialContext || {
    budgetStatus: dummyBudgetStatus,
    expenses: dummyExpenses,
    income: dummyIncome,
    balance: dummyBalance,
  };

  const callGemini = async () => {
    if (!prompt.trim()) return;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    // Construct prompt with the context data
    const finalPrompt = `
      ${SYSTEM_PROMPT}
      
      CONTEXT:
      Here is the user's current financial data:
      - Budget Status: ${JSON.stringify(context.budgetStatus, null, 2)}
      - Expenses: ${JSON.stringify(context.expenses, null, 2)}
      - Income: ${JSON.stringify(context.income, null, 2)}
      - Balance: ${JSON.stringify(context.balance, null, 2)}

      USER QUESTION: "${prompt}"
    `;

    const body = {
      contents: [
        {
          role: "user",
          parts: [{ text: finalPrompt }],
        },
      ],
    };

    try {
      setLoading(true);

      const res = await axios.post(url, body, {
        headers: { "Content-Type": "application/json" },
      });

      const text =
        res.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "⚠️ No response text found.";

      setResult(text);
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      if (error.response?.status === 429) {
        setResult("⏳ Quota exceeded. Please try again later.");
      } else {
        setResult("❌ Sorry, something went wrong. Check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="rounded-2xl w-[90%]">
      <Text className="text-2xl font-bold text-[#1E4E45] text-center mb-2">
        Budget Assistant
      </Text>
      <Text className="text-sm text-gray-700 text-center mb-5">
        Ask me anything about budgeting or saving money!
      </Text>

      <TextInput
        className="border border-gray-400 rounded-xl bg-white p-3 h-24 mb-3 text-base"
        placeholder="Type your question here..."
        value={prompt}
        onChangeText={setPrompt}
        multiline
      />

      <TouchableOpacity
        onPress={callGemini}
        disabled={loading}
        className={`w-full py-3 rounded-xl ${
          loading ? "bg-gray-400" : "bg-[#36978C]"
        }`}
      >
        <Text className="text-center text-white font-semibold text-base">
          {loading ? "Thinking..." : "Ask BudgetBot"}
        </Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" className="mt-4" />}

      <ScrollView className="mt-4 bg-white rounded-xl p-3 max-h-60">
        <Text className="text-base text-gray-800">
          {result || "Result will appear here..."}
        </Text>
      </ScrollView>

      <TouchableOpacity
        onPress={onClose}
        className="mt-6 w-full py-3 bg-red-500/90 rounded-xl shadow-sm active:bg-red-600"
      >
        <Text className="text-center text-white font-semibold text-base">
          ✕ Close Assistant
        </Text>
      </TouchableOpacity>
    </View>
  );
}