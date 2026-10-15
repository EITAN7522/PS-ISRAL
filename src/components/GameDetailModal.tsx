import React from 'react';
import { 
  X, 
  Disc, 
  Calendar, 
  Users, 
  Building, 
  Tag, 
  ShoppingBag, 
  PlusCircle, 
  MapPin, 
  ChevronLeft,
  Sparkles,
  ExternalLink,
  Search
} from 'lucide-react';
import { GameItem, MarketplaceListing } from '../types';
import { ConditionBadge } from './ConditionBadge';
import { GameCover } from './GameCover';

interface GameDetailModalProps {
  game: GameItem | null;
  listings: MarketplaceListing[];
  onClose: () => void;
  onSelectListing: (listing: MarketplaceListing) => void;
  onPublishForGame?: (game: GameItem) => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  listings,
  onClose,
  onSelectListing,
}) => {
  if (!game) return null;

  const isPs3 = game.console === 'ps3';
  const isPs2 = game.console === 'ps2';
  const consoleTitle = isPs3 ? 'PlayStation 3' : isPs2 ? 'PlayStation 2' : 'PlayStation 1';

  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${game.title} ${isPs2 ? 'PS2 PAL cover' : 'PS1 PAL cover'}`)}`;
  const ebaySearchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${game.title} ${isPs2 ? 'PS2' : 'PS1'} PAL`)}`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 animate-fadeIn">
      
      <div 
        className="relative w-full max-w-3xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 text-xs font-black rounded uppercase border ${
              isPs2 
                ? 'bg-blue-600/30 text-blue-300 border-blue-500/40'
                : 'bg-slate-800 text-slate-200 border-slate-700'
            }`}>
              {consoleTitle} | {game.region}
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              קוד: {game.serialNumber}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            aria-label="סגור חלון"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Cover Column */}
            <div className="md:col-span-5 space-y-4">
              <div className="rounded-xl overflow-hidden shadow-2xl">
                <GameCover
                  game={game}
                  enableGoogleSearchHover={false}
                  className="rounded-xl border border-slate-700 shadow-lg"
                />
              </div>

              {/* Direct HD Links for Collectors */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                <p className="text-[11px] text-slate-400 font-semibold flex items-center gap-1">
                  <Search className="w-3 h-3 text-blue-400" />
                  <span>חיפוש תמונות ועטיפות ברזולוציה גבוהה:</span>
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={googleImagesUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>Google עטיפות</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={ebaySearchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <span>חיפוש ב-eBay</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              {/* Technical PAL Specs */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-2.5 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <span className="text-slate-400">שנת יציאה:</span>
                  <span className="font-semibold text-white">{game.releaseYear}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <span className="text-slate-400">ז'אנר:</span>
                  <span className="font-semibold text-blue-300">{game.genre}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <span className="text-slate-400">מפתחת:</span>
                  <span className="font-semibold text-slate-200">{game.developer}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <span className="text-slate-400">מפיצה:</span>
                  <span className="font-semibold text-slate-200">{game.publisher}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
                  <span className="text-slate-400">מספר שחקנים:</span>
                  <span className="font-semibold text-slate-200">{game.players}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">פורמט מדיה:</span>
                  <span className="font-semibold text-slate-200">
                    {game.discsCount || 1} דיסק ({isPs2 ? 'DVD-ROM כסוף/כחול' : 'CD-ROM שחור מקורי'})
                  </span>
                </div>
              </div>
            </div>

            {/* Content Column */}
            <div className="md:col-span-7 space-y-5">
              
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {game.title}
                  </h2>
                </div>
                {game.hebrewTitle && (
                  <p className="text-base text-blue-400 font-medium mt-0.5">
                    {game.hebrewTitle}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  על המשחק
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {game.descriptionHe}
                </p>
              </div>

              {/* Active Listings for this game */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-400" />
                    מודעות מכירה פעילות עבור משחק זה ({listings.length})
                  </h4>
                </div>

                {listings.length === 0 ? (
                  <div className="p-6 bg-slate-950/50 rounded-xl border border-slate-800/80 text-center space-y-2">
                    <p className="text-sm text-slate-400">
                      אין כרגע מודעות מכירה פעילות עבור משחק זה בלוח.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                    {listings.map((l) => (
                      <div
                        key={l.id}
                        onClick={() => {
                          onClose();
                          onSelectListing(l);
                        }}
                        className="p-3 bg-slate-950/80 hover:bg-slate-800/80 rounded-xl border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 flex-shrink-0">
                            <img src={l.coverImage || game.coverImage} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-semibold text-white group-hover:text-blue-400 transition-colors">
                                {l.gameTitle}
                              </span>
                              <ConditionBadge condition={l.condition} size="sm" />
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                              <span className="flex items-center gap-0.5">
                                <MapPin className="w-3 h-3 text-blue-400" />
                                {l.city}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-left">
                            <span className="text-sm font-bold text-emerald-400 font-mono">
                              {l.price} ₪
                            </span>
                          </div>
                          <ChevronLeft className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
