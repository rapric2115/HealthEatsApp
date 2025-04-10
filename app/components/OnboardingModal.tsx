import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { BlurView } from "expo-blur";
import {
  ChevronRight,
  X,
  User,
  Apple,
  Carrot,
  Coffee,
  Egg,
  Fish,
  Milk,
  Wheat,
  Scale,
  Heart,
} from "lucide-react-native";
import { useUserProfileStore } from "../store/userProfileStore";

//Internationalization with i18n
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from "./LanguageSwitcher";

type OnboardingStep =
  | "welcome"
  | "personal"
  | "conditions"
  | "dietary"
  | "preferences";

interface OnboardingModalProps {
  isVisible?: boolean;
  onComplete?: () => void;
  onDismiss?: () => void;
}

const OnboardingModal = ({
  isVisible = true,
  onComplete = () => {},
  onDismiss = () => {},
}: OnboardingModalProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("welcome");

  const { t, i18n } = useTranslation();

  // Get user profile store methods
  const {
    personalInfo,
    healthProfile,
    updatePersonalInfo,
    updateHealthConditions,
    updateDietaryRestrictions,
    updateFoodPreferences,
  } = useUserProfileStore();

  // Local state for form handling
  const [selectedConditions, setSelectedConditions] = useState<string[]>(
    healthProfile.conditions,
  );
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    healthProfile.restrictions,
  );
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    healthProfile.preferences,
  );
  const [localPersonalInfo, setLocalPersonalInfo] = useState(personalInfo);

  // Initialize local state from store
  useEffect(() => {
    setSelectedConditions(healthProfile.conditions);
    setSelectedRestrictions(healthProfile.restrictions);
    setSelectedPreferences(healthProfile.preferences);
    setLocalPersonalInfo(personalInfo);
  }, [healthProfile, personalInfo]);

  if (!isVisible) return null;

  const handleNextStep = () => {
    switch (currentStep) {
      case "welcome":
        setCurrentStep("personal");
        break;
      case "personal":
        // Save personal info to store
        updatePersonalInfo(localPersonalInfo);
        setCurrentStep("conditions");
        break;
      case "conditions":
        // Save health conditions to store
        updateHealthConditions(selectedConditions);
        setCurrentStep("dietary");
        break;
      case "dietary":
        // Save dietary restrictions to store
        updateDietaryRestrictions(selectedRestrictions);
        setCurrentStep("preferences");
        break;
      case "preferences":
        // Save food preferences to store
        updateFoodPreferences(selectedPreferences);
        onComplete();
        break;
    }
  };

  const toggleSelection = (
    array: string[],
    setArray: React.Dispatch<React.SetStateAction<string[]>>,
    item: string,
  ) => {
    if (array.includes(item)) {
      setArray(array.filter((i) => i !== item));
    } else {
      setArray([...array, item]);
    }
  };

  const renderStepIndicator = () => {
    const steps = [
      "welcome",
      "personal",
      "conditions",
      "dietary",
      "preferences",
    ];
    const currentIndex = steps.indexOf(currentStep);

    return (
      <View className="flex-row justify-center space-x-2 mb-6">
        {steps.map((_, index) => (
          <View
            key={index}
            className={`h-2 w-2 rounded-full ${index <= currentIndex ? "bg-blue-500" : "bg-gray-300"}`}
          />
        ))}
      </View>
    );
  };

  const renderWelcomeStep = () => (
    <View className="items-center justify-center p-6">
       <View className="w-full mb-4">
       <Text className="text-2xl font-bold text-center mb-4">
        {t("common.set_Lang")}
        {/* Welcome to Healthy Meals */}
      </Text>
        <LanguageSwitcher />
      </View>
      <Text className="text-2xl font-bold text-center mb-4">
        {t("common.welcome")}
        {/* Welcome to Healthy Meals */}
      </Text>
      <Text className="text-base text-center text-gray-600 mb-8">
        {t("common.welcome_message")}
      </Text>
      <View className="w-full">
        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg flex-row items-center justify-center"
          onPress={handleNextStep}
        >
          <Text className="text-white font-semibold mr-2">{t("common.welcome_Btn")}</Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPersonalInfoStep = () => (
    <ScrollView className="p-6">
      <Text className="text-xl font-bold mb-6">{t("common.personal_info")}</Text>

      <View className="bg-gray-100 rounded-lg p-4 mb-4">
        <View className="flex-row items-center mb-4">
          <User size={20} color="#4B5563" />
          <Text className="ml-2 text-gray-700 font-medium">
            {t("common.basic_info")}
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-1 text-sm">{t("common.full_name")}</Text>
          <TextInput
            className="h-12 bg-white rounded px-3 border border-gray-200"
            placeholder="Enter your full name"
            value={localPersonalInfo.name}
            onChangeText={(text) =>
              setLocalPersonalInfo({ ...localPersonalInfo, name: text })
            }
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-1 text-sm">{t("common.age")}</Text>
          <TextInput
            className="h-12 bg-white rounded px-3 border border-gray-200"
            placeholder="Enter your age"
            keyboardType="numeric"
            value={localPersonalInfo.age}
            onChangeText={(text) =>
              setLocalPersonalInfo({ ...localPersonalInfo, age: text })
            }
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-600 mb-1 text-sm">{t("common.gender")}</Text>
          <View className="flex-row">
            <TouchableOpacity
              className={`flex-1 h-12 rounded mr-2 items-center justify-center ${localPersonalInfo.gender === "Male" ? "bg-blue-500" : "bg-white border border-gray-200"}`}
              onPress={() =>
                setLocalPersonalInfo({ ...localPersonalInfo, gender: "Male" })
              }
            >
              <Text
                className={
                  localPersonalInfo.gender === "Male"
                    ? "text-white"
                    : "text-gray-700"
                }
              >
                {t("common.male")}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 h-12 rounded items-center justify-center ${localPersonalInfo.gender === "Female" ? "bg-blue-500" : "bg-white border border-gray-200"}`}
              onPress={() =>
                setLocalPersonalInfo({ ...localPersonalInfo, gender: "Female" })
              }
            >
              <Text
                className={
                  localPersonalInfo.gender === "Female"
                    ? "text-white"
                    : "text-gray-700"
                }
              >
                {t("common.female")}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="bg-gray-100 rounded-lg p-4 mb-6">
        <View className="flex-row items-center mb-4">
          <Scale size={20} color="#4B5563" />
          <Text className="ml-2 text-gray-700 font-medium">{t("common.health_metric")}</Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-1 text-sm">{t("common.weight")} (kg)</Text>
          <TextInput
            className="h-12 bg-white rounded px-3 border border-gray-200"
            placeholder="Enter your weight"
            keyboardType="numeric"
            value={localPersonalInfo.weight}
            onChangeText={(text) =>
              setLocalPersonalInfo({ ...localPersonalInfo, weight: text })
            }
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-600 mb-1 text-sm">{t("common.height")} (cm)</Text>
          <TextInput
            className="h-12 bg-white rounded px-3 border border-gray-200"
            placeholder="Enter your height"
            keyboardType="numeric"
            value={localPersonalInfo.height}
            onChangeText={(text) =>
              setLocalPersonalInfo({ ...localPersonalInfo, height: text })
            }
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 rounded-lg flex-row items-center justify-center"
        onPress={handleNextStep}
      >
        <Text className="text-white font-semibold mr-2">{t("common.continue")}</Text>
        <ChevronRight size={20} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );

  const renderHealthConditionsStep = () => {
    const conditions = [
      t("health.conditions.high_cholesterol"),
      t("health.conditions.high_blood_pressure"),
      t("health.conditions.diabetes_type_2"),
      t("health.conditions.heart_disease"),
      t("health.conditions.obesity"),
      t("health.conditions.digestive_issues"),
      t("health.conditions.none"),
    ];

    return (
      <View className="p-6">
        <Text className="text-xl font-bold mb-2">{t("health.conditions_title")}</Text>
        <Text className="text-gray-600 mb-6">
          {t("health.conditions_subtitle")}:
        </Text>

        <ScrollView className="mb-6">
          {conditions.map((condition) => (
            <TouchableOpacity
              key={condition}
              className={`flex-row items-center p-4 border rounded-lg mb-2 ${selectedConditions.includes(condition) ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
              onPress={() =>
                toggleSelection(
                  selectedConditions,
                  setSelectedConditions,
                  condition,
                )
              }
            >
              <View
                className={`h-5 w-5 rounded-full mr-3 border ${selectedConditions.includes(condition) ? "bg-blue-500 border-blue-500" : "border-gray-400"}`}
              />
              <Text
                className={`${selectedConditions.includes(condition) ? "text-blue-700 font-medium" : "text-gray-700"}`}
              >
                {condition}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg flex-row items-center justify-center"
          onPress={handleNextStep}
        >
          <Text className="text-white font-semibold mr-2">{t("common.continue")}</Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDietaryRestrictionsStep = () => {
    const restrictions = [
      { name: t("health.restrictions.gluten_free"), icon: <Wheat size={20} color="#4B5563" /> },
      { name: t("health.restrictions.dairy_free"), icon: <Milk size={20} color="#4B5563" /> },
      { name: t("health.restrictions.vegetarian"), icon: <Carrot size={20} color="#4B5563" /> },
      { name: t("health.restrictions.vegan"), icon: <Apple size={20} color="#4B5563" /> },
      { name: t("health.restrictions.pescadetarian"), icon: <Fish size={20} color="#4B5563" /> },
      { name: t("health.restrictions.low-Sodium"), icon: <Coffee size={20} color="#4B5563" /> },
      { name: t("health.restrictions.low-sugar"), icon: <Coffee size={20} color="#4B5563" /> },
      { name: t("health.restrictions.none"), icon: <Egg size={20} color="#4B5563" /> },
    ];

    return (
      <View className="p-6">
        <Text className="text-xl font-bold mb-2">{t("health.restriction_title")}</Text>
        <Text className="text-gray-600 mb-6">
          {t("health.restriction_subtitle")}
        </Text>

        <ScrollView className="mb-6">
          <View className="flex-row flex-wrap justify-between">
            {restrictions.map((restriction) => (
              <TouchableOpacity
                key={restriction.name}
                className={`w-[48%] p-4 border rounded-lg mb-3 items-center ${selectedRestrictions.includes(restriction.name) ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                onPress={() =>
                  toggleSelection(
                    selectedRestrictions,
                    setSelectedRestrictions,
                    restriction.name,
                  )
                }
              >
                {restriction.icon}
                <Text
                  className={`mt-2 text-center ${selectedRestrictions.includes(restriction.name) ? "text-blue-700 font-medium" : "text-gray-700"}`}
                >
                  {restriction.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg flex-row items-center justify-center"
          onPress={handleNextStep}
        >
          <Text className="text-white font-semibold mr-2">{t("common.continue")}</Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderFoodPreferencesStep = () => {
    const preferences = [
      t("preferences.cuisines.mediterranean"),
      t("preferences.cuisines.asian"),
      t("preferences.cuisines.mexican"),
      t("preferences.cuisines.italian"),
      t("preferences.cuisines.indian"),
      t("preferences.cuisines.american"),
      t("preferences.cuisines.middle_eastern"),
      t("preferences.cuisines.quick_easy_meals"),
      t("preferences.cuisines.batch_cooking"),
      t("preferences.cuisines.budget_friendly"),
    ];

    return (
      <View className="p-6">
        <Text className="text-xl font-bold mb-2">{t("preferences.preferences_title")}</Text>
        <Text className="text-gray-600 mb-6">
          {t("preferences.preferences_subtitle")}
        </Text>

        <ScrollView className="mb-6">
          <View className="flex-row flex-wrap justify-between">
            {preferences.map((preference) => (
              <TouchableOpacity
                key={preference}
                className={`w-[48%] p-4 border rounded-lg mb-3 ${selectedPreferences.includes(preference) ? "border-blue-500 bg-blue-50" : "border-gray-200"}`}
                onPress={() =>
                  toggleSelection(
                    selectedPreferences,
                    setSelectedPreferences,
                    preference,
                  )
                }
              >
                <Text
                  className={`text-center ${selectedPreferences.includes(preference) ? "text-blue-700 font-medium" : "text-gray-700"}`}
                >
                  {preference}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg flex-row items-center justify-center"
          onPress={handleNextStep}
        >
          <Text className="text-white font-semibold mr-2">{t("preferences.preferences_btn")}</Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case "welcome":
        return renderWelcomeStep();
      case "personal":
        return renderPersonalInfoStep();
      case "conditions":
        return renderHealthConditionsStep();
      case "dietary":
        return renderDietaryRestrictionsStep();
      case "preferences":
        return renderFoodPreferencesStep();
      default:
        return renderWelcomeStep();
    }
  };

  return (
    <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-50">
      <BlurView intensity={10} className="absolute inset-0" />
      <View className="bg-white w-[350px] rounded-xl overflow-hidden">
        <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
          <Text className="font-bold text-lg">Health Profile Setup</Text>
          <TouchableOpacity onPress={onDismiss}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <View className="pt-4">
          {renderStepIndicator()}
          {renderCurrentStep()}
        </View>
      </View>
    </View>
  );
};

export default OnboardingModal;
