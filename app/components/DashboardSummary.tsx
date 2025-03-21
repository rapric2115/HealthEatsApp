import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Heart,
  Utensils,
  ShoppingCart,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from 'expo-router';

interface DashboardSummaryProps {
  healthProfile?: {
    conditions: string[];
    restrictions: string[];
    router: string;
  };
  mealPlanStatus?: {
    daysPlanned: number;
    totalDays: number;
    router: string;
  };
  groceryListStatus?: {
    itemsChecked: number;
    totalItems: number;
    router: string;
  };
}

const DashboardSummary = ({
  healthProfile = {
    conditions: ["High Cholesterol", "Type 2 Diabetes"],
    restrictions: ["No Gluten"],
    router: '/health-profile',
  },
  mealPlanStatus = {
    daysPlanned: 5,
    totalDays: 7,
    router: '/meal-planning',
  },
  groceryListStatus = {
    itemsChecked: 12,
    totalItems: 28,
    router: '/grocery-list',
  },
}: DashboardSummaryProps) => {
  const router = useRouter();

  return (
    <View className="w-full bg-white p-4 rounded-lg shadow-sm">
      <Text className="text-xl font-bold mb-4 text-gray-800">
        Your Nutrition Summary
      </Text>

      {/* Health Profile Summary */}
      <TouchableOpacity className="flex-row items-center mb-3" onPress={() => router.push(healthProfile.router)}>
        <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-3">
          <Heart size={18} color="#ef4444" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-800">
            Health Profile
          </Text>
          <Text className="text-xs text-gray-500">
            {healthProfile.conditions.join(", ")}
            {healthProfile.restrictions.length > 0 &&
              ` • ${healthProfile.restrictions.join(", ")}`}
          </Text>
        </View>
        <ChevronRight size={16} color="#9ca3af" />
      </TouchableOpacity>

      {/* Meal Plan Status */}
      <TouchableOpacity className="flex-row items-center mb-3" onPress={() => router.push(mealPlanStatus.router)}>
        <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
          <Utensils size={18} color="#10b981" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-800">Meal Plan</Text>
          <Text className="text-xs text-gray-500">
            {mealPlanStatus.daysPlanned} of {mealPlanStatus.totalDays} days
            planned
          </Text>
        </View>
        <ChevronRight size={16} color="#9ca3af" />
      </TouchableOpacity>

      {/* Grocery List Status */}
      <TouchableOpacity className="flex-row items-center" onPress={() => router.push(groceryListStatus.router)}>
        <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
          <ShoppingCart size={18} color="#3b82f6" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-800">
            Grocery List
          </Text>
          <Text className="text-xs text-gray-500">
            {groceryListStatus.itemsChecked} of {groceryListStatus.totalItems}{" "}
            items checked
          </Text>
        </View>
        <ChevronRight size={16} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardSummary;
