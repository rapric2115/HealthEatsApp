import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Sparkles, ChevronDown, ChevronUp } from "lucide-react-native";
import type { NutritionRecommendation } from "../services/geminiService";
import { geminiService } from "../services/geminiService";
import { useUserProfileStore } from "../store/userProfileStore";

interface AIRecommendationsProps {
  healthConditions?: string[];
  dietaryRestrictions?: string[];
}

export default function AIRecommendations({
  healthConditions,
  dietaryRestrictions,
}: AIRecommendationsProps) {
  const userProfile = useUserProfileStore();
  const [recommendations, setRecommendations] = useState<
    NutritionRecommendation[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    try {
      // Use provided props or fall back to user profile data
      const conditions =
        healthConditions || userProfile.healthProfile.conditions;
      const restrictions =
        dietaryRestrictions || userProfile.healthProfile.restrictions;

      const data = await geminiService.getNutritionRecommendations(
        conditions,
        restrictions,
      );
      setRecommendations(data);
    } catch (err) {
      setError("Failed to get AI recommendations. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (loading) {
    return (
      <View className="bg-white rounded-xl p-6 mb-4 shadow-sm items-center justify-center">
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="text-gray-600 mt-2">
          Getting AI recommendations...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="bg-white rounded-xl p-6 mb-4 shadow-sm">
        <Text className="text-red-500 mb-2">{error}</Text>
        <TouchableOpacity
          onPress={fetchRecommendations}
          className="bg-green-600 py-2 px-4 rounded-lg self-start"
        >
          <Text className="text-white font-medium">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
      <View className="flex-row items-center mb-4">
        <Sparkles size={20} color="#16a34a" />
        <Text className="text-lg font-bold text-gray-800 ml-2">
          AI Nutrition Recommendations
        </Text>
      </View>

      {recommendations.length === 0 ? (
        <TouchableOpacity
          onPress={fetchRecommendations}
          className="bg-green-100 p-4 rounded-lg flex-row items-center justify-center"
        >
          <Sparkles size={18} color="#16a34a" />
          <Text className="text-green-700 font-medium ml-2">
            Get AI Recommendations
          </Text>
        </TouchableOpacity>
      ) : (
        <ScrollView>
          {recommendations.map((recommendation, index) => (
            <View
              key={index}
              className="border border-gray-200 rounded-lg mb-3 overflow-hidden"
            >
              <TouchableOpacity
                onPress={() => toggleExpand(index)}
                className="flex-row justify-between items-center p-3 bg-green-50"
              >
                <Text className="font-bold text-gray-800">
                  {recommendation.title}
                </Text>
                {expandedIndex === index ? (
                  <ChevronUp size={18} color="#16a34a" />
                ) : (
                  <ChevronDown size={18} color="#16a34a" />
                )}
              </TouchableOpacity>

              {expandedIndex === index && (
                <View className="p-3">
                  <Text className="text-gray-600 mb-3">
                    {recommendation.description}
                  </Text>

                  <Text className="font-medium text-gray-800 mb-1">
                    Benefits:
                  </Text>
                  <View className="mb-3">
                    {recommendation.benefits.map((benefit, i) => (
                      <Text key={i} className="text-gray-600 ml-2">
                        • {benefit}
                      </Text>
                    ))}
                  </View>

                  <Text className="font-medium text-gray-800 mb-1">
                    Recommended Foods:
                  </Text>
                  <View>
                    {recommendation.foods.map((food, i) => (
                      <Text key={i} className="text-gray-600 ml-2">
                        • {food}
                      </Text>
                    ))}
                  </View>
                </View>
              )}
            </View>
          ))}

          <TouchableOpacity
            onPress={fetchRecommendations}
            className="bg-green-600 py-2 rounded-lg items-center mt-2"
          >
            <Text className="text-white font-medium">
              Refresh Recommendations
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </View>
  );
}