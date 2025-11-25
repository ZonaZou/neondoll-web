import React, { useState } from 'react'; // 修正1: 拿掉沒用到的 useEffect
import { generateCharacterImage } from './services/geminiService';

const DEFAULT_IMAGE = "https://images.unsplash.com/photo-1605218427306-022248cebf77?q=80&w=2670&auto=format&fit=crop";

function App() {
  const [characterImage, setCharacterImage] = useState<string>(DEFAULT_IMAGE);
  const [isLoading, setIsLoading] = useState(false);
  // 修正2: 移除了原本沒用到的 [prompt, setPrompt]

  const handleGenerate = async (clothing: string) => {
    setIsLoading(true);
    try {
      const result = await generateCharacterImage(clothing);
      setCharacterImage(result);
    } catch (error) {
      console.error("生成失敗", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-mono p-4 md:p-8 flex flex-col items-center">
      
      {/* 標題區 */}
      <div className="w-full max-w-6xl mb-8 flex justify-between items-end border-b border-gray-800 pb-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-600 animate-pulse">
            NEONDOLL
          </h1>
          <p className="text-gray-500 text-xs tracking-widest mt-2">CYBERNETIC FASHION SIMULATOR V.2.0.77</p>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-cyan-500 text-xs">SYS.STATUS: ONLINE</p>
          <p className="text-gray-600 text-xs">MEM: 64TB // CPU: QUANTUM</p>
        </div>
      </div>

      {/* 主要內容區 */}
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* 左側選單 */}
        <div className="lg:col-span-3 space-y-4">
          <h2 className="text-purple-400 border-l-4 border-purple-500 pl-3 mb-6 text-xl font-bold">SELECT WARDROBE</h2>
          
          {[
            { name: "ACADEMY UNIFORM", desc: "Neo-Tokyo High School Uniform", prompt: "wearing japanese school uniform, plaid skirt, high tech headphones" },
            { name: "CORPO SUIT", desc: "Arasaka Style Executive Wear", prompt: "wearing formal black business suit, pencil skirt, tactical glasses" },
            { name: "EVA ARMOR", desc: "Orbital Station EVA Suit", prompt: "wearing white glossy sci-fi space armor, tight fit, glowing lights" },
            { name: "NIGHT CITY STREET", desc: "Casual Streetwear", prompt: "wearing oversized bomber jacket, crop top, cargo pants, sneakers" },
            { name: "NETRUNNER SUIT", desc: "Deep Dive Interface Suit", prompt: "wearing tight latex bodysuit, glowing circuit lines, data cables connected" },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => handleGenerate(item.prompt)}
              disabled={isLoading}
              className="w-full text-left p-4 border border-gray-800 bg-gray-900/50 hover:bg-gray-800 hover:border-cyan-500 transition-all duration-300 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-cyan-500/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-300" />
              <h3 className="text-cyan-400 font-bold group-hover:text-cyan-300">{item.name}</h3>
              <p className="text-gray-500 text-xs mt-1">{item.desc}</p>
            </button>
          ))}
        </div>

        {/* 中間人物區 */}
        <div className="lg:col-span-6 relative aspect-[3/4] rounded-lg overflow-hidden border-2 border-gray-800 shadow-[0_0_20px_rgba(0,255,255,0.1)]">
          <img 
            src={characterImage} 
            alt="Cyberpunk Character" 
            className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-50 blur-sm' : 'opacity-100'}`}
          />
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm z-10">
              <div className="w-16 h-16 border-4 border-t-cyan-500 border-r-purple-500 border-b-yellow-400 border-l-transparent rounded-full animate-spin"></div>
              <p className="text-cyan-400 mt-4 text-sm animate-pulse tracking-widest">GENERATING SUBJECT...</p>
            </div>
          )}
          {/* UI 裝飾 */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-purple-500"></div>
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-purple-500"></div>
        </div>

        {/* 右側裝飾區 */}
        <div className="lg:col-span-3 space-y-6 hidden lg:block">
          <div className="border border-gray-800 p-4 bg-gray-900/30">
            <h3 className="text-gray-500 text-xs mb-2">CACHE_MEMORY</h3>
            <div className="h-32 border border-gray-800 border-dashed flex items-center justify-center text-gray-700 text-xs">
              NO DATA
            </div>
          </div>
           <div className="border border-gray-800 p-4 bg-gray-900/30">
            <h3 className="text-gray-500 text-xs mb-2">CURRENT_PROTOCOL</h3>
            <p className="text-cyan-500 text-xs font-mono leading-relaxed">
              > CONNECTING TO NEURAL NET...<br/>
              > SYNCING WARDROBE DATA...<br/>
              > READY FOR INPUT.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default App;
