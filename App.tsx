import React, { useState, useEffect, useCallback } from 'react';
import { OutfitType, OutfitDefinition } from './types';
import { generateCharacterImage } from './services/geminiService';
import CyberButton from './components/CyberButton';
import ScannerEffect from './components/ScannerEffect';

// Constants
const OUTFITS: OutfitDefinition[] = [
  {
    id: OutfitType.BASE,
    label: "SYSTEM INITIALIZATION",
    description: "Bio-synthetic base layer. Minimalist cybernetic mesh bodysuit.",
    promptModifier: "minimalist high-tech white and black tight bodysuit underwear, visible cybernetic joints, data cables connected to skin",
    icon: "🔌"
  },
  {
    id: OutfitType.SCHOOL,
    label: "ACADEMY UNIFORM",
    description: "Neo-Tokyo high school uniform. Plaid skirt with LED accents.",
    promptModifier: "futuristic japanese school uniform, glowing pleated skirt, holographic ribbon, high-tech sneakers, tactical backpack",
    icon: "🎒"
  },
  {
    id: OutfitType.OFFICE,
    label: "CORPO SUIT",
    description: "Arasaka style executive wear. Sharp lines, formidable.",
    promptModifier: "sleek black corporate business suit with angular shoulder pads, augmented reality glasses, data pad, high heels, powerful aura",
    icon: "💼"
  },
  {
    id: OutfitType.SPACE,
    label: "EVA ARMOR",
    description: "Orbital station EVA suit. Bulky but agile.",
    promptModifier: "white and orange astronaut extra-vehicular activity suit, semi-transparent helmet, life support tubes, zero-gravity floating",
    icon: "🚀"
  },
  {
    id: OutfitType.STREET,
    label: "NIGHT CITY STREET",
    description: "Rebel bomber jacket and cargo pants.",
    promptModifier: "oversized holographic bomber jacket, ripped tactical cargo pants, industrial boots, neon gas mask hanging on neck",
    icon: "🎧"
  },
  {
    id: OutfitType.NETRUNNER,
    label: "NETRUNNER SUIT",
    description: "Full dive cooling suit. Sleek, shiny latex.",
    promptModifier: "tight glossy black latex netrunner diving suit, glowing circuitry patterns on fabric, neural link interface cables on head",
    icon: "💻"
  },
  {
    id: OutfitType.EVENING,
    label: "NEON GALA DRESS",
    description: "High-fashion holographic evening gown.",
    promptModifier: "elegant floor-length holographic dress that shifts colors, fiber-optic shawl, glowing jewelry, high fashion cyber-couture",
    icon: "💃"
  }
];

const App: React.FC = () => {
  const [currentOutfit, setCurrentOutfit] = useState<OutfitType>(OutfitType.BASE);
  const [baseImage, setBaseImage] = useState<string | null>(null); // Stores the underwear version
  const [generatedImage, setGeneratedImage] = useState<string | null>(null); // Stores the currently shown version
  const [modalImage, setModalImage] = useState<string | null>(null); // For zoomed view
  const [isZoomed, setIsZoomed] = useState<boolean>(false); // Tracks if modal is deeply zoomed
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("WAITING FOR INPUT...");
  const [history, setHistory] = useState<string[]>([]);

  // Function to handle generation
  const handleGenerate = useCallback(async (outfitId: OutfitType) => {
    if (isLoading) return;
    
    // Logic to prevent generating other outfits before base is ready
    if (outfitId !== OutfitType.BASE && !baseImage) {
      console.warn("Base image not ready");
      return;
    }

    // Optimization: If selecting Base and we have Base, just restore it
    if (outfitId === OutfitType.BASE && baseImage) {
      setGeneratedImage(baseImage);
      setCurrentOutfit(OutfitType.BASE);
      return;
    }
    
    const outfit = OUTFITS.find(o => o.id === outfitId);
    if (!outfit) return;

    setCurrentOutfit(outfitId);
    setIsLoading(true);
    setLoadingText(`COMPILING ASSETS: ${outfit.label}...`);

    try {
      // Simulate steps for effect
      setTimeout(() => setLoadingText("RENDERING GEOMETRY..."), 800);
      setTimeout(() => setLoadingText("APPLYING TEXTURES..."), 2000);
      
      // If we are generating BASE, we pass undefined for baseImage (creates new).
      // If we are generating other outfits, we pass the baseImage (edits existing).
      const imageBase64 = await generateCharacterImage(
        outfit.promptModifier, 
        outfitId === OutfitType.BASE ? undefined : (baseImage || undefined)
      );
      
      setGeneratedImage(imageBase64);
      
      // If we just generated the BASE outfit, save it as the source of truth
      if (outfitId === OutfitType.BASE) {
        setBaseImage(imageBase64);
      }

      setHistory(prev => [imageBase64, ...prev].slice(0, 5)); // Keep last 5
    } catch (error) {
      console.error(error);
      alert("System Failure: Neural Link Disconnected (API Error)");
      setLoadingText("ERROR");
    } finally {
      setIsLoading(false);
      setLoadingText("READY");
    }
  }, [isLoading, baseImage]);

  // Initial load - Generate Base Character
  useEffect(() => {
    if (!baseImage) {
      handleGenerate(OutfitType.BASE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (img: string) => {
    setModalImage(img);
    setIsZoomed(false);
  };

  const closeModal = () => {
    setModalImage(null);
    setIsZoomed(false);
  };

  return (
    <div className="min-h-screen bg-cyber-black text-white font-mono flex flex-col items-center justify-center p-4 md:p-8 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
      
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-end mb-8 border-b border-cyber-slate pb-4">
        <div>
          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)]">
            NEON<span className="text-fuchsia-500">DOLL</span>
          </h1>
          <p className="text-cyan-700 text-sm tracking-widest mt-2">CYBERNETIC FASHION SIMULATOR V.2.0.77</p>
        </div>
        <div className="hidden md:block text-right">
          <div className="text-xs text-cyber-neon animate-pulse">SYS.STATUS: ONLINE</div>
          <div className="text-xs text-gray-500">MEM: 64TB // CPU: QUANTUM</div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Controls */}
        <section className="lg:col-span-4 space-y-4">
          <div className="bg-cyber-dark border border-cyber-slate p-4 rounded-lg shadow-2xl relative overflow-hidden">
            <h2 className="text-xl text-fuchsia-400 font-bold mb-4 border-l-4 border-fuchsia-500 pl-3 uppercase flex justify-between items-center">
              <span>Select Wardrobe</span>
              {!baseImage && !isLoading && <span className="text-[10px] text-yellow-500 animate-pulse">INITIALIZING...</span>}
            </h2>
            
            <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {OUTFITS.map((outfit) => {
                // Disable buttons if base image isn't generated yet (except Base button itself)
                const isLocked = !baseImage && outfit.id !== OutfitType.BASE;
                
                return (
                  <CyberButton
                    key={outfit.id}
                    label={outfit.label}
                    subLabel={isLocked ? "LOCKED - AWAITING SUBJECT" : (outfit.icon + " " + outfit.description.substring(0, 30) + "...")}
                    isActive={currentOutfit === outfit.id}
                    onClick={() => handleGenerate(outfit.id)}
                    disabled={isLoading || isLocked}
                    color={currentOutfit === outfit.id ? 'pink' : 'cyan'}
                  />
                );
              })}
            </div>

            {/* Decorative decorative lines */}
            <div className="absolute bottom-2 right-2 flex space-x-1">
               <div className="w-8 h-1 bg-cyan-500/50"></div>
               <div className="w-4 h-1 bg-fuchsia-500/50"></div>
            </div>
          </div>

          {/* Prompt Info */}
          <div className="p-4 border border-dashed border-gray-700 rounded bg-black/50 text-xs text-gray-400 font-mono">
            <span className="text-cyan-500 block mb-1">CURRENT_PROTOCOL:</span>
            {isLoading ? (
               <span className="animate-pulse">{loadingText}</span>
            ) : (
               <span>{OUTFITS.find(o => o.id === currentOutfit)?.promptModifier}</span>
            )}
            <div className="mt-2 pt-2 border-t border-gray-800 text-[10px] text-gray-600">
              {baseImage ? "SUBJECT_LOCKED // IDENTITY_PRESERVED" : "SUBJECT_INITIALIZATION_PENDING"}
            </div>
          </div>
        </section>

        {/* Center Column: Display */}
        <section className="lg:col-span-5 flex flex-col items-center">
          <div 
            className={`relative w-full aspect-[3/4] bg-gray-900 rounded-xl overflow-hidden border-2 border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] group transition-transform duration-300 ${!isLoading && generatedImage ? 'cursor-zoom-in hover:scale-[1.02]' : ''}`}
            onClick={() => {
              if (generatedImage && !isLoading) {
                openModal(generatedImage);
              }
            }}
          >
            
            {/* Background Placeholder */}
            {!generatedImage && !isLoading && (
              <div className="absolute inset-0 flex items-center justify-center text-gray-700 bg-black">
                <div className="text-center">
                   <span className="text-4xl animate-pulse block mb-2">NO_SIGNAL</span>
                   <span className="text-xs text-cyan-900">INITIALIZING NEURAL LINK...</span>
                </div>
              </div>
            )}

            {/* Image */}
            {generatedImage && (
              <img 
                src={generatedImage} 
                alt="Generated Character" 
                className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-50 grayscale blur-sm' : 'opacity-100'}`}
              />
            )}

            {/* Loader Overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm z-30 pointer-events-none">
                <div className="w-16 h-16 border-4 border-t-fuchsia-500 border-r-cyan-500 border-b-yellow-400 border-l-transparent rounded-full animate-spin mb-4"></div>
                <div className="text-cyan-400 font-bold tracking-widest animate-pulse">{loadingText}</div>
                <div className="mt-2 text-xs text-fuchsia-500 font-mono">
                    {currentOutfit === OutfitType.BASE ? "GENERATING SUBJECT..." : "WEAVING FABRIC DATA..."}
                </div>
              </div>
            )}

            {/* Overlay UI Effects */}
            <ScannerEffect />
            
            {/* UI HUD Elements inside the image frame */}
            <div className="absolute top-4 left-4 z-20 pointer-events-none">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${isLoading ? 'bg-yellow-500 animate-ping' : 'bg-green-500'}`}></div>
                <span className="text-[10px] bg-black/50 px-2 py-1 rounded text-white backdrop-blur-md border border-white/10">
                  CAM_01 // {baseImage ? "LOCKED" : "SCANNING"}
                </span>
              </div>
            </div>
            
            {/* Click hint (only if image exists and not loading) */}
            {!isLoading && generatedImage && (
              <div className="absolute top-4 right-4 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] bg-cyan-900/80 px-2 py-1 rounded text-cyan-100 backdrop-blur-md border border-cyan-400/30">
                  [CLICK TO ENLARGE]
                </span>
              </div>
            )}
            
            {/* Crosshair Center */}
            <div className="absolute top-1/2 left-1/2 w-20 h-20 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-30">
                <div className="absolute top-0 left-1/2 w-[1px] h-full bg-cyan-500"></div>
                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-cyan-500"></div>
                <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-cyan-500"></div>
                <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-cyan-500"></div>
                <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-cyan-500"></div>
                <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-cyan-500"></div>
            </div>
            
            <div className="absolute bottom-4 right-4 z-20 text-right pointer-events-none">
              <div className="text-[10px] text-cyan-300 font-bold">OUTFIT_ID: {currentOutfit}</div>
              <div className="text-[9px] text-gray-400">Render Time: {new Date().toLocaleTimeString()}</div>
            </div>

          </div>
        </section>

        {/* Right Column: History */}
        <section className="lg:col-span-3 space-y-4">
           <div className="bg-cyber-dark border border-cyber-slate p-4 rounded-lg h-full">
              <h3 className="text-sm text-gray-400 mb-4 border-b border-gray-800 pb-2 flex justify-between items-center">
                <span>CACHE_MEMORY</span>
                <span className="text-[10px] text-cyan-600">{history.length} / 5</span>
              </h3>
              
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {history.map((img, idx) => (
                  <div 
                    key={idx} 
                    className="relative group cursor-pointer border border-transparent hover:border-cyan-500 transition-all rounded overflow-hidden"
                    onClick={() => {
                        if (!isLoading) {
                          setGeneratedImage(img);
                        }
                    }}
                  >
                    <img src={img} alt="History" className="w-full h-32 object-cover object-top opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1">
                      <div className="h-1 w-full bg-gradient-to-r from-fuchsia-600 to-cyan-600"></div>
                    </div>
                  </div>
                ))}
                
                {history.length === 0 && (
                  <div className="text-gray-600 text-xs text-center py-10 border border-gray-800 border-dashed rounded">
                    MEMORY_EMPTY
                  </div>
                )}
              </div>
           </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center text-gray-600 text-xs w-full max-w-4xl border-t border-gray-800 pt-4">
        <p>POWERED BY GEMINI 2.5 FLASH IMAGE // CYBERPUNK FASHION INTERFACE</p>
      </footer>

      {/* Fullscreen Image Modal with Deep Zoom */}
      {modalImage && (
        <div 
          className={`fixed inset-0 z-50 bg-black/95 backdrop-blur-md animate-[fadeIn_0.2s_ease-out] transition-all
            ${isZoomed ? 'overflow-auto' : 'flex items-center justify-center p-4'}
          `}
          onClick={closeModal}
        >
          <div 
            className={`relative transition-all duration-500 ease-out ${isZoomed ? 'min-w-full min-h-full flex justify-center items-start py-10' : 'max-w-full max-h-screen'}`} 
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={modalImage} 
              alt="High Res Detail" 
              className={`
                 transition-all duration-500 ease-in-out shadow-[0_0_50px_rgba(34,211,238,0.3)] rounded-sm
                 ${isZoomed 
                    ? 'max-w-none w-[150%] md:w-[120%] lg:w-[100%] cursor-zoom-out' 
                    : 'max-w-full max-h-[90vh] object-contain border-2 border-cyan-500 cursor-zoom-in'
                 }
              `}
              onClick={() => setIsZoomed(!isZoomed)}
            />
            
            {/* Modal HUD decoration - Only show when NOT zoomed to keep view clean */}
            {!isZoomed && (
              <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-fuchsia-500"></div>
                <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-fuchsia-500"></div>
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-fuchsia-500"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-fuchsia-500"></div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-[0.3em]">HIGH_RES_PREVIEW_MODE</div>
              </div>
            )}

            {/* Floating Control Buttons */}
            
            {/* Zoom Toggle Arrow Button */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60]">
               <button 
                  className="group relative flex flex-col items-center justify-center"
                  onClick={(e) => {
                      e.stopPropagation();
                      setIsZoomed(!isZoomed);
                  }}
               >
                   <div className={`
                       w-14 h-14 flex items-center justify-center rounded-full 
                       bg-black/80 border-2 border-cyan-500 
                       shadow-[0_0_20px_rgba(34,211,238,0.5)] 
                       group-hover:bg-cyan-900/60 group-hover:scale-110 group-hover:border-fuchsia-500
                       transition-all duration-300
                   `}>
                       <svg 
                           xmlns="http://www.w3.org/2000/svg" 
                           fill="none" 
                           viewBox="0 0 24 24" 
                           strokeWidth={2} 
                           stroke="currentColor" 
                           className={`w-8 h-8 text-cyan-400 group-hover:text-fuchsia-400 transition-transform duration-500 ${isZoomed ? 'rotate-180' : ''}`}
                       >
                           {isZoomed 
                               ? <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5M15 15l5.25 5.25" />
                               : <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75L9 9M3.75 3.75v5.25m0-5.25h5.25m11.25 0L15 9m5.25-5.25v5.25m0-5.25h-5.25m-11.25 16.5L9 15m-5.25 5.25v-5.25m0 5.25h5.25m11.25 0L15 15m5.25 5.25v-5.25m0 5.25h-5.25" />
                           }
                       </svg>
                   </div>
                   <div className="absolute -top-8 bg-black/80 px-2 py-1 rounded text-[10px] text-cyan-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-cyan-500/30">
                       {isZoomed ? "SHRINK_VIEW" : "ENHANCE_DETAILS"}
                   </div>
               </button>
            </div>

            {/* Close Button */}
            <button 
              className="fixed top-6 right-6 z-[60] group flex items-center space-x-2 bg-black/60 hover:bg-red-900/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 hover:border-red-500 transition-all"
              onClick={(e) => {
                  e.stopPropagation();
                  closeModal();
              }}
            >
              <span className="text-xs font-bold text-gray-300 group-hover:text-red-400">CLOSE_LINK</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-gray-400 group-hover:text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;