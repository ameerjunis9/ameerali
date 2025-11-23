import { GoogleGenAI, Type } from "@google/genai";
import { Address } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseAddressWithGemini = async (rawText: string): Promise<Address | null> => {
  try {
    const model = "gemini-2.5-flash";
    const prompt = `Parse the following unstructured address text into a structured JSON object. 
    Strictly IGNORE any Zip Codes or Postal Codes; do not include them in city or state. 
    If a field is missing, leave it as an empty string. 
    Infer the country if not specified based on state/city (default to US). 
    Extract phone number if present. 
    Text: "${rawText}"`;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fullName: { type: Type.STRING },
            street: { type: Type.STRING },
            city: { type: Type.STRING },
            state: { type: Type.STRING },
            country: { type: Type.STRING },
            phoneNumber: { type: Type.STRING },
          },
          required: ["fullName", "street", "city", "state"],
        },
      },
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as Address;
  } catch (error) {
    console.error("Error parsing address with Gemini:", error);
    return null;
  }
};

export const generateTrackingNumber = (): string => {
  // Simulation of a tracking number generation
  const prefix = "1Z";
  const random = Math.random().toString(36).substring(2, 10).toUpperCase();
  const suffix = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${prefix}${random}${suffix}`;
};