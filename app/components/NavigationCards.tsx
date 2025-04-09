import React from "react";
import { View, Text, ScrollView } from "react-native";
import { Heart, Utensils, ShoppingCart } from "lucide-react-native";
import NavigationCard from "./NavigationCard";

interface NavigationCardsProps {
  cards?: Array<{
    title: string;
    description: string;
    icon: any;
    route: string;
    color: string;
  }>;
}

const NavigationCards = ({ cards }: NavigationCardsProps) => {
  const defaultCards: Array<{
    title: string;
    description: string;
    icon: any;
    route: "/health-profile" | "/meal-planning" | "/grocery-list" | "/nutrition-tips";
    color: string;
  }> = [
    {
      title: "Health Profile",
      description: "Manage your health conditions and preferences",
      icon: Heart,
      route: "/health-profile",
      color: "#E6F7FF",
    },
    {
      title: "Meal Planning",
      description: "View and customize your personalized meal plans",
      icon: Utensils,
      route: "/meal-planning",
      color: "#F0FFF4",
    },
    {
      title: "Grocery List",
      description: "Check and manage your shopping list",
      icon: ShoppingCart,
      route: "/grocery-list",
      color: "#FFF5F5",
    },
    {
      title: "Nutrition Tips",
      description: "Learn why certain foods benefit your health",
      icon: Heart,
      route: "/nutrition-tips",
      color: "#FFFBEA",
    },
  ];

  const displayCards = cards || defaultCards;

  return (
    <View className="bg-white w-full h-full p-4 mb-4">
      <Text className="text-xl font-bold mb-4 text-gray-800">Quick Access</Text>
      <ScrollView>
        <View className="flex-row flex-wrap justify-center">
          {displayCards.map((card, index) => (
            <NavigationCard
              key={index}
              title={card.title}
              description={card.description}
              icon={card.icon}
              route={card.route}
              color={card.color}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default NavigationCards;
