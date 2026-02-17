import { GoogleGenerativeAI } from "@google/generative-ai";

export const callGemini = async (persona: string, material: string) => {
  const config = useRuntimeConfig();
  
  const genAI = new GoogleGenerativeAI(config.geminiApiKey);
  
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    systemInstruction: persona, 
  });

  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: material }] }],
    generationConfig: {
      temperature: 0.9, 
      maxOutputTokens: 200,
    },
  });

  return result.response.text();
};