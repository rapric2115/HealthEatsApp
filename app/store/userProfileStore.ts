import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface HealthProfile {
  conditions: string[];
  restrictions: string[];
  preferences: string[];
  router: string;
}

export interface PersonalInfo {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
}

type UserProfileState = {
  personalInfo: PersonalInfo;
  healthProfile: HealthProfile;
  mealPlanStatus: {
    daysPlanned: number;
    totalDays: number;
    router: string;
  };
  groceryListStatus: {
    itemsChecked: number;
    totalItems: number;
    router: string;
  };
  updatePersonalInfo: (info: Partial<PersonalInfo>) => void;
  updateHealthConditions: (conditions: string[]) => void;
  updateDietaryRestrictions: (restrictions: string[]) => void;
  updateFoodPreferences: (preferences: string[]) => void;
  updateMealPlanStatus: (status: {
    daysPlanned: number;
    totalDays: number;
  }) => void;
  updateGroceryListStatus: (status: {
    itemsChecked: number;
    totalItems: number;
  }) => void;
};

export const useUserProfileStore = create<UserProfileState, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      personalInfo: {
        name: "",
        age: "",
        gender: "",
        weight: "",
        height: "",
      },
      healthProfile: {
        conditions: [],
        restrictions: [],
        preferences: [],
        router: '/health-profile'
      },
      mealPlanStatus: {
        daysPlanned: 0,
        totalDays: 7,
        router: '/meal-planning'
      },
      groceryListStatus: {
        itemsChecked: 0,
        totalItems: 0,
        router: '/grocery-list'
      },
      updatePersonalInfo: (info) =>
        set((state) => ({
          personalInfo: { ...state.personalInfo, ...info },
        })),
      updateHealthConditions: (conditions) =>
        set((state) => ({
          healthProfile: { ...state.healthProfile, conditions },
        })),
      updateDietaryRestrictions: (restrictions) =>
        set((state) => ({
          healthProfile: { ...state.healthProfile, restrictions },
        })),
      updateFoodPreferences: (preferences) =>
        set((state) => ({
          healthProfile: { ...state.healthProfile, preferences },
        })),
      updateMealPlanStatus: (status) =>
        set((state) => ({
          mealPlanStatus: { ...state.mealPlanStatus, ...status },
        })),
      updateGroceryListStatus: (status) =>
        set((state) => ({
          groceryListStatus: { ...state.groceryListStatus, ...status },
        })),
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
