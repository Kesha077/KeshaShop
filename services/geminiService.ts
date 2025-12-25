import { GoogleGenAI } from "@google/genai";
import { ImageSize } from "../types";

// Helper to manage the API key selection flow
export const ensureApiKey = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    const hasKey = await win.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await win.aistudio.openSelectKey();
    }
  } else {
    // Fallback or development environment handling if window.aistudio is not available
    console.warn("window.aistudio is not available. Ensure API_KEY is set in environment.");
  }
};

export const generateProductImage = async (prompt: string, size: ImageSize): Promise<string | null> => {
  try {
    // 1. Ensure API Key is selected
    await ensureApiKey();

    // 2. Initialize Client with the key from process.env (injected by the environment after selection)
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    // 3. Call the API
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: size, // 1K, 2K, or 4K
        },
      },
    });

    // 4. Extract Image
    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    return null;

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found")) {
        // Reset key logic if possible or alert user
        alert("API Key invalid or expired. Please re-select.");
        const win = window as any;
        if(win.aistudio?.openSelectKey) await win.aistudio.openSelectKey();
    }
    throw error;
  }
};