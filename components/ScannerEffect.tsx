import React from 'react';

const ScannerEffect: React.FC = () => {
  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden rounded-lg">
      {/* Scanlines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none" />
      
      {/* Moving scan bar */}
      <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400/30 shadow-[0_0_15px_rgba(34,211,238,0.5)] animate-[scan_3s_linear_infinite]" 
           style={{ animationName: 'scan' }} />
           
       {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_50%,rgba(0,0,0,0.6)_100%)]" />

      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ScannerEffect;
