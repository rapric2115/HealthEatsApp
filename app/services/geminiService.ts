import { GoogleGenerativeAI } from '@google/generative-ai';
import { useUserProfileStore } from "../store/userProfileStore";

//importing i18n 
import { getCurrentLanguage } from '../i18n';

// Note: In a production app, you would store this in an environment variable
// For this demo, we're using mock data
const API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY; 
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface NutritionRecommendation {
  title: string;
  description: string;
  benefits: string[];
  foods: string[];
}

export interface WeeklyMenu {
  day: string;
  meals: {
    breakfast: string[];
    lunch: string[];
    dinner: string[];
    snacks: string[];
  };
}

// Define the GroceryItem interface
export interface GroceryItem {
  id: number;
  name: string;
  category: string;
  checked: boolean;
}

// Define the Meals interface
export interface Meals {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

export const geminiService = {
  /**
   * Get personalized nutrition recommendations based on health conditions
   */
  async getNutritionRecommendations(
    healthConditions?: string[],
    dietaryRestrictions?: string[],
  ): Promise<NutritionRecommendation[]> {
    // Get data from store if not provided
    const currentLanguage = getCurrentLanguage();
    const userProfile = useUserProfileStore.getState();
    const conditions = healthConditions || userProfile.healthProfile.conditions;
    const restrictions =
      dietaryRestrictions || userProfile.healthProfile.restrictions;

    try {
      // For demo purposes, return mock data if API key is not set
      if (!API_KEY || !genAI) {
        console.warn("API key not set. Returning mock data.");
        return getMockRecommendations(conditions, restrictions);
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        Generate 3 personalized nutrition recommendations in ${currentLanguage} for someone with 
        the following 
        health conditions: 
        ${conditions.length > 0 ? conditions.join(", ") : "general health improvement"}.
        
        They have these dietary restrictions: ${restrictions.length > 0 ? restrictions.join(", ") : "none"}.
        
        respond in ${currentLanguage} Format the response as a JSON array with objects containing:
        - title: A short title for the recommendation
        - description: A brief explanation (1-2 sentences)
        - benefits: An array of 2-3 specific health benefits
        - foods: An array of 5 specific foods that fulfill this recommendation
        -Important: all text must be in ${currentLanguage}
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('Response from gemini service: ', text);

      // Extract JSON from the response
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error("Could not parse AI response");
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      return getMockRecommendations(conditions, restrictions);
    }
  },

  /**
   * Get an explanation for why a specific food is beneficial for a health condition
   */
  async getFoodExplanation(
    food: string,
    healthCondition: string,
  ): Promise<string> {
    const currentLanguage = getCurrentLanguage();
    try {
      // For demo purposes, return mock data if API key is not set
      if (!API_KEY || !genAI) {
        console.warn("API key not set. Returning mock explanation.");
        return `${food} is beneficial for ${healthCondition} because it contains nutrients that help regulate blood pressure and improve heart health. It's rich in potassium, which helps balance sodium levels in the body.`;
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        Explain in 2-3 sentences in ${currentLanguage} why ${food} is beneficial for someone with ${healthCondition}.
        Focus on specific nutrients and mechanisms. Keep it simple but scientifically accurate.
        Responde ONLY with the explanation in ${currentLanguage} without any additional text or formatting.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Gemini response food explanation: ', text);
      return text;
    } catch (error) {
      console.error("Error getting AI explanation:", error);
      return `${food} is generally considered beneficial for people with ${healthCondition} due to its nutritional profile.`;
    }
  },

  /**
   * Generate a weekly menu based on nutrition recommendations
   */
  async getWeeklyMenu(
    healthConditions?: string[],
    dietaryRestrictions?: string[],
  ): Promise<WeeklyMenu[]> {
    const currentLanguage = getCurrentLanguage();
    try {
      // Validate API configuration first
      if (!API_KEY || !genAI) {
        console.warn("API key not set. Returning mock weekly menu.");
        return getMockWeeklyMenu();
      }
  
      // Get user profile for fallback conditions
      const userProfile = useUserProfileStore.getState();
      const conditions = healthConditions || userProfile.healthProfile.conditions;
      const restrictions = dietaryRestrictions || userProfile.healthProfile.restrictions;
  
      // Get recommendations with error handling
      let recommendations: NutritionRecommendation[] = [];
      try {
        recommendations = await this.getNutritionRecommendations(conditions, restrictions);
      } catch (error) {
        console.warn("Failed to get recommendations, using fallback foods", error);
        recommendations = getMockRecommendations(conditions, restrictions);
      }
  
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,  // More creative suggestions
          maxOutputTokens: 2000  // Ensure enough space for full response
        }
      });
  
      // Enhanced prompt with strict JSON formatting instructions
      const prompt = `
        ACT AS A NUTRITIONIST. Generate in ${currentLanguage} a weekly meal plan with these requirements:
  
        HEALTH PROFILE:
        - Conditions: ${conditions.join(", ") || "general health maintenance"}
        - Restrictions: ${restrictions.join(", ") || "none"}
  
        NUTRITION GUIDELINES:
        ${recommendations.map(rec => `
        * ${rec.title}: Prioritize these foods - ${rec.foods.join(", ")}`).join("\n")}
  
        FORMATTING REQUIREMENTS:
        - Respond with ONLY valid JSON
        - also respond in ${currentLanguage}
        - No markdown or code formatting
        - Structure must match exactly:
          [{
            "day": "Monday",
            "meals": {
              "breakfast": ["food1", "food2"],
              "lunch": ["food1", "food2", "food3"],
              "dinner": ["food1", "food2"],
              "snacks": ["food1"]
            }
          }]
        
        ADDITIONAL RULES:
        - Include 2-3 items per main meal
        - Include 1-2 snacks
        - Ensure all items are compatible with restrictions
        - Vary ingredients throughout the week
        - Focus on whole, unprocessed foods
      `;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text().trim();
  
      console.debug('Gemini response:', text);
  
      // Robust JSON extraction
      const jsonString = this.extractJsonString(text);
      if (!jsonString) {
        throw new Error("No valid JSON found in response");
      }
  
      const menuData = JSON.parse(jsonString) as WeeklyMenu[];
      
      // Validate response structure
      if (!Array.isArray(menuData) || menuData.length === 0) {
        throw new Error("Invalid menu format");
      }
  
      return menuData.map(day => ({
        day: day.day,
        meals: {
          breakfast: day.meals.breakfast || [],
          lunch: day.meals.lunch || [],
          dinner: day.meals.dinner || [],
          snacks: day.meals.snacks || []
        }
      }));
  
    } catch (error) {
      console.error("Error generating weekly menu:", error);
      // Return enriched mock data with user's conditions
      return this.getFallbackMenu(healthConditions, dietaryRestrictions);
    }
  },
  
  // Helper method to extract JSON from response
  extractJsonString(text: string): string | null {
    // Try to find complete JSON objects
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      try {
        JSON.parse(jsonMatch[0]);
        return jsonMatch[0];
      } catch (e) {
        console.warn("Found potential JSON but failed to parse", e);
      }
    }
    
    // Fallback: try to find the first complete JSON object
    const objectMatch = text.match(/\{.*\}/s);
    if (objectMatch) {
      try {
        JSON.parse(objectMatch[0]);
        return `[${objectMatch[0]}]`; // Wrap in array
      } catch (e) {
        console.warn("Found potential object but failed to parse", e);
      }
    }
    
    return null;
  },
  
  // Enhanced fallback menu generator
  getFallbackMenu(
    healthConditions?: string[],
    dietaryRestrictions?: string[]
  ): WeeklyMenu[] {
    const baseMenu = getMockWeeklyMenu();
    
    // Apply dietary restrictions to mock data
    if (dietaryRestrictions?.length) {
      return baseMenu.map(day => ({
        ...day,
        meals: this.filterRestrictedItems(day.meals, dietaryRestrictions)
      }));
    }
    
    return baseMenu;
  },
  
  filterRestrictedItems(meals: Meals, restrictions: string[]): Meals {
    const restrictionKeywords = restrictions.map(r => r.toLowerCase());
    const isRestricted = (food: string) => 
      restrictionKeywords.some(keyword => 
        food.toLowerCase().includes(keyword)
      );
  
    return {
      breakfast: meals.breakfast.filter(f => !isRestricted(f)),
      lunch: meals.lunch.filter(f => !isRestricted(f)),
      dinner: meals.dinner.filter(f => !isRestricted(f)),
      snacks: meals.snacks.filter(f => !isRestricted(f))
    };
  },


  async getGroceryList(
    food?: string,
    healthCondition?: string[],
    dietaryRestrictions?: string[],
  ): Promise<GroceryItem[]> {
    try {
      const currentLanguage = getCurrentLanguage();
      const userProfile = useUserProfileStore.getState();
      const conditions = healthCondition || userProfile.healthProfile.conditions;
      const restrictions = dietaryRestrictions || userProfile.healthProfile.restrictions;
  
      // For demo purposes, return mock data if API key is not set
      if (!API_KEY || !genAI) {
        console.warn("Using mock data for grocery list.");
        return [
          { id: 1, name: "Salmon", category: "Proteins", checked: false },
          { id: 2, name: "Walnuts", category: "Nuts", checked: false },
          { id: 3, name: "Flaxseeds", category: "Seeds", checked: false },
        ];
      }
  
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  
      const prompt = `
        Generate a grocery list in ${currentLanguage} with this: 
        ${food || "a healthy weekly meal plan"}.
  
        Consider these health conditions ${conditions.length > 0 ? conditions.join(', ') : 'general health improvement'}.
        And these dietary restrictions ${restrictions.length > 0 ? restrictions.join(', ') : 'none'}.
  
        Format the response as a JSON array with objects containing:
        - id: A unique number for each item
        - name: The name of the grocery item
        - category: The food category (e.g., Fruits, Vegetable, Grains, Proteins, Dairy, etc.)
        - checked: Always set to false
        - also respond ONLY in ${currentLanguage}
      `;
  
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
  
      console.log('Response from gemini service (grocery list): ', text);
  
      // Extract JSON from the response
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as GroceryItem[];
      }
  
      throw new Error("Could not parse AI response");
    } catch (error) {
      console.error("Error generating grocery list:", error);
      return [
        { id: 1, name: "Salmon", category: "Proteins", checked: false },
        { id: 2, name: "Walnuts", category: "Nuts", checked: false },
        { id: 3, name: "Flaxseeds", category: "Seeds", checked: false },
      ];
    }
  }
};

// Mock data for demo purposes when API key is not set
function getMockRecommendations(
  healthConditions: string[],
  dietaryRestrictions: string[],
): NutritionRecommendation[] {
  return [
    {
      title: "Increase Omega-3 Fatty Acids",
      description:
        "Incorporate foods rich in omega-3 fatty acids to support heart health and reduce inflammation.",
      benefits: [
        "Reduces inflammation",
        "Lowers blood pressure",
        "Improves cholesterol levels",
      ],
      foods: ["Salmon", "Walnuts", "Flaxseeds", "Chia seeds", "Avocados"],
    },
    {
      title: "Focus on Low Glycemic Foods",
      description:
        "Choose foods with a low glycemic index to help maintain stable blood sugar levels.",
      benefits: [
        "Prevents blood sugar spikes",
        "Provides sustained energy",
        "Reduces insulin resistance",
      ],
      foods: ["Quinoa", "Lentils", "Sweet potatoes", "Berries", "Greek yogurt"],
    },
    {
      title: "Increase Soluble Fiber Intake",
      description:
        "Add more soluble fiber to your diet to help lower cholesterol and improve digestive health.",
      benefits: [
        "Lowers LDL cholesterol",
        "Improves gut health",
        "Helps control blood sugar",
      ],
      foods: ["Oats", "Beans", "Apples", "Carrots", "Barley"],
    },
  ];
}

// Mock data for weekly menu
function getMockWeeklyMenu(): WeeklyMenu[] {
  return [
    {
      day: "Monday",
      meals: {
        breakfast: ["Oatmeal with berries", "Greek yogurt"],
        lunch: ["Grilled salmon", "Quinoa salad"],
        dinner: ["Baked sweet potatoes", "Steamed broccoli"],
        snacks: ["Walnuts", "Apple slices"],
      },
    },
    {
      day: "Tuesday",
      meals: {
        breakfast: ["Avocado toast", "Smoothie with chia seeds"],
        lunch: ["Lentil soup", "Whole grain bread"],
        dinner: ["Grilled chicken", "Steamed carrots"],
        snacks: ["Flaxseed crackers", "Greek yogurt"],
      },
    },
    // Add more days as needed...
  ];
}