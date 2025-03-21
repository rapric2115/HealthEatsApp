import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { Lightbulb, ChevronDown, ChevronUp, Heart } from "lucide-react-native";

import Header from "./components/Header";

const nutritionTips = [
  {
    id: 1,
    category: "Heart Health",
    title: "Omega-3 Fatty Acids",
    description:
      "Incorporate fatty fish like salmon, mackerel, and sardines into your diet twice a week to boost heart health. Plant sources include flaxseeds, chia seeds, and walnuts.",
    expanded: false,
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=500&q=80",
  },
  {
    id: 2,
    category: "Blood Sugar",
    title: "Glycemic Index Awareness",
    description:
      "Choose low glycemic index foods like whole grains, legumes, and most fruits to help maintain stable blood sugar levels. Avoid refined carbohydrates and sugary foods that cause blood sugar spikes.",
    expanded: false,
    image:
      "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&q=80",
  },
  {
    id: 3,
    category: "Cholesterol Management",
    title: "Soluble Fiber Benefits",
    description:
      "Foods rich in soluble fiber like oats, barley, beans, and fruits can help lower LDL (bad) cholesterol. Aim for at least 5-10 grams of soluble fiber daily for cholesterol management.",
    expanded: false,
    image:
      "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=500&q=80",
  },
  {
    id: 4,
    category: "Weight Management",
    title: "Protein and Satiety",
    description:
      "Include lean protein sources in each meal to increase satiety and reduce overall calorie intake. Good options include poultry, fish, tofu, legumes, and low-fat dairy products.",
    expanded: false,
    image:
      "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=500&q=80",
  },
  {
    id: 5,
    category: "Gut Health",
    title: "Probiotic Foods",
    description:
      "Fermented foods like yogurt, kefir, sauerkraut, and kimchi contain beneficial probiotics that support gut health. A healthy gut microbiome is linked to improved digestion, immunity, and mental health.",
    expanded: false,
    image:
      "https://images.unsplash.com/photo-1579372786545-d24232daf58c?w=500&q=80",
  },
  {
    id: 6,
    category: "Anti-Inflammatory",
    title: "Colorful Produce",
    description:
      "Eat a rainbow of fruits and vegetables to get a wide range of antioxidants and phytonutrients that help reduce inflammation. Chronic inflammation is linked to many health conditions including heart disease and diabetes.",
    expanded: false,
    image:
      "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&q=80",
  },
  {
    id: 7,
    category: "Bone Health",
    title: "Calcium and Vitamin D",
    description:
      "Maintain strong bones by consuming calcium-rich foods like dairy products, fortified plant milks, leafy greens, and small fish with bones. Vitamin D from sunlight, fatty fish, and fortified foods helps calcium absorption.",
    expanded: false,
    image:
      "https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=500&q=80",
  },
  {
    id: 8,
    category: "Brain Health",
    title: "Mediterranean Diet",
    description:
      "Following a Mediterranean diet rich in olive oil, nuts, fish, whole grains, and vegetables has been linked to better cognitive function and reduced risk of neurodegenerative diseases.",
    expanded: false,
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=500&q=80",
  },
];

const categories = [
  "All",
  "Heart Health",
  "Blood Sugar",
  "Cholesterol Management",
  "Weight Management",
  "Gut Health",
  "Anti-Inflammatory",
  "Bone Health",
  "Brain Health",
];

export default function NutritionTips() {
  const router = useRouter();
  const [tips, setTips] = useState(nutritionTips);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedTips, setSavedTips] = useState([]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
  };

  const toggleExpand = (id: number) => {
    setTips(
      tips.map((tip) =>
        tip.id === id ? { ...tip, expanded: !tip.expanded } : tip,
      ),
    );
  };

  const toggleSaveTip = (id: number) => {
    if (savedTips.includes(id)) {
      setSavedTips(savedTips.filter((tipId) => tipId !== id));
    } else {
      setSavedTips([...savedTips, id]);
    }
  };

  const filteredTips = tips.filter(
    (tip) => selectedCategory === "All" || tip.category === selectedCategory,
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      {/* <Header title="Nutrition Tips" showBackButton={true} /> */}
      <View className="px-4 py-2 bg-green-50 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Lightbulb size={20} color="#16a34a" />
          <Text className="ml-2 text-green-700 font-semibold">
            Nutrition Knowledge
          </Text>
        </View>
        <View className="flex-row items-center">
          <Text className="text-green-700 mr-1 text-sm">
            {savedTips.length} Saved
          </Text>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="bg-white py-2 container"
        style={{ flexGrow: 0}}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleCategorySelect(category)}
            className={`px-4 py-1 mx-1 rounded-xl w-[110px] h-[45px] items-center justify-center ${selectedCategory === category ? "bg-green-600" : "bg-gray-200"}`}
          >
            <Text
              className={`font-medium ${selectedCategory === category ? "text-white" : "text-gray-700"}`}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView className="flex-1 bg-gray-100 p-4 mb-4">
        {filteredTips.map((tip) => (
          <View
            key={tip.id}
            className="bg-white rounded-xl mb-4 shadow-sm overflow-hidden"
          >
            <Image
              source={{ uri: tip.image }}
              className="w-full h-40"
              resizeMode="cover"
            />
            <View className="p-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {tip.category}
                </Text>
                <TouchableOpacity onPress={() => toggleSaveTip(tip.id)}>
                  <Heart
                    size={20}
                    color={savedTips.includes(tip.id) ? "#ef4444" : "#d1d5db"}
                    fill={savedTips.includes(tip.id) ? "#ef4444" : "none"}
                  />
                </TouchableOpacity>
              </View>
              <Text className="text-lg font-bold text-gray-800 mt-2">
                {tip.title}
              </Text>
              {tip.expanded ? (
                <Text className="text-gray-600 mt-2">{tip.description}</Text>
              ) : (
                <Text numberOfLines={2} className="text-gray-600 mt-2">
                  {tip.description}
                </Text>
              )}
              <TouchableOpacity
                onPress={() => toggleExpand(tip.id)}
                className="flex-row items-center mt-3"
              >
                <Text className="text-green-600 font-medium mr-1">
                  {tip.expanded ? "Show Less" : "Read More"}
                </Text>
                {tip.expanded ? (
                  <ChevronUp size={16} color="#16a34a" />
                ) : (
                  <ChevronDown size={16} color="#16a34a" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
