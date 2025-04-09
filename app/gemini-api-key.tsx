import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import Header from "./components/Header";
import { ExternalLink, Check, CreditCard } from "lucide-react-native";
import { useUserProfileStore } from "./store/userProfileStore";

const GeminiApiKey = () => {
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    "free" | "basic" | "premium"
  >("free");
  const router = useRouter();
  const { subscription, updateSubscription } = useUserProfileStore();

  useEffect(() => {
    // Load saved API key on component mount
    const loadApiKey = async () => {
      try {
        const savedApiKey = await AsyncStorage.getItem("geminiApiKey");
        if (savedApiKey) {
          setApiKey(savedApiKey);
        }
      } catch (error) {
        console.error("Error loading API key:", error);
      }
    };

    loadApiKey();
    setSelectedPlan(subscription.tier);
  }, [subscription.tier]);

  const saveApiKey = async () => {
    if (!apiKey.trim()) {
      Alert.alert("Error", "Please enter a valid API key");
      return;
    }

    setLoading(true);
    try {
      await AsyncStorage.setItem("geminiApiKey", apiKey.trim());
      Alert.alert("Success", "API key saved successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Error saving API key:", error);
      Alert.alert("Error", "Failed to save API key. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const openGeminiWebsite = () => {
    Linking.openURL("https://ai.google.dev/");
  };

  const handlePurchase = (plan: "free" | "basic" | "premium") => {
    setLoading(true);

    // Simulate payment processing
    setTimeout(() => {
      let newSubscription = {
        tier: plan,
        active: true,
        expiryDate:
          plan === "free"
            ? null
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        features: ["Basic health profile", "Meal suggestions"],
        aiCreditsRemaining: 0,
      };

      if (plan === "basic") {
        newSubscription.features.push("20 AI credits per month");
        newSubscription.aiCreditsRemaining = 20;
      } else if (plan === "premium") {
        newSubscription.features.push("Unlimited AI usage");
        newSubscription.features.push("Advanced meal planning");
        newSubscription.features.push("Personalized grocery lists");
        newSubscription.aiCreditsRemaining = 999;
      }

      updateSubscription(newSubscription);
      setSelectedPlan(plan);
      setLoading(false);

      Alert.alert(
        "Subscription Updated",
        `You are now subscribed to the ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan.`,
        [{ text: "OK" }],
      );
    }, 1500);
  };

  const renderPlanCard = (
    plan: "free" | "basic" | "premium",
    price: string,
    features: string[],
  ) => {
    const isSelected = selectedPlan === plan;
    const isPremium = plan === "premium";

    return (
      <TouchableOpacity
        onPress={() => setSelectedPlan(plan)}
        className={`mb-4 p-4 rounded-lg border-2 ${isSelected ? "border-green-600" : "border-gray-300"} ${isPremium ? "bg-green-50" : "bg-white"}`}
      >
        <View className="flex-row justify-between items-center mb-2">
          <Text
            className={`text-lg font-bold ${isPremium ? "text-green-700" : "text-gray-800"}`}
          >
            {plan.charAt(0).toUpperCase() + plan.slice(1)} Plan
          </Text>
          {isSelected && <Check size={20} color="#16a34a" />}
        </View>

        <Text className="text-xl font-bold mb-2">{price}</Text>

        {features.map((feature, index) => (
          <View key={index} className="flex-row items-center mb-1">
            <View className="w-2 h-2 rounded-full bg-green-500 mr-2" />
            <Text className="text-gray-700">{feature}</Text>
          </View>
        ))}

        <TouchableOpacity
          onPress={() => handlePurchase(plan)}
          disabled={loading || (isSelected && subscription.tier === plan)}
          className={`mt-3 py-2 rounded-md flex-row justify-center items-center ${isSelected && subscription.tier === plan ? "bg-gray-300" : isPremium ? "bg-green-600" : "bg-blue-500"}`}
        >
          <CreditCard size={16} color="white" style={{ marginRight: 8 }} />
          <Text className="text-white font-medium">
            {isSelected && subscription.tier === plan
              ? "Current Plan"
              : "Select Plan"}
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="AI Settings & Subscription" showBackButton={true} />

      <ScrollView className="flex-1 px-4 py-6">
        <Text className="text-2xl font-bold text-green-700 mb-2">
          NutriPlan AI Subscription
        </Text>

        <Text className="text-base text-gray-600 mb-6">
          Choose a subscription plan to unlock AI-powered nutrition
          recommendations
        </Text>

        <View className="mb-8">
          <Text className="text-lg font-semibold text-gray-800 mb-3">
            Current Plan:{" "}
            <Text className="text-green-600">
              {subscription.tier.charAt(0).toUpperCase() +
                subscription.tier.slice(1)}
            </Text>
          </Text>

          {subscription.tier !== "free" && (
            <View className="mb-4 bg-blue-50 p-3 rounded-lg">
              <Text className="text-gray-700">
                {subscription.tier === "premium"
                  ? "Unlimited AI usage"
                  : `AI Credits Remaining: ${subscription.aiCreditsRemaining}`}
              </Text>
              {subscription.expiryDate && (
                <Text className="text-gray-700 mt-1">
                  Expires:{" "}
                  {new Date(subscription.expiryDate).toLocaleDateString()}
                </Text>
              )}
            </View>
          )}

          {renderPlanCard("free", "Free", [
            "Basic health profile",
            "Limited meal suggestions",
            "5 AI credits to start",
          ])}

          {renderPlanCard("basic", "$4.99/month", [
            "Everything in Free plan",
            "20 AI credits per month",
            "Personalized meal recommendations",
          ])}

          {renderPlanCard("premium", "$9.99/month", [
            "Everything in Basic plan",
            "Unlimited AI usage",
            "Advanced meal planning",
            "Personalized grocery lists",
            "Priority support",
          ])}
        </View>

        <View className="h-px bg-gray-200 my-6" />

        <Text className="text-2xl font-bold text-green-700 mb-4">
          Set Your Gemini API Key
        </Text>

        <View className="bg-green-50 p-4 rounded-lg mb-6">
          <Text className="text-base text-gray-800 mb-4">
            To use the AI features in NutriPlan, you need to provide your own
            Gemini API key from Google.
          </Text>

          <Text className="text-base font-semibold text-gray-800 mb-2">
            How to get a Gemini API key:
          </Text>

          <View className="ml-2 mb-4">
            <Text className="text-base text-gray-700 mb-2">
              1. Visit the Google AI Studio website
            </Text>
            <Text className="text-base text-gray-700 mb-2">
              2. Sign in with your Google account
            </Text>
            <Text className="text-base text-gray-700 mb-2">
              3. Go to the API keys section
            </Text>
            <Text className="text-base text-gray-700 mb-2">
              4. Create a new API key
            </Text>
            <Text className="text-base text-gray-700 mb-2">
              5. Copy and paste the key below
            </Text>
          </View>

          <TouchableOpacity
            onPress={openGeminiWebsite}
            className="flex-row items-center justify-center bg-white p-3 rounded-md border border-green-500"
          >
            <Text className="text-green-600 font-semibold mr-2">
              Visit Google AI Studio
            </Text>
            <ExternalLink size={18} color="#16a34a" />
          </TouchableOpacity>
        </View>

        <Text className="text-base font-semibold text-gray-800 mb-2">
          Your Gemini API Key:
        </Text>
        <TextInput
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Enter your Gemini API key"
          className="border border-gray-300 rounded-md p-3 mb-4 bg-white"
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TouchableOpacity
          onPress={saveApiKey}
          disabled={loading}
          className={`py-3 px-4 rounded-md ${loading ? "bg-gray-400" : "bg-green-600"}`}
        >
          <Text className="text-white font-semibold text-center text-lg">
            {loading ? "Saving..." : "Save API Key"}
          </Text>
        </TouchableOpacity>

        <View className="mt-6 p-4 bg-yellow-50 rounded-lg">
          <Text className="text-sm text-gray-700">
            Note: Your API key is stored only on your device and is never sent
            to our servers. You are responsible for any usage charges from
            Google related to your API key.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default GeminiApiKey;
