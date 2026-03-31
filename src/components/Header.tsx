import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#E0F2F1] shadow-sm backdrop-blur-sm bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img 
            src="https://i.imgur.com/gUuF59Z.png" 
            alt="Logo" 
            className="h-10 w-10 object-contain"
            referrerPolicy="no-referrer"
          />
          <h1 className="text-xl md:text-2xl font-bold text-[#00796B] tracking-tight">
            APLIKASI KISI KISI DAN SOAL
          </h1>
        </div>
        <nav className="hidden md:flex gap-6">
          <a href="#" className="text-[#00796B] font-medium hover:text-[#004D40] transition-colors duration-200">Beranda</a>
          <a href="#" className="text-[#00796B] font-medium hover:text-[#004D40] transition-colors duration-200">Tentang</a>
          <a href="#" className="text-[#00796B] font-medium hover:text-[#004D40] transition-colors duration-200">Panduan</a>
        </nav>
      </div>
    </header>
  );
};
