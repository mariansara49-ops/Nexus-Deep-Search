import { GoogleGenAI } from "@google/genai";
import { Source, GroundingChunk } from "../types";

const API_KEY = process.env.API_KEY || '';

if (!API_KEY) {
  console.warn("Missing API_KEY environment variable. App will fail to fetch data.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const performDeepSearch = async (
  query: string,
  useProModel: boolean = false
): Promise<{ text: string; sources: Source[] }> => {
  try {
    // gemini-2.5-flash is great for speed and general search grounding.
    // gemini-3-pro-preview is better for complex reasoning, but Flash is usually sufficient for search aggregation.
    // We will allow switching if needed, but default to Flash for responsiveness.
    const modelId = useProModel ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';

    const response = await ai.models.generateContent({
      model: modelId,
      contents: query,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" is NOT allowed with googleSearch
      },
    });

    const text = response.text || "No results found.";
    
    // Extract grounding chunks
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
    
    const sources: Source[] = [];
    if (groundingChunks) {
      groundingChunks.forEach((chunk) => {
        if (chunk.web && chunk.web.uri && chunk.web.title) {
          // Avoid duplicates
          if (!sources.find(s => s.uri === chunk.web?.uri)) {
             sources.push({
              title: chunk.web.title,
              uri: chunk.web.uri,
            });
          }
        }
      });
    }

    return { text, sources };
  } catch (error: any) {
    console.error("Deep Search Error:", error);
    throw new Error(error.message || "An unexpected error occurred during the search.");
  }
};