import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { Sparkles, RefreshCw } from "lucide-react-native";
import { geminiService } from "../services/geminiService";
import { useUserProfileStore } from "../store/userProfileStore";

interface MealSuggestionProps {
  mealType: "breakfast" | "lunch" | "dinner";
  day: string;
  onSelect?: (suggestion: string) => void;
}

export default function MealSuggestion({
  mealType,
  day,
  onSelect,
}: MealSuggestionProps) {
  const [suggestion, setSuggestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const userProfile = useUserProfileStore();

  useEffect(() => {
    generateSuggestion();
  }, []);

  const generateSuggestion = async () => {
    setLoading(true);
    setError(null);
    try {
      // In a real implementation, we would call Gemini API to get a meal suggestion
      // based on the user's health profile, the day, and meal type
      const conditions = userProfile.healthProfile.conditions;
      const restrictions = userProfile.healthProfile.restrictions;

      // For demo purposes, we'll use a mock response
      setTimeout(() => {
        const suggestions = {
          breakfast: [
            "Overnight oats with berries and nuts",
            "Greek yogurt parfait with granola",
            "Avocado toast with poached egg",
            "Spinach and mushroom omelette",
            "Whole grain pancakes with fruit",
          ],
          lunch: [
            "Mediterranean quinoa bowl",
            "Grilled chicken salad with avocado",
            "Lentil soup with whole grain bread",
            "Turkey and vegetable wrap",
            "Salmon poke bowl with brown rice",
          ],
          dinner: [
            "Baked salmon with roasted vegetables",
            "Lean turkey chili with beans",
            "Stir-fried tofu with vegetables",
            "Grilled chicken with sweet potato",
            "Vegetable and bean curry with brown rice",
          ],
        };

        const options = suggestions[mealType] || [];
        const randomIndex = Math.floor(Math.random() * options.length);
        setSuggestion(options[randomIndex]);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError("Failed to generate suggestion");
      console.error(err);
      setLoading(false);
    }
  };

  const handleSelect = () => {
    if (onSelect && suggestion) {
      onSelect(suggestion);
    }
  };

  if (loading) {
    return (
      <View className="bg-green-50 p-3 rounded-lg flex-row items-center justify-center">
        <ActivityIndicator size="small" color="#16a34a" />
        <Text className="ml-2 text-green-700">Generating suggestion...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-red-50 p-3 rounded-lg">
        <Text className="text-red-600">{error}</Text>
        <TouchableOpacity
          onPress={generateSuggestion}
          className="mt-2 flex-row items-center"
        >
          <RefreshCw size={16} color="#16a34a" />
          <Text className="ml-1 text-green-600">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-green-50 p-3 rounded-lg">
      <View className="flex-row items-center mb-2">
        <Sparkles size={16} color="#16a34a" />
        <Text className="ml-1 text-green-700 font-medium">AI Suggestion</Text>
      </View>
      <Text className="text-gray-700 mb-2">{suggestion}</Text>
      <View className="flex-row justify-between">
        <TouchableOpacity
          onPress={handleSelect}
          className="bg-green-600 py-1 px-3 rounded-lg"
        >
          <Text className="text-white font-medium">Select</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={generateSuggestion}
          className="flex-row items-center"
        >
          <RefreshCw size={16} color="#16a34a" />
          <Text className="ml-1 text-green-600">Refresh</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
