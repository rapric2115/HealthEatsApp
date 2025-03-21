import React, { useState, StrictMode } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { Calendar, Plus, Info, Edit2 } from "lucide-react-native";

import Header from "./components/Header";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const initialMealPlan = {
  Monday: {
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
  },
  Tuesday: {
    breakfast: {
      title: "Greek Yogurt Parfait",
      description: "Greek yogurt with granola, nuts, and fresh fruit",
      healthBenefits: [
        "Probiotics for gut health",
        "High in protein",
        "Low in added sugars",
      ],
    },
    lunch: {
      title: "Lentil Soup",
      description: "Hearty lentil soup with vegetables and whole grain bread",
      healthBenefits: [
        "Plant-based protein",
        "Lowers cholesterol",
        "Rich in iron",
      ],
    },
    dinner: {
      title: "Turkey Stir-Fry",
      description:
        "Lean turkey stir-fried with mixed vegetables and brown rice",
      healthBenefits: [
        "Lean protein",
        "Low in saturated fat",
        "High in vitamins",
      ],
    },
  },
  Wednesday: {
    breakfast: {
      title: "Avocado Toast",
      description: "Whole grain toast with avocado, tomato, and poached egg",
      healthBenefits: ["Healthy fats", "Fiber-rich", "Balanced protein"],
    },
    lunch: {
      title: "Chicken & Vegetable Wrap",
      description: "Grilled chicken with vegetables in a whole grain wrap",
      healthBenefits: ["Lean protein", "Complex carbohydrates", "Low sodium"],
    },
    dinner: {
      title: "Bean Chili",
      description: "Vegetarian bean chili with mixed beans and vegetables",
      healthBenefits: [
        "Plant-based protein",
        "High in fiber",
        "Supports heart health",
      ],
    },
  },
  Thursday: {
    breakfast: {
      title: "Smoothie Bowl",
      description: "Berry smoothie bowl topped with nuts, seeds, and granola",
      healthBenefits: [
        "Antioxidants",
        "Healthy fats from nuts",
        "Natural energy",
      ],
    },
    lunch: {
      title: "Tuna Salad",
      description:
        "Tuna mixed with light mayo, celery, and whole grain crackers",
      healthBenefits: [
        "Omega-3 fatty acids",
        "Low in saturated fat",
        "Good protein source",
      ],
    },
    dinner: {
      title: "Vegetable Stir-Fry",
      description: "Tofu and vegetable stir-fry with brown rice",
      healthBenefits: [
        "Plant-based protein",
        "Low glycemic index",
        "High in fiber",
      ],
    },
  },
  Friday: {
    breakfast: {
      title: "Whole Grain Cereal",
      description: "High-fiber cereal with almond milk and sliced banana",
      healthBenefits: ["Whole grains", "Low in added sugar", "Heart-healthy"],
    },
    lunch: {
      title: "Vegetable Soup",
      description: "Homemade vegetable soup with whole grain roll",
      healthBenefits: ["Low calorie", "High in vitamins", "Hydrating"],
    },
    dinner: {
      title: "Grilled Chicken",
      description:
        "Herb-marinated grilled chicken with quinoa and steamed broccoli",
      healthBenefits: [
        "Lean protein",
        "Complex carbohydrates",
        "Cruciferous vegetables",
      ],
    },
  },
  Saturday: {
    breakfast: {
      title: "Veggie Omelette",
      description: "Egg white omelette with spinach, tomatoes, and feta cheese",
      healthBenefits: [
        "Low cholesterol",
        "High protein",
        "Nutrient-dense vegetables",
      ],
    },
    lunch: {
      title: "Quinoa Bowl",
      description: "Quinoa bowl with roasted vegetables and chickpeas",
      healthBenefits: ["Complete protein", "High in fiber", "Rich in minerals"],
    },
    dinner: {
      title: "Baked Cod",
      description: "Lemon herb baked cod with sweet potato and green beans",
      healthBenefits: [
        "Lean white fish",
        "Low in saturated fat",
        "Rich in potassium",
      ],
    },
  },
  Sunday: {
    breakfast: {
      title: "Whole Grain Pancakes",
      description:
        "Whole grain pancakes with fresh fruit and a touch of maple syrup",
      healthBenefits: [
        "Whole grains",
        "Natural sweetness from fruit",
        "Balanced treat",
      ],
    },
    lunch: {
      title: "Grilled Vegetable Sandwich",
      description: "Grilled vegetables with hummus on whole grain bread",
      healthBenefits: ["Plant-based", "Heart-healthy", "High in fiber"],
    },
    dinner: {
      title: "Turkey Meatballs",
      description: "Turkey meatballs with whole wheat pasta and tomato sauce",
      healthBenefits: [
        "Lean protein",
        "Lycopene from tomatoes",
        "Complex carbohydrates",
      ],
    },
  },
};

export default function MealPlanning() {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [mealPlan, setMealPlan] = useState(initialMealPlan);
  const [showHealthInfo, setShowHealthInfo] = useState(null);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
    setShowHealthInfo(null);
  };

  const toggleHealthInfo = (mealType) => {
    if (showHealthInfo === mealType) {
      setShowHealthInfo(null);
    } else {
      setShowHealthInfo(mealType);
    }
  };

  const handleGenerateNewPlan = () => {
    // In a real app, this would call an API to generate a new plan based on health profile
    console.log("Generating new meal plan");
  };

  const handleEditMeal = (day, mealType) => {
    // In a real app, this would navigate to a meal editing screen
    console.log(`Editing ${mealType} for ${day}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />

      {/* <Header title="Meal Planning" showBackButton={true} /> */}

      <View className="px-4 py-2 bg-green-50 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Calendar size={20} color="#16a34a" />
          <Text className="ml-2 text-green-700 font-semibold">Weekly Plan</Text>
        </View>
        <TouchableOpacity
          onPress={handleGenerateNewPlan}
          className="flex-row items-center bg-green-600 px-3 py-1 rounded-full"
        >
          <Plus size={16} color="white" />
          <Text className="text-white ml-1 font-medium text-sm">New Plan</Text>
        </TouchableOpacity>
      </View>

      <StrictMode>
        <ScrollView
          horizontal = {true}
          showsHorizontalScrollIndicator={false}
          className="bg-white py-2 flex-row"
          style={{ flexGrow: 0 }}
        >
          {daysOfWeek.map((day) => (
            <TouchableOpacity
              key={day}
              onPress={() => handleDaySelect(day)}
              className={`px-4 py-2 mx-1 rounded-xl w-[110px] h-[40px] justify-center items-center ${selectedDay === day ? "bg-green-600" : "bg-gray-200"}`}
            >
              <Text
                className={`font-medium ${selectedDay === day ? "text-white" : "text-gray-700"}`}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </StrictMode>

      <ScrollView className="flex-1 bg-gray-100 p-4">
        {["breakfast", "lunch", "dinner"].map((mealType) => (
          <View
            key={mealType}
            className="bg-white rounded-xl p-4 mb-4 shadow-sm"
          >
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-bold text-gray-800 capitalize">
                {mealType}
              </Text>
              <TouchableOpacity
                onPress={() => handleEditMeal(selectedDay, mealType)}
              >
                <Edit2 size={18} color="#16a34a" />
              </TouchableOpacity>
            </View>

            <Text className="text-base font-semibold text-gray-800">
              {mealPlan[selectedDay][mealType].title}
            </Text>
            <Text className="text-sm text-gray-600 mb-2">
              {mealPlan[selectedDay][mealType].description}
            </Text>

            <View className="flex-row justify-between items-center mt-1">
              <TouchableOpacity
                onPress={() => toggleHealthInfo(mealType)}
                className="flex-row items-center"
              >
                <Info size={16} color="#16a34a" />
                <Text className="ml-1 text-green-600 text-sm">
                  Health Benefits
                </Text>
              </TouchableOpacity>
            </View>

            {showHealthInfo === mealType && (
              <View className="mt-2 bg-green-50 p-2 rounded-lg">
                {mealPlan[selectedDay][mealType].healthBenefits.map(
                  (benefit, index) => (
                    <Text key={index} className="text-sm text-gray-700 ml-2">
                      • {benefit}
                    </Text>
                  ),
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
