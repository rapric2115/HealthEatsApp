import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView, StatusBar } from "react-native";
import { useRouter } from "expo-router";
import '../global.css';

// Import components
import Header from "./components/Header";
import DashboardSummary from "./components/DashboardSummary";
import NavigationCards from "./components/NavigationCards";
import OnboardingModal from "./components/OnboardingModal";

export default function MainDashboard() {
  const router = useRouter();
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [userProfile, setUserProfile] = useState({
    healthProfile: {
      conditions: ["High Cholesterol", "Type 2 Diabetes"],
      restrictions: ["No Gluten"],
      router: '/health-profile',
    },
    mealPlanStatus: {
      daysPlanned: 5,
      totalDays: 7,
      router: '/meal-planning'
    },
    groceryListStatus: {
      itemsChecked: 12,
      totalItems: 28,
      router: '/grocery-list'
    },
  });

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
    // In a real app, would save user profile to storage/API
  };

  const handleMenuPress = () => {
    // Handle menu press - would open drawer/menu in a real app
    console.log("Menu pressed");
  };

  const handleNotificationPress = () => {
    // Handle notification press - would navigate to notifications in a real app
    console.log("Notifications pressed");
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />

      <Header
        onMenuPress={handleMenuPress}
        onNotificationPress={handleNotificationPress}
      />

      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">Hello!</Text>
          <Text className="text-gray-600">
            Let's plan your healthy meals for the week
          </Text>
        </View>

        <View className="mb-6">
          <DashboardSummary
            healthProfile={userProfile.healthProfile}
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
