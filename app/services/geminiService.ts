import { GoogleGenerativeAI } from '@google/generative-ai';

// Note: In a production app, you would store this in an environment variable
// For this demo, we're using mock data
const API_KEY = process.env.GOOGLE_GEMINI_API_KEY; 
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;


// Mock implementation for demo purposes
// const genAI = {
//   getGenerativeModel: () => ({
//     generateContent: async () => ({
//       response: {
//         text: () => JSON.stringify(getMockRecommendations([], [])),
//       },
//     }),
//   }),
// };

export interface NutritionRecommendation {
  title: string;
  description: string;
  benefits: string[];
  foods: string[];
}

export const geminiService = {
  /**
   * Get personalized nutrition recommendations based on health conditions
   */
  async getNutritionRecommendations(
    healthConditions: string[],
    dietaryRestrictions: string[],
  ): Promise<NutritionRecommendation[]> {
    try {
      // For demo purposes, return mock data if API key is not set
      if (API_KEY) {
        return getMockRecommendations(healthConditions, dietaryRestrictions);
      }

      if (!genAI) {
        throw new Error("genAI is not initialized. Please check the API key.");
      }

      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const prompt = `
        Generate 3 personalized nutrition recommendations for someone with the following health conditions: 
        ${healthConditions.join(", ")}.
        
        They have these dietary restrictions: ${dietaryRestrictions.join(", ")}.
        
        Format the response as a JSON array with objects containing:
        - title: A short title for the recommendation
        - description: A brief explanation (1-2 sentences)
        - benefits: An array of 2-3 specific health benefits
        - foods: An array of 5 specific foods that fulfill this recommendation
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      console.log('response from gemini service', text)

      // Extract JSON from the response
      const jsonMatch = text.match(/\[\s*\{.*\}\s*\]/s);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      throw new Error("Could not parse AI response");
    } catch (error) {
      console.error("Error getting AI recommendations:", error);
      return getMockRecommendations(healthConditions, dietaryRestrictions);
    }
  },

  /**
   * Get an explanation for why a specific food is beneficial for a health condition
   */
  async getFoodExplanation(
    food: string,
    healthCondition: string,
  ): Promise<string> {
    try {
      // For demo purposes, return mock data if API key is not set
      if (API_KEY === "YOUR_GEMINI_API_KEY") {
        return `${food} is beneficial for ${healthCondition} because it contains nutrients that help regulate blood pressure and improve heart health. It's rich in potassium, which helps balance sodium levels in the body.`;
      }

      if (!genAI) {
        throw new Error("genAI is not initialized. Please check the API key.");
      }
      const model = genAI.getGenerativeModel({ model: "gemini-flash-2.0" });

      const prompt = `
        Explain in 2-3 sentences why ${food} is beneficial for someone with ${healthCondition}.
        Focus on specific nutrients and mechanisms. Keep it simple but scientifically accurate.
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Error getting AI explanation:", error);
      return `${food} is generally considered beneficial for people with ${healthCondition} due to its nutritional profile.`;
    }
  },
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
