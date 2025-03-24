import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Save, ArrowLeft } from "lucide-react-native";

import Header from "./components/Header";
import MealSuggestion from "./components/MealSuggestion";
import { useUserProfileStore } from "./store/userProfileStore";

export default function MealEdit() {
  const router = useRouter();
  const { day, mealType } = useLocalSearchParams<{
    day: string;
    mealType: "breakfast" | "lunch" | "dinner";
  }>();
  const userProfile = useUserProfileStore();

  const [mealData, setMealData] = useState({
    title: "",
    description: "",
    healthBenefits: ["", "", ""],
  });

  // In a real app, we would fetch the current meal data
  useEffect(() => {
    // Mock data for demonstration
    const mockMealData = {
      breakfast: {
        title: "Oatmeal with Berries",
        description: "Steel-cut oats with mixed berries and a drizzle of honey",
        healthBenefits: [
          "Lowers cholesterol",
          "Stabilizes blood sugar",
          "High in fiber",
        ],
      },
      lunch: {
        title: "Mediterranean Salad",
        description:
          "Quinoa, chickpeas, cucumber, tomatoes, feta, and olive oil dressing",
        healthBenefits: [
          "Heart-healthy fats",
          "Low glycemic index",
          "Rich in protein",
        ],
      },
      dinner: {
        title: "Baked Salmon",
        description: "Baked salmon with roasted vegetables and brown rice",
        healthBenefits: [
          "Omega-3 fatty acids",
          "Anti-inflammatory",
          "Complete protein",
        ],
      },
    };

    if (mealType && mockMealData.hasOwnProperty(mealType)) {
      setMealData(mockMealData[mealType]);
    }
  }, [mealType]);

  const handleSave = () => {
    // In a real app, we would save the meal data to the store or backend
    console.log("Saving meal data:", mealData);
    console.log(`For ${day}, ${mealType}`);

    // Navigate back to meal planning
    router.back();
  };

  const handleSuggestionSelect = (suggestion: string) => {
    setMealData({
      ...mealData,
      title: suggestion,
    });
  };

  const updateHealthBenefit = (index: number, value: string) => {
    const updatedBenefits = [...mealData.healthBenefits];
    updatedBenefits[index] = value;
    setMealData({
      ...mealData,
      healthBenefits: updatedBenefits,
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      <Header
        title={`Edit ${mealType?.charAt(0).toUpperCase()}${mealType?.slice(1)} for ${day}`}
        showBackButton={true}
      />

      <ScrollView className="flex-1 p-4">
        <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
          <Text className="text-lg font-bold text-gray-800 mb-2">
            Meal Title
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={mealData.title}
            onChangeText={(text) => setMealData({ ...mealData, title: text })}
            placeholder="Enter meal title"
          />

          <Text className="text-lg font-bold text-gray-800 mb-2">
            Description
          </Text>
          <TextInput
            className="border border-gray-300 rounded-lg p-2 mb-4"
            value={mealData.description}
            onChangeText={(text) =>
              setMealData({ ...mealData, description: text })
            }
            placeholder="Enter meal description"
            multiline
            numberOfLines={3}
          />

          <Text className="text-lg font-bold text-gray-800 mb-2">
            Health Benefits
          </Text>
          {mealData.healthBenefits.map((benefit, index) => (
            <TextInput
              key={index}
              className="border border-gray-300 rounded-lg p-2 mb-2"
              value={benefit}
              onChangeText={(text) => updateHealthBenefit(index, text)}
              placeholder={`Health benefit ${index + 1}`}
            />
          ))}
        </View>

        <Text className="text-lg font-bold text-gray-800 mb-2">
          AI Suggestions
        </Text>
        <MealSuggestion
          mealType={mealType || "breakfast"}
          day={day || "Monday"}
          onSelect={handleSuggestionSelect}
        />

        <TouchableOpacity
          onPress={handleSave}
          className="bg-green-600 py-3 rounded-lg items-center mt-4 mb-8"
        >
          <Text className="text-white font-bold">Save Changes</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
