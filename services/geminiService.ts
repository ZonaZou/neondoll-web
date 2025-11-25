/**
 * 最終極簡版
 * 解決 CORS 問題：不再嘗試下載圖片，直接回傳網址
 * 解決 500 問題：簡化提示詞，移除換行符號
 */

export const generateCharacterImage = async (outfitDescription: string, baseImageBase64?: string): Promise<string> => {
  
  // 1. 設定一張絕對穩定的預設圖 (Unsplash 高畫質圖源)
  // 當沒有衣服描述，或是發生任何意外時，就顯示這張
  const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1605218427306-022248cebf77?q=80&w=2670&auto=format&fit=crop";

  // 如果沒有描述，直接回傳預設圖
  if (!outfitDescription) {
    console.log("初始化：使用預設圖");
    return FALLBACK_IMAGE;
  }

  try {
    // 2. 簡化提示詞 (Prompt)
    // 移除所有換行符號，避免伺服器看不懂 (解決 500 錯誤)
    // 我們只保留最關鍵的英文關鍵字
    const cleanDescription = outfitDescription.replace(/\n/g, " ").replace(/[^\w\s,]/gi, ""); 
    
    const prompt = `Cyberpunk female character, ${cleanDescription}, neon city background, glowing implants, masterpiece, 8k, photorealistic, vertical portrait`;
    
    // 3. 產生隨機數，確保每次圖片不一樣
    const seed = Math.floor(Math.random() * 1000000);

    // 4. 組合網址
    // 使用 flux 模型 (畫質最好)
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=1024&seed=${seed}&model=flux&nologo=true`;

    console.log("回傳圖片網址:", imageUrl);

    // 5. 【關鍵修改】直接回傳網址！
    // 不要做任何 fetch 或 base64 轉換，這樣就不會被 CORS 擋住
    return imageUrl;

  } catch (error) {
    console.error("生成網址發生錯誤:", error);
    return FALLBACK_IMAGE;
  }
};
