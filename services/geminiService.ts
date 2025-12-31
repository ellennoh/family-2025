
import { GoogleGenAI, Type } from "@google/genai";
import { Memory, CategoryType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateYearlyReview = async (memories: Memory[]) => {
  const model = "gemini-3-flash-preview";
  
  const memoriesContext = memories.map(m => `[${m.category}] ${m.author}: ${m.content}`).join("\n");

  const prompt = `
    As a professional family storyteller, analyze the following family memories from the year 2025 and create a heartwarming, cinematic, and fun "Year in Review" report.
    
    Memories:
    ${memoriesContext}
    
    The response must be in JSON format and include:
    1. A 'summary' (a narrative of the family's journey in 2025).
    2. A 'keywords' array (3-5 core themes of the year).
    3. A 'suggestedPlaylist' (A conceptual title and description for their year's soundtrack).
  `;

  const response = await ai.models.generateContent({
    model: model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
          suggestedPlaylist: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING }
            }
          }
        },
        required: ["summary", "keywords", "suggestedPlaylist"]
      }
    }
  });

  return JSON.parse(response.text) as any;
};

export const describeMemoryImage = async (base64Image: string) => {
  const model = "gemini-3-flash-preview";
  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
        { text: "Describe this family memory in one heartwarming sentence for a photobook." }
      ]
    }
  });
  return response.text;
};
