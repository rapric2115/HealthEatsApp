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
import { Eye, EyeOff, LogIn } from "lucide-react-native";
import { useAuthStore } from "./store/authStore";
import GoogleSignInButton from "./components/googleSignInButton";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuthStore();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      // In a real app, this would validate credentials against a backend
      // For demo purposes, we'll just simulate a successful login
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Store auth state in Zustand
      login(email, password);

      // Navigate to main screen
      router.replace("/");
    } catch (error) {
      Alert.alert("Login Failed", "Invalid credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToRegister = () => {
    router.push("/register");
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View className="flex-1 p-6 justify-center">
            <View className="items-center mb-10">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
                }}
                className="w-32 h-32 rounded-full mb-4"
              />
              <Text className="text-3xl font-bold text-green-600">
                NutriPlan
              </Text>
              <Text className="text-gray-500 text-center mt-2">
                Your personalized nutrition assistant
              </Text>
            </View>

            <View className="mb-6">
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

            <View className="mb-8">
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <View className="relative flex-row items-center">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
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
              <TouchableOpacity className="self-end mt-2">
                <Text className="text-green-600 font-medium">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              className={`bg-green-600 py-4 rounded-lg items-center flex-row justify-center ${isLoading ? "opacity-70" : ""}`}
            >
              <LogIn size={20} color="white" />
              <Text className="text-white font-bold ml-2">
                {isLoading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center my-6">
              <View className="flex-1 h-px bg-gray-300" />
              <Text className="px-3 text-gray-500">OR</Text>
              <View className="flex-1 h-px bg-gray-300" />
            </View>
            
            <GoogleSignInButton />

            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-600">Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text className="text-green-600 font-bold">Register</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
