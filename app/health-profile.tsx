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
import { useUserProfileStore } from "./store/userProfileStore";
import { useTranslation } from "react-i18next";

export default function HealthProfile() {
  const userProfile = useUserProfileStore();
  const router = useRouter();
  const {t} = useTranslation();

  const initialHealthProfile = {
    personalInfo: {
      age: userProfile.personalInfo.age,
      height: userProfile.personalInfo.height,
      weight: `${userProfile.personalInfo.weight}`,
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

  const [healthProfile, setHealthProfile] = useState(initialHealthProfile);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState(initialHealthProfile);
  const [saveStatus, setSaveStatus ] = useState<'idle' | 'saving' | 'success'>('idle');
  
  const handleEditToggle = async () => {
    if (editMode) {
      setSaveStatus('saving');
      await userProfile.updatePersonalInfo(editedProfile.personalInfo);
      setHealthProfile(editedProfile);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } else {
      setEditedProfile(healthProfile);
    }
    setEditMode(!editMode);
  };

  const handleTextChange = (
    section: keyof typeof editedProfile,
    field: string,
    value: string,
  ) => {
    setEditedProfile({
      ...editedProfile,
      [section]: {
        ...editedProfile[section],
        [field]: value,
      },
    });
  };

  const handleSwitchToggle = (section: keyof typeof editedProfile, field: string) => {
    setEditedProfile({
      ...editedProfile,
      [section]: {
        ...editedProfile[section],
        [field as keyof typeof editedProfile[typeof section]]: !editedProfile[section][field as keyof typeof editedProfile[typeof section]],
      },
    });
  };

  const renderPersonalInfo = () => {
    return (
      <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">
            {t("profile.profile_title")}
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
                keyboardType={['age', 'height', 'weight'].includes(key) ? 'numeric' : 'default'}
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

  const renderSwitchSection = (title: string, section: keyof typeof healthProfile) => {
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
      <View className="px-4 py-2 bg-green-50 flex-row justify-between items-center">
        <View className="flex-row items-center">
          <Heart size={20} color="#16a34a" />
          <Text className="ml-2 text-green-700 font-semibold">
            {t("profile.health_profile")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleEditToggle}
          accessibilityLabel={editMode ? `${t("profile.save_changes")}` : `${t("profile.edit_profile")}`}
          accessibilityRole="button"
          className={`flex-row items-center ${editMode ? "bg-green-600" : "bg-gray-600"} px-3 py-1 rounded-full`}
        >
          {editMode ? (
            <>
              <Save size={16} color="white" />
              <Text className="text-white ml-1 font-medium text-sm">{t("profile.save")}</Text>
            </>
          ) : (
            <>
              <Edit2 size={16} color="white" />
              <Text className="text-white ml-1 font-medium text-sm">{t("profile.edit")}</Text>
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