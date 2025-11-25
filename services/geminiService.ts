/**
 * 終極穩定版 AI Service
 * 結合預設圖片與 Pollinations AI，確保網站永遠有圖看！
 */

// 這張是我們選定的超帥氣 Cyberpunk 女生預設圖
const FALLBACK_IMAGE = "https://pollinations.ai/p/A_beautiful_young_cyberpunk_female_character_with_long_colorful_hair_and_glowing_cybernetic_implants_standing_in_a_neon_lit_city_street_at_night_Wearing_a_detailed_futuristic_jacket_and_techwear_Masterpiece_8k_photorealistic_cinematic_lighting?width=768&height=1024&model=flux&seed=12345&nologo=true";

// 輔助函式：把網路圖片轉成 Base64 格式
const imageUrlToBase64 = async (url: string): Promise<string> => {
  try {
    // 設定一個 15 秒的超時，避免等太久
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId); // 成功就清除計時器

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("圖片下載失敗:", error);
    // 如果下載失敗，就回傳 null，讓後面的程式知道要用預設圖
    return null; 
  }
};

export const generateCharacterImage = async (outfitDescription: string, baseImageBase64?: string): Promise<string> => {
  
  // 1. 如果沒有傳入衣服描述（例如剛打開網站時），直接回傳預設圖
  if (!outfitDescription) {
    console.log("初始化：載入預設 Cyberpunk 圖片");
    const base64 = await imageUrlToBase64(FALLBACK_IMAGE);
    return base64 || FALLBACK_IMAGE; // 雙重保險
  }

  // 2. 準備互動生成的提示詞 (Prompt)
  const corePrompt = `
    Best quality, masterpiece, 8k, photorealistic, cyberpunk style.
    A beautiful young female cyberpunk character with long colorful hair.
    Wearing: ${outfitDescription}.
    Background: Neon lit cyberpunk city street, dark atmosphere, volumetric lighting.
    Cybernetic implants, glowing skin lines, futuristic fashion.
    (vertical aspect ratio), detailed face, cinematic shot.
  `;

  const seed = Math.floor(Math.random() * 1000000);
  const encodedPrompt = encodeURIComponent(corePrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=1024&seed=${seed}&model=flux&nologo=true`;

  console.log("嘗試生成互動圖片:", imageUrl);

  try {
    // 3. 嘗試生成新圖片
    const base64Image = await imageUrlToBase64(imageUrl);
    
    // 如果成功生成並轉換，就回傳新圖片
    if (base64Image) {
      return base64Image;
    } else {
      // 如果轉換失敗，拋出錯誤，讓下面的 catch 去處理
      throw new Error("無法轉換生成的圖片");
    }

  } catch (error) {
    // 4. 如果生成過程有任何問題，優雅地退回預設圖片
    console.error("互動生成失敗，切換回預設圖片:", error);
    const fallbackBase64 = await imageUrlToBase64(FALLBACK_IMAGE);
    return fallbackBase64 || FALLBACK_IMAGE; // 最終保險
  }
};
