import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";

// Import components
import Header from "./components/Header";
import DashboardSummary from "./components/DashboardSummary";
import NavigationCards from "./components/NavigationCards";
import OnboardingModal from "./components/OnboardingModal";
import { useAuthStore } from "./store/authStore";
import { useUserProfileStore } from "./store/userProfileStore";
import { LogOut } from "lucide-react-native";
import { useTranslation } from "react-i18next";

export default function MainDashboard() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const { user, logout } = useAuthStore();
  const userProfile = useUserProfileStore();

  // Simulate checking if user has completed onboarding
  useEffect(() => {
    // In a real app, this would check local storage or API
    const checkOnboardingStatus = () => {
      // Placeholder for actual implementation
      // setShowOnboarding(false); // Uncomment to hide onboarding
    };

    checkOnboardingStatus();
  }, []);

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    // Profile is already saved to storage via Zustand persist middleware
  };

  const handleMenuPress = () => {
    // Handle menu press - would open drawer/menu in a real app
    console.log("Menu pressed");
  };

  const handleNotificationPress = () => {
    // Handle notification press - would navigate to notifications in a real app
    console.log("Notifications pressed");
  };

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  const { t } = useTranslation();

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />

      <Header
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView className="flex-1 p-4">
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {t("home.home_hello")}, {user?.name || "User"}!
            </Text>
            <Text className="text-gray-600">
              {t("home.home_subtitle")}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-gray-200 p-2 rounded-full"
          >
            <LogOut size={20} color="#4B5563" />
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <DashboardSummary
            healthProfile={{
              conditions: userProfile.healthProfile.conditions,
              restrictions: userProfile.healthProfile.restrictions,
              router: userProfile.healthProfile.router
            }}
            mealPlanStatus={userProfile.mealPlanStatus}
            groceryListStatus={userProfile.groceryListStatus}
          />
        </View>

        <NavigationCards />
      </ScrollView>

      {showOnboarding && (
        <OnboardingModal
          isVisible={showOnboarding}
          onComplete={handleOnboardingComplete}
          onDismiss={() => setShowOnboarding(false)}
        />
      )}
    </SafeAreaView>
  );
}
