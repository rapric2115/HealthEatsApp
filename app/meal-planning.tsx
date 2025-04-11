import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Calendar, Plus, Info, Edit2 } from "lucide-react-native";
import { useUserProfileStore } from "./store/userProfileStore";
import { geminiService } from "./services/geminiService";
import AIRecommendations from "./components/AIRecommendations";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

// Simplified initial state
const initialMealPlan = daysOfWeek.reduce((acc: Record<string, { breakfast: string[]; lunch: string[]; dinner: string[]; snacks: string[] }>, day) => {
  acc[day] = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };
  return acc;
}, {} as Record<string, { breakfast: string[]; lunch: string[]; dinner: string[]; snacks: string[] }>);

export default function MealPlanning() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(daysOfWeek[0]);
  const [mealPlan, setMealPlan] = useState(initialMealPlan);
  const [showHealthInfo, setShowHealthInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const userProfile = useUserProfileStore();

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setShowHealthInfo(null);
  };

  const toggleHealthInfo = (mealType: string) => {
    setShowHealthInfo(showHealthInfo === mealType ? null : mealType);
  };

  // Generate complete weekly meal plan
  const generateMealPlan = async () => {
    setIsGenerating(true);
    try {
      const conditions = userProfile.healthProfile.conditions;
      const restrictions = userProfile.healthProfile.restrictions;

      const weeklyMenu = await geminiService.getWeeklyMenu(
        conditions,
        restrictions
      );

      // Transform the WeeklyMenu[] into our state format
      const newMealPlan = weeklyMenu.reduce((acc: Record<string, { breakfast: string[]; lunch: string[]; dinner: string[]; snacks: string[]; }>, dayPlan) => {
        acc[dayPlan.day] = {
          breakfast: dayPlan.meals.breakfast,
          lunch: dayPlan.meals.lunch,
          dinner: dayPlan.meals.dinner,
          snacks: dayPlan.meals.snacks,
        };
        return acc;
      }, {});

      setMealPlan(newMealPlan);
      userProfile.updateMealPlanStatus({
        daysPlanned: 7,
        totalDays: 7,
      });
    } catch (error) {
      console.error("Failed to generate meal plan:", error);
      // You could show an alert to the user here
    } finally {
      setIsGenerating(false);
      setIsLoading(false);
    }
  };

  // Load initial meal plan
  useEffect(() => {
    const loadInitialPlan = async () => {
      await generateMealPlan();
    };
    loadInitialPlan();
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-100 justify-center items-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-4 text-gray-700">Loading your meal plan...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      <View className="px-4 py-2 bg-green-50 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Calendar size={20} color="#16a34a" />
          <Text className="ml-2 text-green-700 font-semibold">Weekly Plan</Text>
        </View>
        <TouchableOpacity
          onPress={generateMealPlan}
          className="flex-row items-center bg-green-600 px-3 py-1 rounded-full"
          disabled={isGenerating}
        >
          {isGenerating ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <>
              <Plus size={16} color="white" />
              <Text className="text-white ml-1 font-medium text-sm">
                New Plan
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Day selector */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white py-2"
        style={{flexGrow: 0}}
      >
        {daysOfWeek.map((day) => (
          <TouchableOpacity
            key={day}
            onPress={() => handleDaySelect(day)}
            className={`px-4 py-2 mx-1 rounded-xl min-w-[100px] items-center ${selectedDay === day ? "bg-green-600" : "bg-gray-200"}`}
          >
            <Text
              className={`font-medium ${selectedDay === day ? "text-white" : "text-gray-700"}`}
            >
              {day}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <AIRecommendations />

      {/* Meal list */}
      <ScrollView className="flex-1 bg-gray-100 p-4">
        {["breakfast", "lunch", "dinner", "snacks"].map((mealType) => {
          const meals = mealPlan[selectedDay]?.[mealType as "breakfast" | "lunch" | "dinner" | "snacks"] || [];
          
          return (
            <View key={mealType} className="bg-white rounded-xl p-4 mb-4 shadow-sm">
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-lg font-bold text-gray-800 capitalize">
                  {mealType}
                </Text>
                <TouchableOpacity onPress={() => router.push({
                  pathname: `/meal-edit`,
                  params: { day: selectedDay, mealType },
                })}>
                  <Edit2 size={18} color="#16a34a" />
                </TouchableOpacity>
              </View>

              {meals.length > 0 ? (
                <>
                  {meals.map((item: any, index: number) => (
                    <Text key={index} className="text-gray-800 mb-1">
                      • {item}
                    </Text>
                  ))}
                  
                  <TouchableOpacity
                    onPress={() => toggleHealthInfo(mealType)}
                    className="flex-row items-center mt-2"
                  >
                    <Info size={16} color="#16a34a" />
                    <Text className="ml-1 text-green-600 text-sm">
                      Health Benefits
                    </Text>
                  </TouchableOpacity>

                  {showHealthInfo === mealType && (
                    <View className="mt-2 bg-green-50 p-2 rounded-lg">
                      <Text className="text-sm text-gray-700">
                        {/* You would replace this with actual benefits from your data */}
                        This meal provides balanced nutrition tailored to your health profile.
                      </Text>
                    </View>
                  )}
                </>
              ) : (
                <Text className="text-gray-500">No items planned</Text>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}