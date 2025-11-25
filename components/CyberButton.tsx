import React from 'react';

interface CyberButtonProps {
  label: string;
  subLabel?: string;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  color?: 'cyan' | 'pink' | 'yellow';
}

const CyberButton: React.FC<CyberButtonProps> = ({ 
  label, 
  subLabel, 
  onClick, 
  isActive = false, 
  disabled = false,
  color = 'cyan'
}) => {
  
  const colorClasses = {
    cyan: {
      border: 'border-cyan-500',
      text: 'text-cyan-400',
      bgActive: 'bg-cyan-900/40',
      shadow: 'shadow-[0_0_10px_rgba(34,211,238,0.5)]',
      glow: 'group-hover:shadow-[0_0_20px_rgba(34,211,238,0.7)]'
    },
    pink: {
      border: 'border-fuchsia-500',
      text: 'text-fuchsia-400',
      bgActive: 'bg-fuchsia-900/40',
      shadow: 'shadow-[0_0_10px_rgba(232,121,249,0.5)]',
      glow: 'group-hover:shadow-[0_0_20px_rgba(232,121,249,0.7)]'
    },
    yellow: {
      border: 'border-yellow-400',
      text: 'text-yellow-300',
      bgActive: 'bg-yellow-900/40',
      shadow: 'shadow-[0_0_10px_rgba(250,204,21,0.5)]',
      glow: 'group-hover:shadow-[0_0_20px_rgba(250,204,21,0.7)]'
    }
  };

  const theme = colorClasses[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative w-full p-4 border-2 transition-all duration-300 ease-out
        clip-path-slanted font-mono text-left uppercase tracking-wider
        ${theme.border}
        ${isActive ? `${theme.bgActive} ${theme.shadow}` : 'bg-black/60 hover:bg-gray-900'}
        ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}
      `}
      style={{
        clipPath: 'polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)'
      }}
    >
      {/* Corner decorations */}
      <span className={`absolute top-0 left-0 w-2 h-2 ${isActive ? 'bg-white' : theme.bgActive} transition-colors`} />
      <span className={`absolute bottom-0 right-0 w-2 h-2 ${isActive ? 'bg-white' : theme.bgActive} transition-colors`} />

      {/* Content */}
      <div className="flex flex-col relative z-10">
        <span className={`text-lg font-bold ${theme.text} group-hover:text-white transition-colors`}>
          {label}
        </span>
        {subLabel && (
          <span className="text-xs text-gray-500 mt-1 group-hover:text-gray-300">
            {subLabel}
          </span>
        )}
      </div>

      {/* Hover Line Effect */}
      <div className={`
        absolute bottom-0 left-0 h-1 bg-white w-0 transition-all duration-300
        group-hover:w-full opacity-50
      `} />
    </button>
  );
};

export default CyberButton;
