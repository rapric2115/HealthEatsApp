import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Menu, ArrowLeft, Bell } from "lucide-react-native";

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  showNotifications?: boolean;
  onMenuPress?: () => void;
  onNotificationPress?: () => void;
}

const Header = ({
  title = "NutriPlan",
  showBackButton = false,
  showNotifications = true,
  onMenuPress = () => {},
  onNotificationPress = () => {},
}: HeaderProps) => {
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
  };

  return (
    <View className="w-full h-16 px-4 flex-row items-center justify-between bg-green-50">
      <View className="flex-row items-center">
        {showBackButton ? (
          <TouchableOpacity onPress={handleBackPress} className="mr-3 p-2">
            <ArrowLeft size={24} color="#16a34a" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={onMenuPress} className="mr-3 p-2">
            <Menu size={24} color="#16a34a" />
          </TouchableOpacity>
        )}
        <Text className="text-xl font-bold text-green-600">{title}</Text>
      </View>

      {showNotifications && (
        <TouchableOpacity onPress={onNotificationPress} className="p-2">
          <Bell size={24} color="#16a34a" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Header;
