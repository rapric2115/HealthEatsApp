import React from 'react';
import { TouchableOpacity, View, Text, Image, Platform } from 'react-native';
import { useAuthStore } from '../store/authStore';
import { AntDesign } from '@expo/vector-icons';

const GoogleSignInButton = () => {
  const { onGoogleSignIn, isLoading } = useAuthStore();
  // const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleSignIn = async () => {
    try {
        await onGoogleSignIn();
    } catch (error) {
        console.error('Google Sign-In Error:', error);
    }
  }

  return (
    <TouchableOpacity
      onPress={handleGoogleSignIn}
      disabled={isLoading}
      className={`flex-row items-center justify-center py-3 px-6 rounded-lg border border-gray-300 bg-white ${isLoading ? 'opacity-70' : ''}`}
    >
      <AntDesign name="google" size={20} color="#DB4437" />
      <Text className="text-gray-800 font-medium ml-3">
        {isLoading ? 'Signing in...' : 'Continue with Google'}
      </Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;