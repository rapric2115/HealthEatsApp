import React, { useState } from "react";
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
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedRestrictions, setSelectedRestrictions] = useState<string[]>(
    [],
  );
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>([]);
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    age: "",
    gender: "",
    weight: "",
    height: "",
  });

  if (!isVisible) return null;

  const handleNextStep = () => {
    switch (currentStep) {
      case "welcome":
        setCurrentStep("personal");
        break;
      case "personal":
        setCurrentStep("conditions");
        break;
      case "conditions":
        setCurrentStep("dietary");
        break;
      case "dietary":
        setCurrentStep("preferences");
        break;
      case "preferences":
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
      <Text className="text-2xl font-bold text-center mb-4">
        Welcome to Healthy Meals
      </Text>
      <Text className="text-base text-center text-gray-600 mb-8">
        Let's set up your health profile to provide personalized nutrition
        recommendations just for you.
      </Text>
      <View className="w-full">
        <TouchableOpacity
          className="bg-blue-500 py-3 px-6 rounded-lg flex-row items-center justify-center"
          onPress={handleNextStep}
        >
          <Text className="text-white font-semibold mr-2">Get Started</Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderPersonalInfoStep = () => (
    <ScrollView className="p-6">
      <Text className="text-xl font-bold mb-6">Personal Information</Text>

      <View className="bg-gray-100 rounded-lg p-4 mb-4">
        <View className="flex-row items-center mb-4">
          <User size={20} color="#4B5563" />
          <Text className="ml-2 text-gray-700 font-medium">
            Basic Information
          </Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-1 text-sm">Full Name</Text>
          <TextInput
            className="h-12 bg-white rounded px-3 border border-gray-200"
            placeholder="Enter your full name"
            value={personalInfo.name}
            onChangeText={(text) =>
              setPersonalInfo({ ...personalInfo, name: text })
            }
          />
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-1 text-sm">Age</Text>
          <TextInput
            className="h-12 bg-white rounded px-3 border border-gray-200"
            placeholder="Enter your age"
            keyboardType="numeric"
            value={personalInfo.age}
            onChangeText={(text) =>
              setPersonalInfo({ ...personalInfo, age: text })
            }
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-600 mb-1 text-sm">Gender</Text>
          <View className="flex-row">
            <TouchableOpacity
              className={`flex-1 h-12 rounded mr-2 items-center justify-center ${personalInfo.gender === "Male" ? "bg-blue-500" : "bg-white border border-gray-200"}`}
              onPress={() =>
                setPersonalInfo({ ...personalInfo, gender: "Male" })
              }
            >
              <Text
                className={
                  personalInfo.gender === "Male"
                    ? "text-white"
                    : "text-gray-700"
                }
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 h-12 rounded items-center justify-center ${personalInfo.gender === "Female" ? "bg-blue-500" : "bg-white border border-gray-200"}`}
              onPress={() =>
                setPersonalInfo({ ...personalInfo, gender: "Female" })
              }
            >
              <Text
                className={
                  personalInfo.gender === "Female"
                    ? "text-white"
                    : "text-gray-700"
                }
              >
                Female
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="bg-gray-100 rounded-lg p-4 mb-6">
        <View className="flex-row items-center mb-4">
          <Scale size={20} color="#4B5563" />
          <Text className="ml-2 text-gray-700 font-medium">Health Metrics</Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 mb-1 text-sm">Weight (kg)</Text>
          <TextInput
            className="h-12 bg-white rounded px-3 border border-gray-200"
            placeholder="Enter your weight"
            keyboardType="numeric"
            value={personalInfo.weight}
            onChangeText={(text) =>
              setPersonalInfo({ ...personalInfo, weight: text })
            }
          />
        </View>

        <View className="mb-2">
          <Text className="text-gray-600 mb-1 text-sm">Height (cm)</Text>
          <TextInput
            className="h-12 bg-white rounded px-3 border border-gray-200"
            placeholder="Enter your height"
            keyboardType="numeric"
            value={personalInfo.height}
            onChangeText={(text) =>
              setPersonalInfo({ ...personalInfo, height: text })
            }
          />
        </View>
      </View>

      <TouchableOpacity
        className="bg-blue-500 py-3 px-6 rounded-lg flex-row items-center justify-center"
        onPress={handleNextStep}
      >
        <Text className="text-white font-semibold mr-2">Continue</Text>
        <ChevronRight size={20} color="white" />
      </TouchableOpacity>
    </ScrollView>
  );

  const renderHealthConditionsStep = () => {
    const conditions = [
      "High Cholesterol",
      "High Blood Pressure",
      "Diabetes Type 2",
      "Heart Disease",
      "Obesity",
      "Digestive Issues",
      "None of the above",
    ];

    return (
      <View className="p-6">
        <Text className="text-xl font-bold mb-2">Health Conditions</Text>
        <Text className="text-gray-600 mb-6">
          Select any conditions you have or are at risk for:
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
          <Text className="text-white font-semibold mr-2">Continue</Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderDietaryRestrictionsStep = () => {
    const restrictions = [
      { name: "Gluten-Free", icon: <Wheat size={20} color="#4B5563" /> },
      { name: "Dairy-Free", icon: <Milk size={20} color="#4B5563" /> },
      { name: "Vegetarian", icon: <Carrot size={20} color="#4B5563" /> },
      { name: "Vegan", icon: <Apple size={20} color="#4B5563" /> },
      { name: "Pescatarian", icon: <Fish size={20} color="#4B5563" /> },
      { name: "Low-Sodium", icon: <Coffee size={20} color="#4B5563" /> },
      { name: "Low-Sugar", icon: <Coffee size={20} color="#4B5563" /> },
      { name: "No Restrictions", icon: <Egg size={20} color="#4B5563" /> },
    ];

    return (
      <View className="p-6">
        <Text className="text-xl font-bold mb-2">Dietary Restrictions</Text>
        <Text className="text-gray-600 mb-6">
          Select any dietary restrictions you have:
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
          <Text className="text-white font-semibold mr-2">Continue</Text>
          <ChevronRight size={20} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderFoodPreferencesStep = () => {
    const preferences = [
      "Mediterranean",
      "Asian",
      "Mexican",
      "Italian",
      "Indian",
      "American",
      "Middle Eastern",
      "Quick & Easy Meals",
      "Batch Cooking",
      "Budget-Friendly",
    ];

    return (
      <View className="p-6">
        <Text className="text-xl font-bold mb-2">Food Preferences</Text>
        <Text className="text-gray-600 mb-6">
          Select your favorite cuisines and meal types:
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
          <Text className="text-white font-semibold mr-2">Complete Setup</Text>
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
