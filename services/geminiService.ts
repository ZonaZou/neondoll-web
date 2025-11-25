import { GoogleGenAI } from "@google/genai";

// 修改重點：改成 import.meta.env.VITE_GEMINI_API_KEY
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

const MODEL_NAME = 'gemini-2.5-flash-image';

/**
 * Helper to parse base64 data URI into mimeType and data
 */
const parseBase64 = (dataUri: string) => {
  const matches = dataUri.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    return null;
  }
  return { mimeType: matches[1], data: matches[2] };
};

export const generateCharacterImage = async (outfitDescription: string, baseImageBase64?: string): Promise<string> => {
  if (!apiKey) {
    console.error("API Key is missing! Check Vercel Environment Variables.");
    throw new Error("API Key is missing");
  }

  const parts: any[] = [];
  let prompt = "";

  if (baseImageBase64) {
    // EDIT MODE: Keep identity, change clothes
    const imageObj = parseBase64(baseImageBase64);
    if (!imageObj) throw new Error("Invalid base image format");

    parts.push({
      inlineData: {
        mimeType: imageObj.mimeType,
        data: imageObj.data
      }
    });

    prompt = `
      Update this image by changing the character's clothing to: ${outfitDescription}.
      CRITICAL INSTRUCTIONS:
      1. KEEP THE FACE, HAIRSTYLE, BODY POSE, AND BACKGROUND EXACTLY THE SAME.
      2. The character must remain the SAME PERSON.
      3. Only the outfit should change.
      4. Maintain the cyberpunk aesthetic and lighting.
      5. Output high quality, 8k resolution.
    `;
  } else {
    // CREATION MODE: Generate Base Character
    prompt = `
      Full body cinematic shot of a beautiful young cyberpunk female character with very long, stylish flowing hair standing perfectly in the center of the frame.
      She is facing forward with a confident, cool expression.
      Clothing: ${outfitDescription}.
      Appearance: Very long hair (hip-length, dyed neon tips), glowing cybernetic lines on her skin, attractive features.
      Background: A dark, blurred neon-lit cyberpunk city street. 
      Lighting: Dramatic neon pink and cyan rim lighting.
      Composition: Perfectly centered, symmetrical, vertical portrait.
      Quality: Masterpiece, 8k resolution, highly detailed, photorealistic, trending on artstation.
    `;
  }

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: {
        parts: parts,
      },
      config: {
        // We don't set aspect ratio here because for image input (edit), it usually follows the source image aspect.
        // For text-to-image, the model defaults are usually square or determined by prompt/training. 
        // 'gemini-2.5-flash-image' is flexible.
      },
    });

    // Check for image parts
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    throw new Error("No image data returned from Gemini.");

  } catch (error) {
    console.error("Gemini Image Generation Error:", error);
    throw error;
  }
};
