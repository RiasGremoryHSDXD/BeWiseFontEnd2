import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import config from "../../../api/config";
import { SYSTEM_PROMPT } from "../../../api/aiRules";
import api from "../../../api/api"; // Import your configured axios instance

// --- 1. Define Interface for Financial Data ---
// This matches the structure sent by your aiController.js
type FinancialData = {
  userProfile: {
    username: string;
    email: string;
  };
  summary: {
    totalMonthlyIncome: number;
    totalMonthlyExpenses: number;
    estimatedSavings: number;
    status: string;
  };
  budgetPlan: {
    expenses: any[];
    income: any[];
  };
  recentHistory: {
    expenses: any[];
    income: any[];
  };
};

type Props = {
  onClose: () => void;
};

export default function BudgetAssistant({ onClose }: Props) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  
  // State for fetching context
  const [loadingContext, setLoadingContext] = useState(true);
  const [financialContext, setFinancialContext] = useState<FinancialData | null>(null);

  const GEMINI_API_KEY = config.GOOGLE_API_KEY;
  const MODEL_NAME = config.MODEL_NAME;

  // --- 2. Fetch Real Financial Data on Mount ---
  useEffect(() => {
    const fetchContext = async () => {
      try {
        setLoadingContext(true);
        // This calls your new backend endpoint: GET /api/ai/context
        const response = await api.get("/ai/context");
        
        if (response.status === 200) {
          setFinancialContext(response.data);
        }
      } catch (error) {
        console.error("Failed to load financial context:", error);
        setResult("⚠️ Warning: I couldn't load your financial data. I can only answer general questions.");
      } finally {
        setLoadingContext(false);
      }
    };

    fetchContext();
  }, []);

  // --- 3. Call Gemini API ---
  const callGemini = async () => {
    if (!prompt.trim()) return;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    // Construct prompt with the REAL context data
    const finalPrompt = `
      ${SYSTEM_PROMPT}
      
      CONTEXT:
      Here is the user's current financial data (JSON format):
      ${financialContext ? JSON.stringify(financialContext, null, 2) : "No financial data available."}

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
      setLoadingResponse(true);

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
      setLoadingResponse(false);
    }
  };

  return (
    <View className="rounded-2xl w-[90%]">
      <Text className="text-2xl font-bold text-[#1E4E45] text-center mb-2">
        Budget Assistant
      </Text>
      
      {/* Show loading state while fetching context */}
      {loadingContext ? (
         <View className="py-4">
             <ActivityIndicator size="small" color="#36978C" />
             <Text className="text-center text-gray-500 text-xs mt-2">Loading your financial data...</Text>
         </View>
      ) : (
        <Text className="text-sm text-gray-700 text-center mb-5">
           Hi {financialContext?.userProfile?.username || "there"}! I've analyzed your budget. Ask me anything!
        </Text>
      )}

      <TextInput
        className="border border-gray-400 rounded-xl bg-white p-3 h-24 mb-3 text-base"
        placeholder={loadingContext ? "Please wait..." : "Type your question here..."}
        value={prompt}
        onChangeText={setPrompt}
        multiline
        editable={!loadingContext} // Disable input until context loads
      />

      <TouchableOpacity
        onPress={callGemini}
        disabled={loadingResponse || loadingContext}
        className={`w-full py-3 rounded-xl ${
          (loadingResponse || loadingContext) ? "bg-gray-400" : "bg-[#36978C]"
        }`}
      >
        <Text className="text-center text-white font-semibold text-base">
          {loadingResponse ? "Thinking..." : "Ask BudgetBot"}
        </Text>
      </TouchableOpacity>

      {loadingResponse && <ActivityIndicator size="large" className="mt-4" />}

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