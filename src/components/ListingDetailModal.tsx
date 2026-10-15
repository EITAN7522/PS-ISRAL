import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  MessageSquare, 
  Calendar, 
  Eye, 
  ShieldCheck, 
  Trash2, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Disc3,
  ExternalLink,
  ChevronRight,
  Share2
} from 'lucide-react';
import { MarketplaceListing, GameItem } from '../types';
import { ConditionBadge } from './ConditionBadge';
import { GameCover } from './GameCover';

interface ListingDetailModalProps {
  listing: MarketplaceListing | null;
  gameDetails?: GameItem;
  onClose: () => void;
  onDeleteListing: (id: string, passcode: string) => { success: boolean; message: string };
  onSelectGame?: (gameId: string) => void;
}

export const ListingDetailModal: React.FC<ListingDetailModalProps> = ({
  listing,
  gameDetails,
  onClose,
  onDeleteListing,
  onSelectGame,
}) => {
  const [phoneRevealed, setPhoneRevealed] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [deleteError, setDeleteError] = useState('');
  const [deleteSuccess, setDeleteSuccess] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!listing) return null;

  const isPs2 = listing.console === 'ps2';
  const isPs3 = listing.console === 'ps3';
  const consoleName = isPs3 ? 'PlayStation 3 (PS3 • שלוש 3)' : isPs2 ? 'PlayStation 2 (PS2 • שתיים 2)' : 'PlayStation 1 (PS1 • אחד 1)';

  // Clean phone number for links
  const cleanPhone = listing.phone.replace(/[^0-9]/g, '');
  const internationalPhone = cleanPhone.startsWith('0') 
    ? '972' + cleanPhone.substring(1) 
    : cleanPhone;

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setDeleteError('');
    setDeleteSuccess('');

    if (!passcode.trim()) {
      setDeleteError('אנא הזן קוד מחיקה.');
      return;
    }

    const res = onDeleteListing(listing.id, passcode);
    if (res.success) {
      setDeleteSuccess(res.message);
      setTimeout(() => {
        onClose();
      }, 1500);
    } else {
      setDeleteError(res.message);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const imagesList = listing.images && listing.images.length > 0 
    ? listing.images 
    : [listing.coverImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'];

  const formattedDate = new Date(listing.createdAt).toLocaleDateString('he-IL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

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
                : isPs3
                ? 'bg-red-600/30 text-red-300 border-red-500/40'
                : 'bg-slate-800 text-slate-200 border-slate-700'
            }`}>
              {consoleName} | {listing.region}
            </span>
            <span className="text-xs text-slate-400">
              פורסם ב-{formattedDate}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors text-xs flex items-center gap-1 cursor-pointer"
              title="שתף מודעה"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? 'הועתק!' : 'שתף'}</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              aria-label="סגור חלון"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            
            {/* Image Gallery Column */}
            <div className="md:col-span-5 space-y-3">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-950 border border-slate-800 flex items-center justify-center group shadow-inner">
                <GameCover
                  src={imagesList[selectedImageIndex] || imagesList[0]}
                  title={listing.gameTitle}
                  consoleType={listing.console}
                  serialNumber={listing.serialNumber}
                  aspectRatio="square"
                  className="w-full h-full"
                  imgClassName="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 z-10 pointer-events-none">
                  <ConditionBadge condition={listing.condition} size="md" />
                </div>
              </div>

              {/* Thumbnails if multiple images exist */}
              {imagesList.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {imagesList.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                        selectedImageIndex === idx
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-slate-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Authentic Box specs */}
              <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs space-y-1.5 text-slate-300">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">קופסה מקורית:</span>
                  <span className={listing.includesOriginalCase ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                    {listing.includesOriginalCase ? 'כן (כולל קופסה)' : 'ללא / חלופית'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">חוברת הפעלה (Manual):</span>
                  <span className={listing.includesManual ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                    {listing.includesManual ? 'כן (קיימת)' : 'לא קיימת'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">תקן ואיזור:</span>
                  <span className="font-mono text-blue-300">PAL (Europe / Israel 50Hz)</span>
                </div>
              </div>
            </div>

            {/* Info & Purchase Column */}
            <div className="md:col-span-7 space-y-5">
              
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
                  {listing.gameTitle}
                </h2>
                
                <div className="flex flex-wrap items-center gap-3 mt-2.5 text-sm text-slate-300">
                  <div className="flex items-center gap-1.5 text-blue-400 font-medium bg-blue-950/40 px-2.5 py-1 rounded-lg border border-blue-800/30">
                    <MapPin className="w-4 h-4" />
                    <span>{listing.city}</span>
                  </div>

                  <div className="flex items-center gap-1 text-slate-400 bg-slate-800/50 px-2.5 py-1 rounded-lg">
                    <Eye className="w-3.5 h-3.5" />
                    <span>{listing.viewsCount || 1} צפיות</span>
                  </div>
                </div>
              </div>

              {/* Price Banner */}
              <div className="p-4 bg-gradient-to-r from-slate-800/90 to-slate-900 rounded-xl border border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block">מחיר מבוקש:</span>
                  <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight">
                    {listing.price} <span className="text-xl sm:text-2xl font-sans font-bold">₪</span>
                  </div>
                </div>

                <div className="text-left">
                  <span className="text-xs text-slate-400 block mb-1">מצב המשחק:</span>
                  <ConditionBadge condition={listing.condition} size="lg" />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  תיאור המוכר
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 whitespace-pre-line min-h-[80px]">
                  {listing.description || 'לא הוזן תיאור נוסף על ידי המוכר.'}
                </p>
              </div>

              {/* Contact Seller Box (With Security Reveal) */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-blue-950/30 to-slate-900 border border-blue-900/50 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-blue-400" />
                    פרטי קשר עם המוכר
                  </h4>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    מספר מאומת
                  </span>
                </div>

                {!phoneRevealed ? (
                  <button
                    id="reveal-phone-btn"
                    onClick={() => setPhoneRevealed(true)}
                    className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl text-center shadow-lg shadow-blue-900/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Phone className="w-5 h-5" />
                    <span>לחץ להצגת מספר הטלפון המלא</span>
                  </button>
                ) : (
                  <div className="space-y-3 animate-fadeIn">
                    <div className="p-3 bg-slate-950 border border-blue-500/40 rounded-xl flex items-center justify-between">
                      <div className="text-right">
                        <span className="text-[11px] text-slate-400 block">טלפון ליצירת קשר:</span>
                        <span className="text-xl font-bold font-mono text-white tracking-wider dir-ltr select-all">
                          {listing.phone}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Call directly */}
                        <a
                          href={`tel:${listing.phone}`}
                          className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5 text-blue-400" />
                          חייג
                        </a>

                        {/* WhatsApp directly */}
                        <a
                          href={`https://wa.me/${internationalPhone}?text=${encodeURIComponent(`שלום, אני פונה לגבי המודעה שלך למשחק "${listing.gameTitle}" שפורסמה ב-VideoGamesIL.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          וואטסאפ
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Link to catalog game if available */}
              {gameDetails && onSelectGame && (
                <div className="flex items-center justify-between p-3 bg-slate-950/40 rounded-xl border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <Disc3 className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-slate-300">
                      מידע מורחב על המשחק במאגר: <strong className="text-white">{gameDetails.title}</strong>
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onClose();
                      onSelectGame(gameDetails.id);
                    }}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <span>צפה בדף המשחק</span>
                    <ChevronRight className="w-3.5 h-3.5 rotate-180" />
                  </button>
                </div>
              )}

            </div>

          </div>

          {/* Delete Listing Self-Service Area */}
          <div className="pt-4 border-t border-slate-800">
            {!deleteMode ? (
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>זו המודעה שלך? באפשרותך למחוק אותה בכל עת באמצעות הקוד הסודי שלך.</span>
                <button
                  onClick={() => setDeleteMode(true)}
                  className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>מחק מודעה זו</span>
                </button>
              </div>
            ) : (
              <form onSubmit={handleDelete} className="p-4 bg-rose-950/20 border border-rose-900/40 rounded-xl space-y-3 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5" />
                    מחיקת מודעה (נדרש קוד המחיקה שנקבע בפרסום)
                  </h4>
                  <button
                    type="button"
                    onClick={() => setDeleteMode(false)}
                    className="text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    ביטול
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="password"
                    placeholder="הזן קוד מחיקה (למשל: 1234)"
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-rose-500"
                    maxLength={10}
                  />
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    אשר מחיקה
                  </button>
                </div>

                {deleteError && (
                  <p className="text-xs text-rose-400 font-medium">{deleteError}</p>
                )}
                {deleteSuccess && (
                  <p className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {deleteSuccess}
                  </p>
                )}
              </form>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

