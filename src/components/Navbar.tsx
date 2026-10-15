import React, { useState } from 'react';
import { 
  Gamepad2, 
  Search, 
  PlusCircle, 
  Disc, 
  Info, 
  Menu, 
  X, 
  Sparkles,
  ShoppingBag
} from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'database' | 'marketplace' | 'about';
  setActiveTab: (tab: 'home' | 'database' | 'marketplace' | 'about') => void;
  listingsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  listingsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'database' | 'marketplace' | 'about') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all">
      {/* Top PlayStation Color Accent Bar (Classic PS1 buttons: Green triangle, Pink square, Blue cross, Red circle) */}
      <div className="h-1 w-full bg-gradient-to-r from-emerald-500 via-pink-500 via-blue-500 to-red-500" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 border border-slate-700 shadow-md group-hover:border-blue-500/60 transition-all">
              <Gamepad2 className="w-6 h-6 text-blue-400 group-hover:scale-110 transition-transform" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900" />
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  VideoGamesIL
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded uppercase">
                  PAL
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-normal">
                מאגר ולוח משחקי Sony PlayStation בישראל
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              id="nav-btn-home"
              onClick={() => handleNavClick('home')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'home'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              בית
            </button>

            <button
              id="nav-btn-database"
              onClick={() => handleNavClick('database')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'database'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Disc className="w-4 h-4" />
              מאגר משחקים
            </button>


            <button
              id="nav-btn-about"
              onClick={() => handleNavClick('about')}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === 'about'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Info className="w-4 h-4" />
              אודות האתר
            </button>
          </nav>

          {/* Desktop Right Action: Direct Database Access Button */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => handleNavClick('database')}
              className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 cursor-pointer"
            >
              <Disc className="w-4 h-4 text-blue-200" />
              <span>מאגר המשחקים (PAL)</span>
            </button>
          </div>

          {/* Mobile hamburger menu toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="פתח תפריט ניווט"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-800 bg-slate-900 px-4 pt-2 pb-6 space-y-2 animate-fadeIn">
          <button
            onClick={() => handleNavClick('home')}
            className={`w-full text-right px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
              activeTab === 'home'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>דף הבית</span>
            <Gamepad2 className="w-5 h-5 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('database')}
            className={`w-full text-right px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
              activeTab === 'database'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>מאגר משחקים (PAL)</span>
            <Disc className="w-5 h-5 text-slate-400" />
          </button>



          <button
            onClick={() => handleNavClick('about')}
            className={`w-full text-right px-4 py-3 rounded-xl text-base font-medium flex items-center justify-between ${
              activeTab === 'about'
                ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>אודות האתר ופרטי המערכת</span>
            <Info className="w-5 h-5 text-slate-400" />
          </button>
        </div>
      )}
    </header>
  );
};
