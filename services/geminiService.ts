/**
 * Pollinations AI Service (完全免費版)
 * 使用 Pollinations.ai 的公開 API，無需 API Key
 */

// 輔助函式：把網路圖片轉成 Base64 格式 (因為你的網站需要這種格式)
const imageUrlToBase64 = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generateCharacterImage = async (outfitDescription: string, baseImageBase64?: string): Promise<string> => {
  
  // 1. 準備提示詞 (Prompt)
  // 我們把你的衣服描述加上 Cyberpunk 的關鍵字，確保畫風統一
  const corePrompt = `
    Best quality, masterpiece, 8k, photorealistic, cyberpunk style.
    A beautiful young female cyberpunk character with long colorful hair.
    Wearing: ${outfitDescription}.
    Background: Neon lit cyberpunk city street, dark atmosphere, volumetric lighting.
    Cybernetic implants, glowing skin lines, futuristic fashion.
    (vertical aspect ratio), detailed face, cinematic shot.
  `;

  // 2. 隨機生成一個種子碼，確保每次按鈕按下去都有變化
  const seed = Math.floor(Math.random() * 1000000);

  // 3. 組合 Pollinations 的網址
  // model=flux (目前免費中最強的模型)
  // width/height 設定為直式人像
  const encodedPrompt = encodeURIComponent(corePrompt);
  const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=768&height=1024&seed=${seed}&model=flux&nologo=true`;

  console.log("正在請求 Pollinations AI 生成圖片:", imageUrl);

  try {
    // 4. 下載圖片並轉成你的網站看得懂的格式
    const base64Image = await imageUrlToBase64(imageUrl);
    return base64Image;

  } catch (error) {
    console.error("Pollinations 生成失敗:", error);
    // 萬一真的失敗，回傳一張預設圖
    return "https://images.unsplash.com/photo-1605218427306-022248cebf77?q=80&w=2670&auto=format&fit=crop";
  }
};
