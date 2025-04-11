import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import {
  Heart,
  Utensils,
  ShoppingCart,
  ChevronRight,
} from "lucide-react-native";
import { useRouter } from 'expo-router';
import { useUserProfileStore } from '../store/userProfileStore';
import { useTotalGroceryListStore } from "../store/totalStore";

import { useTranslation } from 'react-i18next';

interface DashboardSummaryProps {
  healthProfile?: {
    conditions: string[];
    restrictions: string[];
  };
  mealPlanStatus?: {
    daysPlanned: number;
    totalDays: number;
  };
  groceryListStatus?: {
    itemsChecked: number;
    totalItems: number;
  };
}

const DashboardSummary = ({
  healthProfile = {
    conditions: ["High Cholesterol", "Type 2 Diabetes"],
    restrictions: ["No Gluten"],
  },
  mealPlanStatus = {
    daysPlanned: 5,
    totalDays: 7,
  },
  groceryListStatus = {
    itemsChecked: 12,
    totalItems: 28,
  },
}: DashboardSummaryProps) => {
  const router = useRouter();
  const userProfile = useUserProfileStore();
  const {total, checkedItems} = useTotalGroceryListStore();
  const { t, i18n } = useTranslation();


  return (
    <View className="w-full bg-white p-4 rounded-lg shadow-sm">
      <Text className="text-xl font-bold mb-4 text-gray-800">
        {t("dashboardSum.title")}
      </Text>

      {/* Health Profile Summary */}
      <TouchableOpacity className="flex-row items-center mb-3" onPress={() => router.push("/health-profile")}>
        <View className="w-8 h-8 bg-red-100 rounded-full items-center justify-center mr-3">
          <Heart size={18} color="#ef4444" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-800">
            {t("dashboardSum.health_profile")}
          </Text>
          <Text className="text-xs text-gray-500">
            {userProfile.healthProfile.conditions.join(", ")}
            {userProfile.healthProfile.restrictions.length > 0 &&
              ` • ${userProfile.healthProfile.restrictions.join(", ")}`}
          </Text>
        </View>
        <ChevronRight size={16} color="#9ca3af" />
      </TouchableOpacity>

      {/* Meal Plan Status */}
      <TouchableOpacity className="flex-row items-center mb-3" onPress={() => router.push("/meal-planning")}>
        <View className="w-8 h-8 bg-green-100 rounded-full items-center justify-center mr-3">
          <Utensils size={18} color="#10b981" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-800">{t("dashboardSum.meal_plan")}</Text>
          <Text className="text-xs text-gray-500">
            {mealPlanStatus.daysPlanned} of {mealPlanStatus.totalDays} {t("dashboardSum.days_plan")}
          </Text>
        </View>
        <ChevronRight size={16} color="#9ca3af" />
      </TouchableOpacity>

      {/* Grocery List Status */}
      <TouchableOpacity className="flex-row items-center" onPress={() => router.push("/grocery-list")}>
        <View className="w-8 h-8 bg-blue-100 rounded-full items-center justify-center mr-3">
          <ShoppingCart size={18} color="#3b82f6" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-medium text-gray-800">
            {t("dashboardSum.grocery_list")}
          </Text>
          <Text className="text-xs text-gray-500">
            {checkedItems} of {total}{" "}
            {t("dashboardSum.item_checked")}
          </Text>
        </View>
        <ChevronRight size={16} color="#9ca3af" />
      </TouchableOpacity>
    </View>
  );
};

export default DashboardSummary;
