import React from 'react';
import { Gamepad2, Disc, ShieldCheck, Heart, Sparkles } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: 'home' | 'database' | 'marketplace' | 'publish' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 text-slate-400 py-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-blue-400" />
              </div>
              <span className="font-bold text-white text-lg">
                VideoGamesIL
              </span>
              <span className="text-[10px] px-1.5 py-0.5 font-bold bg-blue-900/40 text-blue-300 border border-blue-600/30 rounded">
                PAL Edition
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              האתר הישראלי המרכזי לשימור, חיפוש, קנייה ומכירה של משחקי Sony PlayStation 1 בגרסת PAL. 
              נבנה עבור קהילת אספני הרטרו והגיימרים בישראל.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>כל המודעות מנוטרות ונשמרות מקומית במערכת.</span>
            </div>
          </div>

          {/* Fast Navigation */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">
              ניווט מהיר
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <button 
                  onClick={() => { setActiveTab('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  דף הבית
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('database'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  מאגר משחקים מלא
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('marketplace'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  חיפוש משחקים למכירה
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('publish'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-blue-400 transition-colors text-blue-400 font-medium"
                >
                  פרסום משחק למכירה
                </button>
              </li>
              <li>
                <button 
                  onClick={() => { setActiveTab('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-blue-400 transition-colors"
                >
                  אודות והרחבה עתידית
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Owner Info */}
          <div>
            <h4 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">
              פרטי האתר ויצירת קשר
            </h4>
            <div className="space-y-2 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block">בעל האתר:</span>
                <span className="font-semibold text-white">Eitan Moshe</span>
              </div>
              <div>
                <span className="text-slate-500 block">דוא״ל ליצירת קשר:</span>
                <a 
                  href="mailto:y0771175@gmail.com"
                  className="text-blue-400 hover:text-blue-300 transition-colors font-mono dir-ltr inline-block"
                >
                  y0771175@gmail.com
                </a>
              </div>
            </div>
            <div className="mt-3 p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400">
              פניות בנושאי מודעות, תמיכה טכנית והצעות לשיתוף פעולה.
            </div>
          </div>

        </div>

        {/* Bottom copyright & symbols */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2026 VideoGamesIL — כל הזכויות שמורות | בעל האתר: Eitan Moshe | יצירת קשר: y0771175@gmail.com
          </div>
          
          <div className="flex items-center gap-3">
            {/* Retro PS Icons */}
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900 rounded-full border border-slate-800 text-xs font-mono">
              <span className="text-emerald-400">▲</span>
              <span className="text-pink-400">■</span>
              <span className="text-blue-400">✖</span>
              <span className="text-red-400">●</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
