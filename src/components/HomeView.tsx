import React, { useState, useMemo } from 'react';
import { 
  Gamepad2, 
  Search, 
  PlusCircle, 
  Disc, 
  MapPin, 
  Sparkles, 
  ShieldCheck, 
  TrendingUp, 
  Layers, 
  Info, 
  Clock, 
  ChevronLeft, 
  ArrowLeft,
  Tv,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { GameItem, MarketplaceListing, ConsoleType } from '../types';
import { ConditionBadge } from './ConditionBadge';
import { GameCover } from './GameCover';

interface HomeViewProps {
  games: GameItem[];
  listings: MarketplaceListing[];
  onNavigateToMarketplace: (searchQuery?: string, consoleFilter?: ConsoleType | 'all') => void;
  onNavigateToDatabase: (searchQuery?: string, consoleFilter?: ConsoleType | 'all') => void;
  onNavigateToPublish: (game?: GameItem) => void;
  onSelectListing: (listing: MarketplaceListing) => void;
  onSelectGame: (game: GameItem) => void;
  onNavigateToAbout: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  games,
  listings,
  onNavigateToMarketplace,
  onNavigateToDatabase,
  onNavigateToPublish,
  onSelectListing,
  onSelectGame,
  onNavigateToAbout,
}) => {
  const [quickSearch, setQuickSearch] = useState('');
  const [selectedHeroConsole, setSelectedHeroConsole] = useState<ConsoleType | 'all'>('all');
  const [featuredConsoleTab, setFeaturedConsoleTab] = useState<ConsoleType | 'all'>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearch.trim()) {
      onNavigateToMarketplace(quickSearch.trim(), selectedHeroConsole);
    } else {
      onNavigateToMarketplace('', selectedHeroConsole);
    }
  };

  // Compute console counts
  const ps1Count = useMemo(() => games.filter(g => g.console === 'ps1').length, [games]);
  const ps2Count = useMemo(() => games.filter(g => g.console === 'ps2').length, [games]);
  const ps3Count = useMemo(() => games.filter(g => g.console === 'ps3').length, [games]);

  const ps1ListingsCount = useMemo(() => listings.filter(l => l.console === 'ps1').length, [listings]);
  const ps2ListingsCount = useMemo(() => listings.filter(l => l.console === 'ps2').length, [listings]);
  const ps3ListingsCount = useMemo(() => listings.filter(l => l.console === 'ps3').length, [listings]);

  // Recently listed (take top 6 newest listings)
  const recentListings = useMemo(() => {
    return [...listings]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 6);
  }, [listings]);

  // Featured games across PS1, PS2, and PS3
  const featuredGames = useMemo(() => {
    const list = featuredConsoleTab === 'all' 
      ? games 
      : games.filter(g => g.console === featuredConsoleTab);

    // Iconic highlights
    const iconicKeywords = [
      // PS1
      'crash bandicoot', 'tekken 3', 'final fantasy vii', 'metal gear solid', 'spyro the dragon', 'gran turismo 2', 'resident evil 2',
      // PS2
      'grand theft auto: san andreas', 'god of war ii', 'shadow of the colossus', 'gran turismo 4', 'kingdom hearts ii', 'tekken 5', 'burnout 3',
      // PS3
      'the last of us', 'uncharted 2', 'god of war iii', 'red dead redemption', 'grand theft auto v', 'metal gear solid 4', 'demon\'s souls'
    ];

    const selected: GameItem[] = [];
    for (const kw of iconicKeywords) {
      const match = list.find(g => g.title.toLowerCase().includes(kw) && !selected.some(s => s.id === g.id));
      if (match) selected.push(match);
      if (selected.length >= 12) break;
    }

    if (selected.length < 12) {
      for (const g of list) {
        if (!selected.some(s => s.id === g.id)) {
          selected.push(g);
        }
        if (selected.length >= 12) break;
      }
    }

    return selected;
  }, [games, featuredConsoleTab]);

  return (
    <div className="space-y-16 pb-12 animate-fadeIn" dir="rtl">
      
      {/* ======================================================== */}
      {/* HERO SECTION: WELCOME & ALL SONY PLAYSTATION CONSOLES */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-10 sm:pt-16 pb-12 sm:pb-20 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950">
        
        {/* Background glow accents */}
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-40 bg-red-600/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-6">
          
          {/* Top Badge: Sony PlayStation Official Israel Hub */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-xs sm:text-sm font-bold shadow-inner">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>המאגר והמרקטפלייס הרשמי לקונסולות Sony PlayStation בישראל (גרסאות PAL)</span>
          </div>

          {/* Main Title - Prominently Displaying All Sony PlayStation Consoles */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
              מאגר ולוח משחקי <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-red-400 bg-clip-text text-transparent">Sony PlayStation</span>
            </h1>
            
            {/* Sony PlayStation Generations Callout Badges at Entrance */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-black shadow-sm">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Sony PlayStation 1 (PS1)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-950/80 border border-blue-600/40 text-blue-300 text-xs sm:text-sm font-black shadow-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Sony PlayStation 2 (PS2)
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-950/80 border border-red-600/40 text-red-300 text-xs sm:text-sm font-black shadow-sm">
                <span className="w-2 h-2 rounded-full bg-red-400" />
                Sony PlayStation 3 (PS3)
              </span>
            </div>
          </div>

          {/* Short Description */}
          <p className="text-base sm:text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-normal">
            מאגר ישראלי מקיף וללא כפילויות לחיפוש, קטלוג, קנייה ומכירה של משחקי סוני פלייסטיישן מקוריים בגרסאות PAL.
            מעל 8,000 כותרים עם קודי מוצר רשמיים, עטיפות בחדות גבוהה ולוח מסחר ייעודי לגיימרים ואספנים בישראל.
          </p>

          {/* Console Filter Pills + Big Search Area */}
          <div className="max-w-3xl mx-auto pt-2 space-y-3">
            
            {/* Quick Console Selection for Search */}
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-xs text-slate-400 font-semibold ml-1">סינון חיפוש:</span>
              <button
                type="button"
                onClick={() => setSelectedHeroConsole('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  selectedHeroConsole === 'all'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                כל הקונסולות ({games.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedHeroConsole('ps1')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedHeroConsole === 'ps1'
                    ? 'bg-slate-700 text-white shadow-md border border-slate-500'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>PlayStation 1</span>
                <span className="text-[10px] opacity-80">({ps1Count})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedHeroConsole('ps2')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedHeroConsole === 'ps2'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>PlayStation 2</span>
                <span className="text-[10px] opacity-80">({ps2Count})</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedHeroConsole('ps3')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  selectedHeroConsole === 'ps3'
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-md'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                <span>PlayStation 3</span>
                <span className="text-[10px] opacity-80">({ps3Count})</span>
              </button>
            </div>

            {/* Search Input Bar */}
            <form 
              onSubmit={handleSearchSubmit}
              className="relative flex items-center bg-slate-900/95 border-2 border-slate-700 hover:border-blue-500 focus-within:border-blue-500 rounded-2xl shadow-2xl p-1.5 transition-all"
            >
              <Search className="w-6 h-6 text-slate-400 mr-3.5 flex-shrink-0" />
              <input
                id="hero-quick-search-input"
                type="text"
                placeholder={
                  selectedHeroConsole === 'ps1'
                    ? 'חפש משחק PS1 (לדוגמה: Crash Bandicoot, Tekken 3, Metal Gear Solid...)'
                    : selectedHeroConsole === 'ps2'
                    ? 'חפש משחק PS2 (לדוגמה: GTA San Andreas, God of War, Gran Turismo 4...)'
                    : selectedHeroConsole === 'ps3'
                    ? 'חפש משחק PS3 (לדוגמה: The Last of Us, Uncharted 2, Red Dead Redemption...)'
                    : 'חפש משחק למכירה או במאגר (לדוגמה: Crash, GTA, God of War, The Last of Us...)'
                }
                value={quickSearch}
                onChange={(e) => setQuickSearch(e.target.value)}
                className="w-full bg-transparent text-white text-sm sm:text-base pr-2 pl-4 py-2.5 placeholder:text-slate-500 focus:outline-none"
              />
              <button
                type="submit"
                id="hero-search-submit-btn"
                className="px-6 py-2.5 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer"
              >
                <span>חיפוש</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            </form>

            {/* Quick suggested chips */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs text-slate-400">
              <span className="text-slate-500 font-medium">חיפושים פופולריים:</span>
              {['Crash Bandicoot', 'GTA San Andreas', 'The Last of Us', 'God of War', 'Tekken', 'Uncharted'].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => onNavigateToMarketplace(term)}
                  className="px-2.5 py-1 bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons: "חיפוש משחקים" + "פרסום משחק למכירה" */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              id="hero-btn-search"
              onClick={() => onNavigateToMarketplace()}
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer text-sm sm:text-base"
            >
              <Search className="w-5 h-5 text-blue-400" />
              <span>חיפוש משחקים למכירה בלוח</span>
            </button>

            <button
              id="hero-btn-publish"
              onClick={() => onNavigateToPublish()}
              className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold rounded-xl shadow-xl shadow-blue-900/40 flex items-center justify-center gap-2 transition-all cursor-pointer text-sm sm:text-base group"
            >
              <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              <span>פרסום משחק למכירה בחינם</span>
            </button>
          </div>

        </div>

      </section>

      {/* ======================================================== */}
      {/* SECTION: SONY PLAYSTATION CONSOLES SHOWCASE AT ENTRANCE */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-300 text-xs font-bold">
            <Tv className="w-3.5 h-3.5 text-blue-400" />
            <span>קונסולות Sony PlayStation הנתמכות במאגר</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            בחר קונסולת Sony PlayStation לגלישה וחיפוש
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            קטלוג PAL מלא לכל דורות סוני פלייסטיישן – ללא כפילויות, עם קודי מוצר מקוריים
          </p>
        </div>

        {/* 3 Sony Console Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          
          {/* Card 1: Sony PlayStation 1 */}
          <div className="bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-600 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 font-black text-xs">
                  PS1 • 1994-2006
                </span>
                <span className="text-xs font-bold text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                  תקליטורי CD-ROM
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
                  Sony PlayStation 1
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  הקונסולה האגדית שהחלה את המהפכה. מאגר מקיף של כל כותרי ה-PAL הרשמיים בישראל ובאירופה (SCES / SLES).
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-center">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-lg font-extrabold font-mono text-blue-400 block">{ps1Count}</span>
                  <span className="text-[11px] text-slate-400">משחקים במאגר</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-lg font-extrabold font-mono text-emerald-400 block">{ps1ListingsCount}</span>
                  <span className="text-[11px] text-slate-400">מודעות למכירה</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => onNavigateToDatabase('', 'ps1')}
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              >
                <span>מאגר משחקי PlayStation 1</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateToMarketplace('', 'ps1')}
                className="w-full py-2 bg-slate-950 hover:bg-blue-950 text-blue-400 text-xs font-bold rounded-xl border border-slate-800 hover:border-blue-700 transition-colors"
              >
                חיפוש מודעות PS1 למכירה
              </button>
            </div>
          </div>

          {/* Card 2: Sony PlayStation 2 */}
          <div className="bg-gradient-to-b from-blue-950/30 via-slate-900 to-slate-950 border border-blue-900/50 hover:border-blue-500/60 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-black text-xs shadow-sm">
                  PS2 • 2000-2013
                </span>
                <span className="text-xs font-bold text-blue-300 bg-blue-950/80 px-2 py-0.5 rounded border border-blue-800">
                  תקליטורי DVD-ROM
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-blue-300 transition-colors">
                  Sony PlayStation 2
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  הקונסולה הנמכרת ביותר בהיסטוריה. קטלוג ענק של משחקי PAL מקוריים באיכות DVD, כולל שוברי קופות ומשחקי אספנות.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-center">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-lg font-extrabold font-mono text-blue-400 block">{ps2Count}</span>
                  <span className="text-[11px] text-slate-400">משחקים במאגר</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-lg font-extrabold font-mono text-emerald-400 block">{ps2ListingsCount}</span>
                  <span className="text-[11px] text-slate-400">מודעות למכירה</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => onNavigateToDatabase('', 'ps2')}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-blue-900/30"
              >
                <span>מאגר משחקי PlayStation 2</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateToMarketplace('', 'ps2')}
                className="w-full py-2 bg-slate-950 hover:bg-blue-950 text-blue-400 text-xs font-bold rounded-xl border border-slate-800 hover:border-blue-700 transition-colors"
              >
                חיפוש מודעות PS2 למכירה
              </button>
            </div>
          </div>

          {/* Card 3: Sony PlayStation 3 */}
          <div className="bg-gradient-to-b from-red-950/30 via-slate-900 to-slate-950 border border-red-900/50 hover:border-red-500/60 rounded-3xl p-6 flex flex-col justify-between space-y-6 shadow-xl transition-all group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-600 to-rose-700 text-white font-black text-xs shadow-sm">
                  PS3 • 2006-2017
                </span>
                <span className="text-xs font-bold text-red-300 bg-red-950/80 px-2 py-0.5 rounded border border-red-800">
                  תקליטורי Blu-ray ב-HD
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-xl sm:text-2xl font-extrabold text-white group-hover:text-red-300 transition-colors">
                  Sony PlayStation 3
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  דור ה-HD המהפכני עם מעבד ה-Cell וכונן Blu-ray מובנה. קטלוג PAL מקיף (BCES / BLES) עם עטיפות ברזולוציה גבוהה.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 text-center">
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-lg font-extrabold font-mono text-red-400 block">{ps3Count}</span>
                  <span className="text-[11px] text-slate-400">משחקים במאגר</span>
                </div>
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800">
                  <span className="text-lg font-extrabold font-mono text-emerald-400 block">{ps3ListingsCount}</span>
                  <span className="text-[11px] text-slate-400">מודעות למכירה</span>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => onNavigateToDatabase('', 'ps3')}
                className="w-full py-2.5 bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-red-900/30"
              >
                <span>מאגר משחקי PlayStation 3</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onNavigateToMarketplace('', 'ps3')}
                className="w-full py-2 bg-slate-950 hover:bg-red-950 text-red-400 text-xs font-bold rounded-xl border border-slate-800 hover:border-red-700 transition-colors"
              >
                חיפוש מודעות PS3 למכירה
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* KEY STATS BAR */}
      {/* ======================================================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-slate-900/70 border border-slate-800 rounded-3xl">
          <div className="text-center space-y-1">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400">
              {games.length.toLocaleString('he-IL')}+
            </span>
            <span className="text-xs text-slate-400 block font-medium">משחקי סוני פלייסטיישן במאגר</span>
          </div>

          <div className="text-center space-y-1 border-r border-slate-800">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
              {listings.length}
            </span>
            <span className="text-xs text-slate-400 block font-medium">מודעות מכירה פעילות בישראל</span>
          </div>

          <div className="text-center space-y-1 border-r border-slate-800">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
              100%
            </span>
            <span className="text-xs text-slate-400 block font-medium">גרסאות PAL רשמיות ללא כפילויות</span>
          </div>

          <div className="text-center space-y-1 border-r border-slate-800">
            <span className="text-2xl sm:text-3xl font-extrabold font-mono text-purple-400">
              3 קונסולות
            </span>
            <span className="text-xs text-slate-400 block font-medium">PS1 • PS2 • PS3</span>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* SECTION: RECENTLY PUBLISHED GAMES FOR SALE */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                משחקים שפורסמו לאחרונה למכירה
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              מודעות יד שנייה ואספנות שעלו לאתר על ידי משתמשים בישראל (PS1, PS2, PS3)
            </p>
          </div>

          <button
            onClick={() => onNavigateToMarketplace()}
            className="text-xs sm:text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1 transition-colors"
          >
            <span>לכל המודעות בלוח</span>
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        {recentListings.length === 0 ? (
          <div className="p-8 sm:p-12 text-center bg-slate-900/60 border border-slate-800/80 rounded-3xl space-y-4">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-950/80 border border-blue-500/20 flex items-center justify-center">
              <Gamepad2 className="w-7 h-7 text-blue-400" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-bold text-white">הלוח מוכן למודעות חדשות!</h3>
              <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                יש לך משחקי Sony PlayStation 1, PlayStation 2 או PlayStation 3 שברצונך למכור?
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onNavigateToPublish()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>פרסם מודעה ראשונה בחינם</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentListings.map((listing) => (
              <div
                key={listing.id}
                onClick={() => onSelectListing(listing)}
                className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-950">
                    <GameCover
                      src={(listing.images && listing.images[0]) || ''}
                      title={listing.gameTitle}
                      consoleType={listing.console}
                      aspectRatio="custom"
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 z-10 pointer-events-none">
                      <ConditionBadge condition={listing.condition} size="sm" />
                    </div>
                    <div className={`absolute top-3 left-3 z-10 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold border ${
                      listing.console === 'ps3'
                        ? 'bg-red-950/80 text-red-300 border-red-800'
                        : listing.console === 'ps2'
                        ? 'bg-blue-950/80 text-blue-300 border-blue-800'
                        : 'bg-slate-950/80 text-slate-300 border-slate-700'
                    }`}>
                      {listing.console?.toUpperCase() || 'PS1'} • PAL
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {listing.gameTitle}
                      </h3>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="flex items-center gap-1 text-slate-300">
                        <MapPin className="w-3.5 h-3.5 text-blue-400" />
                        {listing.city}
                      </span>
                      <span>•</span>
                      <span>{new Date(listing.createdAt).toLocaleDateString('he-IL')}</span>
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {listing.description}
                    </p>
                  </div>
                </div>

                {/* Card Footer with Price and Action */}
                <div className="px-4 py-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-500 block">מחיר:</span>
                    <span className="text-lg font-extrabold font-mono text-emerald-400">
                      {listing.price} ₪
                    </span>
                  </div>

                  <button
                    type="button"
                    className="px-3 py-1.5 bg-blue-600/20 group-hover:bg-blue-600 text-blue-400 group-hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>פרטי המודעה</span>
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* ======================================================== */}
      {/* SECTION: FEATURED PAL CLASSICS ACROSS SONY GENERATIONS */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Disc className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                קלאסיקות מובילות במאגר ה-PAL
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              הכותרים האגדיים של Sony PlayStation 1, PlayStation 2 ו-PlayStation 3
            </p>
          </div>

          {/* Console Filter Tabs for Featured Classics */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setFeaturedConsoleTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                featuredConsoleTab === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              הכל
            </button>
            <button
              onClick={() => setFeaturedConsoleTab('ps1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                featuredConsoleTab === 'ps1' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              PS1
            </button>
            <button
              onClick={() => setFeaturedConsoleTab('ps2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                featuredConsoleTab === 'ps2' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              PS2
            </button>
            <button
              onClick={() => setFeaturedConsoleTab('ps3')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                featuredConsoleTab === 'ps3' ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              PS3
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featuredGames.map((game) => {
            const gameListingsCount = listings.filter((l) => l.gameId === game.id).length;

            return (
              <div
                key={game.id}
                onClick={() => onSelectGame(game)}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-600 rounded-2xl overflow-hidden p-3 space-y-3 cursor-pointer group transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-950 relative shadow-inner">
                    <GameCover
                      game={game}
                      aspectRatio="custom"
                      className="w-full h-full"
                      imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className={`absolute top-2 left-2 z-10 px-1.5 py-0.5 rounded text-[9px] font-black uppercase ${
                      game.console === 'ps3' 
                        ? 'bg-red-950/90 text-red-300 border border-red-800' 
                        : game.console === 'ps2'
                        ? 'bg-blue-950/90 text-blue-300 border border-blue-800'
                        : 'bg-slate-950/90 text-slate-300 border border-slate-700'
                    }`}>
                      {game.console}
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <h4 className="font-bold text-xs sm:text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                      {game.title}
                    </h4>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{game.genre}</span>
                      <span className="font-mono text-slate-500">{game.releaseYear}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  {gameListingsCount > 0 ? (
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {gameListingsCount} מודעות
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono">
                      {game.serialNumber}
                    </span>
                  )}
                  <span className="text-blue-400 group-hover:underline">פרטים</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* PAL CONSOLES INFORMATION CALLOUT */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 border border-blue-900/40 rounded-3xl p-6 sm:p-10 relative overflow-hidden">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-600/20 text-blue-400 text-xs font-bold border border-blue-500/30">
              <Info className="w-4 h-4" />
              <span>מדריך לאספנים: קונסולות Sony PlayStation ותקן PAL בישראל</span>
            </div>
            
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              מורשת הקונסולות של Sony בישראל: PlayStation 1, PlayStation 2 ו-PlayStation 3
            </h3>
            
            <p className="text-sm text-slate-300 leading-relaxed">
              כל קונסולות הסוני פלייסטיישן שיובאו רשמית לישראל פעלו בתקן השידור האירופאי PAL. 
              המאגר שלנו מאגד את כל משחקי <strong>Sony PlayStation 1</strong> (תקליטורי CD שחורים מקוריים), 
              <strong>Sony PlayStation 2</strong> (תקליטורי DVD כסופים וכחולים), 
              ו-<strong>Sony PlayStation 3</strong> (תקליטורי Blu-ray Disc ב-HD) עם קודי מוצר אותנטיים (SCES, SLES, BCES, BLES).
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={onNavigateToAbout}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                קרא עוד על הקונסולות וההיסטוריה
              </button>
              <button
                onClick={() => onNavigateToPublish()}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
              >
                פרסם משחק למכירה עכשיו
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
