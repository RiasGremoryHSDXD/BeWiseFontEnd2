import React, { useState } from "react";
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
import { dummyBudgetStatus,  dummyExpenses, dummyIncome, dummyBalance} from "../../../convex/functions/seedDummyData"

type Props = {
  onClose: () => void;
};

export default function BudgetAssistant({ onClose }: Props) {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = config.GOOGLE_API_KEY;
  const MODEL_NAME = config.MODEL_NAME;

  const callGemini = async () => {
    if (!prompt.trim()) return;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${GEMINI_API_KEY}`;

    const body = {
      contents: [
        {
          role: "user",
            parts: [
            {
                text: `${SYSTEM_PROMPT}
                Here is the user's financial data (for context):
                Budget Status: ${JSON.stringify(dummyBudgetStatus, null, 2)}
                Expenses: ${JSON.stringify(dummyExpenses, null, 2)}
                Income: ${JSON.stringify(dummyIncome, null, 2)}
                Balance: ${JSON.stringify(dummyBalance, null, 2)}

                User Question: ${prompt}`,
            },
]        },
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
    } catch (error) {
      console.error("Gemini API Error:", error);
      setResult("❌ Sorry, something went wrong. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className=" rounded-2xl w-[90%]">
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
        <Text className="text-base text-gray-800">{result}</Text>
      </ScrollView>

      {/* Close Button */}
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
