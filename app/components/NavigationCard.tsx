import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { LucideIcon } from "lucide-react-native";
import { Heart, Utensils, ShoppingCart } from "lucide-react-native";

interface NavigationCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  route: `/${string}`;
  color: string;
}

const NavigationCard = ({
  title = "Health Profile",
  description = "Manage your health conditions and preferences",
  icon: Icon = Heart,
  route = "/health-profile",
  color = "#E6F7FF",
}: NavigationCardProps) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(route);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="w-[300px] h-[170px] rounded-xl p-4 m-2 justify-between"
      style={{ backgroundColor: color }}
    >
      <View className="bg-white rounded-full p-2 w-10 h-10 items-center justify-center">
        <Icon size={20} color="#333" />
      </View>

      <View className="mt-2">
        <Text className="font-bold text-lg text-gray-800">{title}</Text>
        <Text className="text-xs text-gray-600 mt-1">{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NavigationCard;
