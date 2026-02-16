
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const getGiftGuide = async (products: any[]) => {
  const ai = getAI();
  if (!ai) return "Our curated collection features the latest in smart technology and lifestyle design. Explore our featured items to find the perfect gift for your loved ones.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are a helpful gift shop assistant for "Trendy Gadgets". Given these products: ${products.map(p => p.name).join(', ')}, write a short, trendy, and enthusiastic 2-sentence gift guide snippet highlighting why these are great gifts for tech enthusiasts.`,
    });
    return response.text || "Discover our handpicked selection of premium gadgets designed for the modern lifestyle.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Experience the perfect blend of innovation and elegance with our exclusive gadget collection.";
  }
};

export const getSmartRecommendations = async (userInput: string, products: any[]) => {
  const ai = getAI();
  if (!ai) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `A user is looking for: "${userInput}". Based on our inventory: ${JSON.stringify(products)}, return a JSON array of the top 3 product IDs that match their needs best.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    return [];
  }
};
