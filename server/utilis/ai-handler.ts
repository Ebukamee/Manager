import { GoogleGenAI } from "@google/genai";

export const callGemini = async (persona: string, material: string) => {
  const config = useRuntimeConfig();
  
  const ai = new GoogleGenAI({
    apiKey: config.geminiApiKey
  });

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        role: "user",
        parts: [
          { text: `System Instruction: ${persona}` },
          { text: `Data to Roast: ${material}` }
        ]
      }
    ],
    config: {
      temperature: 0.9,
      maxOutputTokens: 1500, 
    }
  });

  return response.text;
};