import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Disc, 
  Filter, 
  Calendar, 
  ShoppingBag, 
  PlusCircle, 
  Info, 
  Sparkles,
  Layers,
  ChevronLeft,
  X,
  Gamepad2
} from 'lucide-react';
import { GameItem, MarketplaceListing, ConsoleType } from '../types';
import { GENRES } from '../data/ps1Games';
import { GameCover } from './GameCover';

const ALL_YEARS = [
  'הכל',
  '2017', '2016', '2015', '2014', '2013', '2012', '2011', '2010', '2009', '2008', '2007', '2006',
  '2005', '2004', '2003', '2002', '2001', '2000', '1999', '1998',
  '1997', '1996', '1995'
];

interface DatabaseViewProps {
  games: GameItem[];
  listings: MarketplaceListing[];
  onSelectGame: (game: GameItem) => void;
  onPublishForGame?: (game: GameItem) => void;
  initialSearchQuery?: string;
  initialConsole?: 'all' | 'ps1' | 'ps2' | 'ps3';
}

export const DatabaseView: React.FC<DatabaseViewProps> = ({
  games,
  listings,
  onSelectGame,
  initialSearchQuery = '',
  initialConsole = 'all',
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedConsole, setSelectedConsole] = useState<'all' | 'ps1' | 'ps2' | 'ps3'>(initialConsole);
  const [selectedGenre, setSelectedGenre] = useState('הכל');
  const [selectedYear, setSelectedYear] = useState('הכל');
  const [showOnlyWithListings, setShowOnlyWithListings] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(48);

  // Counts for quick display
  const ps1Count = useMemo(() => games.filter(g => g.console === 'ps1').length, [games]);
  const ps2Count = useMemo(() => games.filter(g => g.console === 'ps2').length, [games]);
  const ps3Count = useMemo(() => games.filter(g => g.console === 'ps3').length, [games]);

  // Filtered games logic
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      // Console
      if (selectedConsole !== 'all') {
        if (game.console !== selectedConsole) return false;
      }

      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = game.title.toLowerCase().includes(q);
        const matchHeb = game.hebrewTitle ? game.hebrewTitle.includes(q) : false;
        const matchSerial = game.serialNumber.toLowerCase().includes(q);
        const matchDev = game.developer ? game.developer.toLowerCase().includes(q) : false;
        const matchPub = game.publisher ? game.publisher.toLowerCase().includes(q) : false;
        if (!matchTitle && !matchHeb && !matchSerial && !matchDev && !matchPub) {
          return false;
        }
      }

      // Genre
      if (selectedGenre !== 'הכל') {
        if (!game.genre.includes(selectedGenre)) return false;
      }

      // Year
      if (selectedYear !== 'הכל') {
        if (game.releaseYear.toString() !== selectedYear) return false;
      }

      // Show only with active listings
      if (showOnlyWithListings) {
        const hasListings = listings.some((l) => l.gameId === game.id);
        if (!hasListings) return false;
      }

      return true;
    });
  }, [games, listings, selectedConsole, searchQuery, selectedGenre, selectedYear, showOnlyWithListings]);

  // Reset to first page whenever filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedConsole, selectedGenre, selectedYear, showOnlyWithListings, pageSize]);

  const totalPages = Math.ceil(filteredGames.length / pageSize) || 1;
  const paginatedGames = useMemo(() => {
    if (pageSize >= 9999) return filteredGames;
    const start = (currentPage - 1) * pageSize;
    return filteredGames.slice(start, start + pageSize);
  }, [filteredGames, currentPage, pageSize]);

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedConsole('all');
    setSelectedGenre('הכל');
    setSelectedYear('הכל');
    setShowOnlyWithListings(false);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950 text-blue-400 text-xs font-semibold border border-blue-800/40">
            <Disc className="w-3.5 h-3.5" />
            <span>אינדקס משחקי Sony PlayStation 1, PlayStation 2 ו-PlayStation 3 (גרסאות PAL)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            קטלוג משחקי Sony PlayStation (גרסאות PAL)
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            מאגר מלא הכולל שמות מקוריים ללא כפילויות, מספרי מוצר סידוריים (SCES/SLES/BCES/BLES), שנות יציאה, תמונות עטיפה, ז'אנרים וסטטוס מודעות מכירה זמינות.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-blue-400">
            {games.length.toLocaleString('he-IL')} כותרים מאומתים
          </div>
        </div>
      </div>

      {/* Filter and Search Controls */}
      <div className="space-y-4 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
        
        {/* Console Selector Switcher */}
        <div className="flex flex-wrap items-center gap-2 pb-2 border-b border-slate-800/80">
          <span className="text-xs text-slate-400 font-bold ml-2">קונסולה:</span>
          
          <button
            onClick={() => setSelectedConsole('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              selectedConsole === 'all'
                ? 'bg-slate-100 text-slate-950 shadow-md'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>כל הקונסולות</span>
            <span className="text-[10px] opacity-75 font-mono">({games.length})</span>
          </button>

          <button
            onClick={() => setSelectedConsole('ps1')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              selectedConsole === 'ps1'
                ? 'bg-gradient-to-r from-slate-200 to-slate-400 text-slate-900 shadow-md ring-2 ring-slate-400'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
            <span>PlayStation 1</span>
            <span className="text-[10px] opacity-75 font-mono">({ps1Count})</span>
          </button>

          <button
            onClick={() => setSelectedConsole('ps2')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              selectedConsole === 'ps2'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-900/40 ring-2 ring-blue-400'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
            <span>PlayStation 2</span>
            <span className="text-[10px] opacity-75 font-mono">({ps2Count})</span>
          </button>

          <button
            onClick={() => setSelectedConsole('ps3')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              selectedConsole === 'ps3'
                ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-lg shadow-red-900/40 ring-2 ring-red-400'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
            <span>PlayStation 3</span>
            <span className="text-[10px] opacity-75 font-mono">({ps3Count})</span>
          </button>
        </div>

        {/* Search input */}
        <div className="relative">
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            id="database-search-input"
            type="text"
            placeholder="חפש לפי שם משחק (GTA, God of War, Crash, Tekken), קוד סידורי (SCES/SLES), או חברה מפתחת..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-12 pl-10 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 text-xs">
          
          {/* Genre selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
            <span className="text-slate-400 font-semibold flex-shrink-0 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              ז'אנר:
            </span>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedGenre === g
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Year selector & Toggle with active listings */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-semibold">שנה:</span>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                {ALL_YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y === 'הכל' ? 'כל השנים' : y}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-center gap-2 text-slate-300 cursor-pointer bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">
              <input
                type="checkbox"
                checked={showOnlyWithListings}
                onChange={(e) => setShowOnlyWithListings(e.target.checked)}
                className="rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
              />
              <span>הצג רק משחקים שיש להם מודעה למכירה</span>
            </label>

            {(searchQuery || selectedConsole !== 'all' || selectedGenre !== 'הכל' || selectedYear !== 'הכל' || showOnlyWithListings) && (
              <button
                onClick={resetFilters}
                className="text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer"
              >
                נקה סינונים
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Results Count Info and Page Size selector */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span>
            נמצאו <strong className="text-white font-bold">{filteredGames.length}</strong> משחקים במאגר
            {totalPages > 1 && (
              <span className="text-slate-500 mr-2">
                (עמוד {currentPage} מתוך {totalPages})
              </span>
            )}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span>משחקים בעמוד:</span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value={24}>24</option>
              <option value={48}>48</option>
              <option value={96}>96</option>
              <option value={9999}>הכל (ללא הגבלה)</option>
            </select>
          </div>
          <span className="text-[11px] text-slate-500 hidden md:inline">
            * כל המשחקים נבדקו ומקוטלגים בגרסאות PAL הרשמיות (אירופה / ישראל)
          </span>
        </div>
      </div>

      {/* Games Cards Grid */}
      {filteredGames.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl space-y-3">
          <Disc className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-white">לא נמצאו משחקים התואמים לחיפוש</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            נסה לשנות את מילות החיפוש, להחליף קונסולה או לאפס את הסינונים שבחרת.
          </p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            איפוס סינונים
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {paginatedGames.map((game) => {
              const gameListings = listings.filter((l) => l.gameId === game.id);
              const hasListings = gameListings.length > 0;
              const isPs3 = game.console === 'ps3';
              const isPs2 = game.console === 'ps2';

              return (
                <div
                  key={game.id}
                  onClick={() => onSelectGame(game)}
                  className="bg-slate-900 border border-slate-800 hover:border-blue-500/50 rounded-2xl overflow-hidden p-4 space-y-3 cursor-pointer group transition-all duration-200 shadow-lg flex flex-col justify-between"
                >
                  <div>
                    {/* Cover */}
                    <div className="relative rounded-xl overflow-hidden shadow-inner">
                      <GameCover
                        game={game}
                        alt={game.title}
                        aspectRatio="auto"
                        className="rounded-xl"
                        imgClassName="group-hover:scale-105 transition-transform duration-300"
                      />
                      
                      {/* Console Badge */}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10 pointer-events-none">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-md ${
                          isPs3
                            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white border border-red-500/40'
                            : isPs2 
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-400/40' 
                            : 'bg-slate-800/95 text-slate-200 border border-slate-600/40'
                        }`}>
                          {isPs3 ? 'PS3' : isPs2 ? 'PS2' : 'PS1'}
                        </span>
                        <span className="bg-slate-950/80 backdrop-blur-sm text-slate-300 px-1.5 py-0.5 rounded text-[10px] font-bold border border-slate-800">
                          {game.region}
                        </span>
                      </div>

                      {/* Year badge */}
                      <div className="absolute bottom-2 left-2 bg-slate-950/85 backdrop-blur-sm text-slate-300 px-2 py-0.5 rounded text-[10px] font-medium border border-slate-800 z-10 pointer-events-none">
                        {game.releaseYear}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="mt-3 space-y-1">
                      <h3 className="font-extrabold text-sm text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                        {game.title}
                      </h3>
                      
                      {game.hebrewTitle && (
                        <p className="text-xs text-blue-400 font-medium truncate">
                          {game.hebrewTitle}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                        <span className="truncate max-w-[130px]">{game.genre}</span>
                        <span className="font-mono text-[11px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{game.serialNumber}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom status & listing indicator */}
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    {hasListings ? (
                      <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 px-2 py-1 rounded-lg border border-emerald-800/30">
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{gameListings.length} למכירה</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500">
                        אין מודעה כרגע
                      </span>
                    )}

                    <span className="text-xs text-blue-400 font-semibold group-hover:underline flex items-center gap-0.5">
                      <span>פרטים</span>
                      <ChevronLeft className="w-3 h-3" />
                    </span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Pagination bar */}
          {totalPages > 1 && (
            <div className="flex flex-wrap items-center justify-center gap-2 pt-6 pb-2">
              <button
                onClick={() => {
                  setCurrentPage((p) => Math.max(p - 1, 1));
                  window.scrollTo({ top: 150, behavior: 'smooth' });
                }}
                disabled={currentPage === 1}
                className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                עמוד קודם
              </button>

              <div className="flex items-center gap-1 overflow-x-auto max-w-full px-2">
                {Array.from({ length: Math.min(totalPages, 9) }, (_, i) => {
                  let pNum = i + 1;
                  if (totalPages > 9) {
                    if (currentPage > 5 && currentPage < totalPages - 4) {
                      pNum = currentPage - 4 + i;
                    } else if (currentPage >= totalPages - 4) {
                      pNum = totalPages - 8 + i;
                    }
                  }
                  return (
                    <button
                      key={pNum}
                      onClick={() => {
                        setCurrentPage(pNum);
                        window.scrollTo({ top: 150, behavior: 'smooth' });
                      }}
                      className={`w-8 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        currentPage === pNum
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/40'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => {
                  setCurrentPage((p) => Math.min(p + 1, totalPages));
                  window.scrollTo({ top: 150, behavior: 'smooth' });
                }}
                disabled={currentPage === totalPages}
                className="px-3 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 disabled:opacity-30 disabled:pointer-events-none text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                עמוד הבא
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
};

