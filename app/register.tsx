import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react-native";
import { useAuthStore } from "./store/authStore";
import { GoogleSignInButton } from "./components/googleSignInButton";

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);

  const { register, isLoading, error } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    

    try {
      // In a real app, this would create a user account in a backend
      // For demo purposes, we'll just simulate a successful registration
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store auth state in Zustand
      await register( email, password, name );

      // Navigate to main screen
      router.replace("/");
    } catch (error) {
      Alert.alert(
        "Registration Failed",
        "Could not create account. Please try again.",
      );
    } finally {
      // setIsLoading(false);
    }
  };

  const navigateToLogin = () => {
    router.push("/login");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="p-6">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mb-6 flex-row items-center"
            >
              <ArrowLeft size={20} color="#16a34a" />
              <Text className="text-green-600 ml-1 font-medium">
                Back to Login
              </Text>
            </TouchableOpacity>

            <View className="items-center mb-8">
              <Text className="text-3xl font-bold text-gray-800">
                Create Account
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Join NutriPlan for personalized nutrition plans
              </Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Full Name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your full name"
                className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
              />
            </View>

            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <View className="relative flex-row items-center">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50 flex-1"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3"
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#6B7280" />
                  ) : (
                    <Eye size={20} color="#6B7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">
                Confirm Password
              </Text>
              <TextInput
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry={!showPassword}
                className="border border-gray-300 rounded-lg px-4 py-3 bg-gray-50"
              />
            </View>

            <TouchableOpacity
              onPress={handleRegister}
              disabled={isLoading}
              className={`bg-green-600 py-4 rounded-lg items-center flex-row justify-center ${isLoading ? "opacity-70" : ""}`}
            >
              <UserPlus size={20} color="white" />
              <Text className="text-white font-bold ml-2">
                {isLoading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>
            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-3 text-gray-500">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>
            
            <GoogleSignInButton />

            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={navigateToLogin}>
                <Text className="text-green-600 font-bold">Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
