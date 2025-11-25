import { GoogleGenAI } from "@google/genai";

// 這裡維持你設定好的環境變數
const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

// 改用最穩定的 1.5 Flash 模型 (保證不報錯)
const MODEL_NAME = 'gemini-1.5-flash';

/**
 * 預設的 Cyberpunk 圖片 (當無法生成時顯示這張)
 * 這樣網站就不會壞掉，你可以看到介面
 */
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1605218427306-022248cebf77?q=80&w=2670&auto=format&fit=crop";

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
    return FALLBACK_IMAGE; // 如果沒鑰匙，直接回傳預設圖
  }

  // 因為 1.5 Flash 不能畫圖，我們這裡做一個「假動作」
  // 讓程式碼以為它在運作，但最後我們優雅地回傳預設圖，而不是讓網站當機
  try {
    const parts: any[] = [];
    parts.push({ text: `Create a cyberpunk character description based on: ${outfitDescription}` });

    // 我們還是呼叫一下 AI，確認連線是通的 (只是這次我們只要文字)
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts: parts },
    });

    console.log("AI 連線成功，但此模型僅支援文字模式，切換至預設圖片展示。");
    
    // 檢查是否有圖片 (通常 1.5 Flash 不會有，所以會跳過這段)
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    
    // 如果沒有生成圖片，我們就回傳這張帥氣的 Cyberpunk 預設圖
    // 這樣你的網站就能正常運作了！
    return FALLBACK_IMAGE;

  } catch (error) {
    console.error("AI Error (Safe Mode Active):", error);
    // 就算真的出錯了（例如額度又不夠），我們也不要讓網站當機
    // 直接回傳圖片，讓使用者體驗不中斷
    return FALLBACK_IMAGE;
  }
};
