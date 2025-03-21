import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TextInput,
  Switch,
} from "react-native";
import { useRouter } from "expo-router";
import { Heart, Save, Edit2 } from "lucide-react-native";

import Header from "./components/Header";

const initialHealthProfile = {
  personalInfo: {
    age: "35",
    height: "5'10\"",
    weight: "170 lbs",
    activityLevel: "Moderate",
  },
  healthConditions: {
    highBloodPressure: true,
    highCholesterol: true,
    diabetes: false,
    heartDisease: false,
    obesity: false,
    foodAllergies: true,
  },
  dietaryRestrictions: {
    vegetarian: false,
    vegan: false,
    glutenFree: true,
    dairyFree: false,
    nutFree: true,
    lowSodium: true,
  },
  nutritionGoals: {
    loseWeight: true,
    gainMuscle: false,
    improveEnergy: true,
    lowerCholesterol: true,
    stabilizeBloodSugar: false,
  },
};

export default function HealthProfile() {
  const router = useRouter();
  const [healthProfile, setHealthProfile] = useState(initialHealthProfile);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(initialHealthProfile);

  const handleEditToggle = () => {
    if (editMode) {
      // Save changes
      setHealthProfile(editedProfile);
    } else {
      // Enter edit mode
      setEditedProfile(healthProfile);
    }
    setEditMode(!editMode);
  };

  const handleTextChange = (section: string, field: string, value: string) => {
    setEditedProfile({
      ...editedProfile,
      [section]: {
        ...editedProfile[section],
        [field]: value,
      },
    });
  };

  const handleSwitchToggle = (section: any, field: any) => {
    setEditedProfile({
      ...editedProfile,
      [section]: {
        ...editedProfile[section],
        [field]: !editedProfile[section][field],
      },
    });
  };

  const renderPersonalInfo = () => {
    return (
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            Personal Information
          </Text>
        </View>

        {Object.entries(
          editMode ? editedProfile.personalInfo : healthProfile.personalInfo,
        ).map(([key, value]) => (
          <View
            key={key}
            className="flex-row justify-between items-center mb-3"
          >
            <Text className="text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </Text>
            {editMode ? (
              <TextInput
                value={value.toString()}
                onChangeText={(text) =>
                  handleTextChange("personalInfo", key, text)
                }
                className="border border-gray-300 rounded-md px-2 py-1 w-32 text-right"
              />
            ) : (
              <Text className="text-gray-800 font-medium">
                {value.toString()}
              </Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  const renderSwitchSection = (title: any, section: any) => {
    return (
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">{title}</Text>
        </View>

        {Object.entries(
          editMode ? editedProfile[section] : healthProfile[section],
        ).map(([key, value]) => (
          <View
            key={key}
            className="flex-row justify-between items-center mb-3"
          >
            <Text className="text-gray-700 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </Text>
            {editMode ? (
              <Switch
                value={Boolean(value)}
                onValueChange={() => handleSwitchToggle(section, key)}
                trackColor={{ false: "#d1d5db", true: "#10b981" }}
              />
            ) : (
              <View
                className={`w-4 h-4 rounded-full ${value ? "bg-green-500" : "bg-gray-300"}`}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="dark-content" backgroundColor="#f0fdf4" />
      {/* <Header title="Health Profile" showBackButton={true} /> */}
      <View className="px-4 py-2 bg-green-50 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Heart size={20} color="#16a34a" />
          <Text className="ml-2 text-green-700 font-semibold">
            Your Health Profile
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleEditToggle}
          className={`flex-row items-center ${editMode ? "bg-green-600" : "bg-gray-600"} px-3 py-1 rounded-full`}
        >
          {editMode ? (
            <>
              <Save size={16} color="white" />
              <Text className="text-white ml-1 font-medium text-sm">Save</Text>
            </>
          ) : (
            <>
              <Edit2 size={16} color="white" />
              <Text className="text-white ml-1 font-medium text-sm">Edit</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 bg-gray-100 p-4">
        {renderPersonalInfo()}
        {renderSwitchSection("Health Conditions", "healthConditions")}
        {renderSwitchSection("Dietary Restrictions", "dietaryRestrictions")}
        {renderSwitchSection("Nutrition Goals", "nutritionGoals")}
      </ScrollView>
    </SafeAreaView>
  );
}
