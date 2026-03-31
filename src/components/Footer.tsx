import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-[#E0F2F1] border-t border-[#B2DFDB] z-50" style={{ height: '0.5cm' }}>
      <div className="h-full flex items-center justify-center">
        <p className="text-[10px] md:text-xs text-[#00796B] font-medium">
          copyright@muhammad imam syafi’i 2026
        </p>
      </div>
    </footer>
  );
};
