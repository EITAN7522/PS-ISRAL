import React, { useState, useMemo } from 'react';
import { 
  Search, 
  MapPin, 
  Tag, 
  SlidersHorizontal, 
  PlusCircle, 
  X, 
  Clock, 
  ArrowUpDown, 
  ShieldCheck, 
  Check,
  ChevronLeft,
  ShoppingBag,
  Layers,
  Gamepad2
} from 'lucide-react';
import { MarketplaceListing, FilterState, GameCondition, ConsoleType } from '../types';
import { ISRAELI_CITIES } from '../data/israeliCities';
import { ConditionBadge } from './ConditionBadge';
import { GameCover } from './GameCover';

interface MarketplaceViewProps {
  listings: MarketplaceListing[];
  onSelectListing: (listing: MarketplaceListing) => void;
  onNavigateToPublish: () => void;
  initialSearchQuery?: string;
  initialConsole?: 'all' | 'ps1' | 'ps2' | 'ps3';
}

export const MarketplaceView: React.FC<MarketplaceViewProps> = ({
  listings,
  onSelectListing,
  onNavigateToPublish,
  initialSearchQuery = '',
  initialConsole = 'all',
}) => {
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: initialSearchQuery,
    console: initialConsole,
    city: 'all',
    minPrice: '',
    maxPrice: '',
    condition: 'all',
    genre: 'all',
    releaseYear: 'all',
    sortBy: 'newest',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter listings
  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      // Console
      if (filters.console !== 'all') {
        if (item.console !== filters.console) return false;
      }

      // Game Name / Title search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchTitle = item.gameTitle.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCity = item.city.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCity) return false;
      }

      // City
      if (filters.city !== 'all') {
        if (item.city !== filters.city) return false;
      }

      // Min Price
      if (filters.minPrice && !isNaN(Number(filters.minPrice))) {
        if (item.price < Number(filters.minPrice)) return false;
      }

      // Max Price
      if (filters.maxPrice && !isNaN(Number(filters.maxPrice))) {
        if (item.price > Number(filters.maxPrice)) return false;
      }

      // Condition
      if (filters.condition !== 'all') {
        if (item.condition !== filters.condition) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filters.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (filters.sortBy === 'name') {
        return a.gameTitle.localeCompare(b.gameTitle);
      }
      return 0;
    });
  }, [listings, filters]);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      console: 'all',
      city: 'all',
      minPrice: '',
      maxPrice: '',
      condition: 'all',
      genre: 'all',
      releaseYear: 'all',
      sortBy: 'newest',
    });
  };

  const isFiltered = filters.searchQuery !== '' || 
    filters.console !== 'all' ||
    filters.city !== 'all' || 
    filters.minPrice !== '' || 
    filters.maxPrice !== '' || 
    filters.condition !== 'all';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-lg">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 text-xs font-semibold border border-emerald-800/40">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>לוח מודעות קהילתי • Sony PlayStation 1, PlayStation 2 & PlayStation 3 PAL בישראל</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            חיפוש משחקים למכירה ולהחלפה
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            חפש משחקי PS1, PS2 ו-PS3 מקוריים ממוכרים ואספנים בכל רחבי הארץ לפי קונסולה, עיר, טווח מחיר ומצב המוצר.
          </p>
        </div>

        <button
          onClick={onNavigateToPublish}
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition-all cursor-pointer flex-shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>פרסם משחק למכירה</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================== */}
        {/* DESKTOP FILTER SIDEBAR */}
        {/* ======================================================== */}
        <div className="hidden lg:block lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 sticky top-24 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-base text-white flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-blue-400" />
              סינון מודעות
            </h3>
            {isFiltered && (
              <button
                onClick={handleResetFilters}
                className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors cursor-pointer"
              >
                נקה הכל
              </button>
            )}
          </div>

          {/* 1. Console Selector */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              קונסולה:
            </label>
            <div className="grid grid-cols-4 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setFilters({ ...filters, console: 'all' })}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filters.console === 'all'
                    ? 'bg-blue-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                הכל
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, console: 'ps1' })}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filters.console === 'ps1'
                    ? 'bg-slate-300 text-slate-950 shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                PS1
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, console: 'ps2' })}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filters.console === 'ps2'
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                PS2
              </button>
              <button
                type="button"
                onClick={() => setFilters({ ...filters, console: 'ps3' })}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filters.console === 'ps3'
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                PS3
              </button>
            </div>
          </div>

          {/* 2. Game Name */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              שם המשחק:
            </label>
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="למשל: GTA, God of War, Crash..."
                value={filters.searchQuery}
                onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-9 pl-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* 3. Israeli City (Sorted A-Z) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>עיר מכירה:</span>
              <span className="text-[10px] text-slate-500 font-normal">לפי א'-ב'</span>
            </label>
            <select
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">כל ערי ישראל</option>
              {ISRAELI_CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Price Range (Min & Max in NIS) */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              טווח מחיר (בשקלים ₪):
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <input
                  type="number"
                  placeholder="מינימום ₪"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="relative">
                <input
                  type="number"
                  placeholder="מקסימום ₪"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* 5. Product Condition */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-300">
              מצב המוצר:
            </label>
            <div className="space-y-1">
              {[
                { label: 'הכל', val: 'all' },
                { label: 'חדש באריזה (Sealed)', val: 'חדש באריזה' },
                { label: 'חדש (Mint)', val: 'חדש' },
                { label: 'משומש (Good)', val: 'משומש' },
                { label: 'דרוש תיקון', val: 'דרוש תיקון' },
              ].map((cond) => (
                <label
                  key={cond.val}
                  className="flex items-center gap-2 text-xs text-slate-300 hover:text-white cursor-pointer py-1"
                >
                  <input
                    type="radio"
                    name="condition-filter"
                    checked={filters.condition === cond.val}
                    onChange={() => setFilters({ ...filters, condition: cond.val })}
                    className="text-blue-600 bg-slate-950 border-slate-700 focus:ring-blue-500"
                  />
                  <span>{cond.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Region standards */}
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
            <div className="flex items-center justify-between text-slate-400">
              <span>תקן אזורי:</span>
              <strong className="text-blue-400">PAL (Europe / Israel)</strong>
            </div>
            <div className="flex items-center justify-between text-slate-400">
              <span>קונסולות נתמכות:</span>
              <strong className="text-slate-300">PS1 & PS2</strong>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-3 bg-blue-950/20 border border-blue-900/30 rounded-xl text-[11px] text-slate-400 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
            <span>פרטי הקשר של המוכר מוגנים ויוצגו בעמוד המודעה המלא.</span>
          </div>

        </div>

        {/* ======================================================== */}
        {/* MAIN RESULTS COLUMN */}
        {/* ======================================================== */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Top Bar: Results Count & Sort Dropdown & Mobile Filter Button */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
                className="lg:hidden px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>סינון מודעות</span>
              </button>

              <span className="text-xs sm:text-sm text-slate-300">
                נמצאו <strong className="text-white font-bold">{filteredListings.length}</strong> מודעות למכירה
              </span>
            </div>

            {/* Sort Select */}
            <div className="flex items-center gap-2 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400">מיון:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
              >
                <option value="newest">הכי חדש שעלה</option>
                <option value="price-asc">מחיר: מהנמוך לגבוה</option>
                <option value="price-desc">מחיר: מהגבוה לנמוך</option>
                <option value="name">לפי שם משחק (א-ת)</option>
              </select>
            </div>
          </div>

          {/* Mobile Filter Expandable Drawer */}
          {mobileFilterOpen && (
            <div className="lg:hidden p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-white text-sm">סינון תוצאות</span>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="text-xs text-slate-400 hover:text-white cursor-pointer"
                >
                  סגור
                </button>
              </div>

              {/* Console */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">קונסולה:</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['all', 'ps1', 'ps2', 'ps3'] as const).map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setFilters({ ...filters, console: c })}
                      className={`py-1.5 rounded-lg text-xs font-bold ${
                        filters.console === c 
                          ? c === 'ps3' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white' 
                          : 'bg-slate-950 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {c === 'all' ? 'הכל' : c.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">עיר:</label>
                <select
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="all">כל ערי ישראל</option>
                  {ISRAELI_CITIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">מצב מוצר:</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                >
                  <option value="all">כל המצבים</option>
                  <option value="חדש באריזה">חדש באריזה</option>
                  <option value="חדש">חדש</option>
                  <option value="משומש">משומש</option>
                  <option value="דרוש תיקון">דרוש תיקון</option>
                </select>
              </div>

              {/* Price Min/Max */}
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="מחיר מינימום ₪"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
                <input
                  type="number"
                  placeholder="מחיר מקסימום ₪"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  className="bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white font-mono"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  החל סינון
                </button>
                <button
                  onClick={handleResetFilters}
                  className="px-3 py-2 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  איפוס
                </button>
              </div>
            </div>
          )}

          {/* Listings Cards Grid */}
          {filteredListings.length === 0 ? (
            <div className="p-12 text-center bg-slate-900/50 border border-slate-800 rounded-3xl space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-950/80 border border-blue-500/20 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 text-blue-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold text-white">
                  {listings.length === 0
                    ? 'לוח המכירות מוכן לקראת השקת האתר!'
                    : 'לא נמצאו מודעות מתאימות לחיפוש'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                  {listings.length === 0
                    ? 'עדיין לא פורסמו מודעות בלוח. יש לך משחקי PS1 או PS2 למכירה? היה הראשון שמפרסם!'
                    : 'נסה להרחיב את טווח המחירים או לבחור עיר אחרת ברשימה.'}
                </p>
              </div>
              <div className="flex justify-center gap-3 pt-2">
                {listings.length > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    נקה סינונים
                  </button>
                )}
                <button
                  onClick={onNavigateToPublish}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer shadow-lg shadow-blue-900/30"
                >
                  פרסם מודעה חדשה למכירה
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredListings.map((listing) => {
                const isPs2 = listing.console === 'ps2';
                return (
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
                        
                        <div className="absolute top-3 right-3">
                          <ConditionBadge condition={listing.condition} size="sm" />
                        </div>

                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase shadow-md ${
                            isPs2 
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border border-blue-400/40' 
                              : 'bg-slate-800/95 text-slate-200 border border-slate-600/40'
                          }`}>
                            {isPs2 ? 'PS2' : 'PS1'}
                          </span>
                          <span className="bg-slate-950/80 backdrop-blur-sm px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-300 border border-slate-700">
                            PAL
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4 space-y-2.5">
                        <h3 className="font-extrabold text-base text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                          {listing.gameTitle}
                        </h3>

                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="flex items-center gap-1 text-slate-300 font-medium">
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

                    {/* Card Footer with Price and Button required: "כפתור פרטי המודעה" */}
                    <div className="px-4 py-3 bg-slate-950/70 border-t border-slate-800/80 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-500 block">מחיר:</span>
                        <span className="text-xl font-extrabold font-mono text-emerald-400">
                          {listing.price} <span className="text-sm font-sans font-bold">₪</span>
                        </span>
                      </div>

                      <button
                        type="button"
                        className="px-3.5 py-1.5 bg-blue-600/20 group-hover:bg-blue-600 text-blue-400 group-hover:text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                      >
                        <span>פרטי המודעה</span>
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

