import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface HealthProfile {
  conditions: string[];
  restrictions: string[];
  preferences: string[];
}

export interface PersonalInfo {
  name: string;
  age: string;
  gender: string;
  weight: string;
  height: string;
}

export interface SubscriptionInfo {
  tier: "free" | "basic" | "premium";
  active: boolean;
  expiryDate: string | null;
  features: string[];
  aiCreditsRemaining: number;
}

export interface MealPlan {
  id: string;
  name: string;
  date: string;
  plan: Record<string, Record<string, any>>;
}

export interface GroceryList {
  id: string;
  name: string;
  date: string;
  items: any[];
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
  subscription: SubscriptionInfo;
  savedMealPlans: MealPlan[];
  savedGroceryLists: GroceryList[];
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
  updateSubscription: (info: Partial<SubscriptionInfo>) => void;
  useAiCredit: () => boolean;
  saveMealPlan: (
    name: string,
    plan: Record<string, Record<string, any>>,
  ) => void;
  saveGroceryList: (name: string, items: any[]) => void;
  deleteMealPlan: (id: string) => void;
  deleteGroceryList: (id: string) => void;
};

export const useUserProfileStore = create<UserProfileState>()(
  persist<UserProfileState>(
    (set, get) => ({
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
      },
      mealPlanStatus: {
        daysPlanned: 0,
        totalDays: 7,
        router: "",
      },
      groceryListStatus: {
        itemsChecked: 0,
        totalItems: 0,
        router: "",
      },
      subscription: {
        tier: "free",
        active: true,
        expiryDate: null,
        features: ["Basic health profile", "Limited meal suggestions"],
        aiCreditsRemaining: 5,
      },
      savedMealPlans: [],
      savedGroceryLists: [],
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
      updateSubscription: (info) =>
        set((state) => ({
          subscription: { ...state.subscription, ...info },
        })),
      saveMealPlan: (name, plan) =>
        set((state) => {
          const newMealPlan = {
            id: Date.now().toString(),
            name,
            date: new Date().toISOString(),
            plan,
          };
          return {
            savedMealPlans: [...state.savedMealPlans, newMealPlan],
          };
        }),
      saveGroceryList: (name, items) =>
        set((state) => {
          const newGroceryList = {
            id: Date.now().toString(),
            name,
            date: new Date().toISOString(),
            items,
          };
          return {
            savedGroceryLists: [...state.savedGroceryLists, newGroceryList],
          };
        }),
      deleteMealPlan: (id) =>
        set((state) => ({
          savedMealPlans: state.savedMealPlans.filter((plan) => plan.id !== id),
        })),
      deleteGroceryList: (id) =>
        set((state) => ({
          savedGroceryLists: state.savedGroceryLists.filter(
            (list) => list.id !== id,
          ),
        })),
      useAiCredit: () => {
        const state = get();
        if (
          state.subscription.tier === "premium" ||
          state.subscription.aiCreditsRemaining > 0
        ) {
          if (state.subscription.tier !== "premium") {
            set((state) => ({
              subscription: {
                ...state.subscription,
                aiCreditsRemaining: state.subscription.aiCreditsRemaining - 1,
              },
            }));
          }
          return true;
        }
        return false;
      },
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
