import React from 'react';

interface CodtechLogoProps {
  className?: string;
  showText?: boolean;
}

export const CodtechLogo: React.FC<CodtechLogoProps> = ({ className = 'h-9', showText = true }) => {
  return (
    <div className={`flex items-center space-x-2.5 ${className}`}>
      {/* CT stylized emblem inspired by authentic Codtech logo */}
      <div className="relative w-9 h-9 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shadow-sm shrink-0 overflow-hidden">
        {/* Gear / Tech accent in orange */}
        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full border-2 border-orange-500 opacity-80"></div>
        <div className="absolute -bottom-1 -left-1 w-3.5 h-3.5 rounded-full bg-orange-600/30"></div>
        
        {/* Bold CT letters */}
        <div className="relative flex items-center font-black tracking-tighter text-sm select-none">
          <span className="text-white">C</span>
          <span className="text-orange-500 font-extrabold ml-[1px]">T</span>
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center space-x-1.5">
            <span className="font-extrabold text-sm tracking-tight text-neutral-900 dark:text-white uppercase font-sans">
              CODTECH
            </span>
            <span className="text-[10px] font-semibold tracking-wider text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/50 px-1.5 py-0.2 rounded border border-orange-200 dark:border-orange-800">
              IT SOLUTIONS
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 dark:text-neutral-400 font-medium">
            Student Credential Verification Portal
          </span>
        </div>
      )}
    </div>
  );
};
