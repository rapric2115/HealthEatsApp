import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithCredential,
  UserCredential,
  User as FirebaseUser
} from "firebase/auth";
import app, { googleProvider } from "../services/firebase";
import * as WebBrowser from "expo-web-browser";
import * as Google from 'expo-auth-session/providers/google';
import { ResponseType } from "expo-auth-session";
import { Platform } from "react-native";
import { promptAsync } from "../utils/googleAuth";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth from '@react-native-firebase/auth';

WebBrowser.maybeCompleteAuthSession();
GoogleSignin.configure({
  webClientId: '673383246167-iqctfht9kbhqpb0qk77u997m1s2knqbk.apps.googleusercontent.com'
});

type User = {
  email: string;
  name: string;
  uid: string;
  photoURL?: string;
};

type AuthState = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  register: (email: string, password: string, name: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  onGoogleSignIn: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
};

const authFirebase = getAuth(app);

export const useAuthStore = create<AuthState, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      onGoogleSignIn: async () => {
        set({ isLoading: true, error: null });
        try {
          let userCredential: UserCredential;

        await GoogleSignin.hasPlayServices({
          showPlayServicesUpdateDialog: true,
        });
        const signInResult = await GoogleSignin.signIn();
        let idToken = signInResult.data?.idToken;
        if(!idToken) {
          idToken = signInResult.idToken || signInResult.serverAuthCode;
        }
        if(!idToken) {
          throw new Error("Google sign-in failed: No ID token received");
        }

        if (!signInResult.data) {
          throw new Error("Google sign-in failed: No data received");
        }
        const googleCredential = auth.GoogleAuthProvider.credential(signInResult.data.idToken);

        await auth().signInWithCredential(googleCredential);
        set({ isLoading: false });
          
        } catch (error: any) {
          let errorMessage = "Google sign-in failed";
          if (error.code === 'auth/account-exists-with-different-credential') {
            errorMessage = "Account exists with different credentials";
          } else if (error.message.includes('cancelled')) {
            errorMessage = "Sign-in was cancelled";
          }
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },

      register: async (email, password, name) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await createUserWithEmailAndPassword(authFirebase, email, password);
          
          const user: User = {
            email: userCredential.user.email || email,
            name,
            uid: userCredential.user.uid,
            photoURL: userCredential.user.photoURL || undefined
          };

          set({ 
            user,
            isAuthenticated: true,
            isLoading: false
          });
          
        } catch (error: any) {
          let errorMessage = "Registration failed";
          switch (error.code) {
            case "auth/email-already-in-use":
              errorMessage = "Email already in use";
              break;
            case "auth/invalid-email":
              errorMessage = "Invalid email address";
              break;
            case "auth/weak-password":
              errorMessage = "Password should be at least 6 characters";
              break;
          }
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const userCredential = await signInWithEmailAndPassword(authFirebase, email, password);
          
          const user: User = {
            email: userCredential.user.email || email,
            name: userCredential.user.displayName || "",
            uid: userCredential.user.uid,
            photoURL: userCredential.user.photoURL || undefined
          };

          set({ 
            user,
            isAuthenticated: true,
            isLoading: false
          });
          
        } catch (error: any) {
          let errorMessage = "Login failed";
          switch (error.code) {
            case "auth/user-not-found":
            case "auth/wrong-password":
              errorMessage = "Invalid email or password";
              break;
            case "auth/too-many-requests":
              errorMessage = "Too many attempts. Try again later";
              break;
          }
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },

      logout: async () => {
        set({ isLoading: true });
        try {
          await signOut(authFirebase);
          set({ 
            user: null,
            isAuthenticated: false,
            isLoading: false
          });
        } catch (error: any) {
          set({ 
            error: "Logout failed",
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    },
  ),
);

// Helper function to handle successful authentication
const handleAuthSuccess = (
  userCredential: UserCredential, 
  set: any
) => {
  const user = userCredential.user;
  const userData: User = {
    email: user.email || '',
    name: user.displayName || '',
    uid: user.uid,
    photoURL: user.photoURL || undefined
  };

  set({ 
    user: userData,
    isAuthenticated: true,
    isLoading: false
  });
};