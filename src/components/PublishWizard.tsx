import React, { useState, useEffect } from 'react';
import { 
  Check, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  MapPin, 
  Tag, 
  Phone, 
  Image as ImageIcon, 
  FileText, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Upload, 
  Disc, 
  Plus, 
  CheckCircle2,
  HelpCircle,
  Camera,
  Layers
} from 'lucide-react';
import { GameItem, GameCondition, MarketplaceListing, ConsoleType } from '../types';
import { ISRAELI_CITIES } from '../data/israeliCities';
import { ConditionBadge } from './ConditionBadge';
import { GameCover } from './GameCover';

interface PublishWizardProps {
  gamesCatalog: GameItem[];
  initialSelectedGame?: GameItem | null;
  onPublishSuccess: (listing: MarketplaceListing) => void;
  onCancel: () => void;
}

export const PublishWizard: React.FC<PublishWizardProps> = ({
  gamesCatalog,
  initialSelectedGame,
  onPublishSuccess,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Form State
  const [chosenConsole, setChosenConsole] = useState<ConsoleType>(initialSelectedGame?.console || 'ps1');
  const [catalogConsoleFilter, setCatalogConsoleFilter] = useState<'all' | 'ps1' | 'ps2' | 'ps3'>(initialSelectedGame?.console || 'all');
  const [selectedGameId, setSelectedGameId] = useState<string>(initialSelectedGame?.id || '');
  const [customGameTitle, setCustomGameTitle] = useState<string>('');
  const [customGameConsole, setCustomGameConsole] = useState<ConsoleType>('ps1');
  const [isCustomGame, setIsCustomGame] = useState<boolean>(false);
  const [gameSearchQuery, setGameSearchQuery] = useState<string>('');

  const [selectedCity, setSelectedCity] = useState<string>('');
  const [citySearchQuery, setCitySearchQuery] = useState<string>('');

  const [condition, setCondition] = useState<GameCondition>('משומש');
  const [includesManual, setIncludesManual] = useState<boolean>(true);
  const [includesOriginalCase, setIncludesOriginalCase] = useState<boolean>(true);

  const [price, setPrice] = useState<string>('');

  const [phone, setPhone] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [deletePasscode, setDeletePasscode] = useState<string>('1234');
  
  // Anti-spam Math Captcha
  const [captchaNum1, setCaptchaNum1] = useState<number>(4);
  const [captchaNum2, setCaptchaNum2] = useState<number>(3);
  const [userCaptchaAnswer, setUserCaptchaAnswer] = useState<string>('');

  // Initialize anti-spam question
  useEffect(() => {
    const n1 = Math.floor(Math.random() * 8) + 2;
    const n2 = Math.floor(Math.random() * 7) + 1;
    setCaptchaNum1(n1);
    setCaptchaNum2(n2);
  }, []);

  // Update selected game if passed via prop
  useEffect(() => {
    if (initialSelectedGame) {
      setSelectedGameId(initialSelectedGame.id);
      setChosenConsole(initialSelectedGame.console);
      setCatalogConsoleFilter(initialSelectedGame.console);
      setIsCustomGame(false);
    }
  }, [initialSelectedGame]);

  const selectedGame = gamesCatalog.find((g) => g.id === selectedGameId);

  // Filtered games for step 1
  const filteredGames = gamesCatalog.filter((g) => {
    if (catalogConsoleFilter !== 'all' && g.console !== catalogConsoleFilter) {
      return false;
    }
    if (!gameSearchQuery.trim()) return true;
    const q = gameSearchQuery.toLowerCase().trim();
    return (
      g.title.toLowerCase().includes(q) ||
      (g.hebrewTitle && g.hebrewTitle.includes(q)) ||
      g.serialNumber.toLowerCase().includes(q) ||
      g.genre.toLowerCase().includes(q)
    );
  });

  // Filtered Israeli cities for step 2
  const filteredCities = ISRAELI_CITIES.filter((c) => {
    if (!citySearchQuery.trim()) return true;
    return c.includes(citySearchQuery.trim());
  });

  // Phone validation (Israeli format)
  const validatePhone = (phoneNumber: string): boolean => {
    const clean = phoneNumber.replace(/[^0-9]/g, '');
    // Mobile numbers in Israel: 10 digits starting with 05 (050, 052, 053, 054, 055, 058)
    // Or landlines: 9 digits starting with 02, 03, 04, 08, 09, or 07
    return (clean.length === 10 && clean.startsWith('05')) || 
           (clean.length === 9 && clean.startsWith('0')) ||
           (clean.length === 10 && clean.startsWith('07'));
  };

  // Image Upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('גודל התמונה עולה על 5MB, אנא בחר תמונה קטנה יותר.');
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Step Validation before going forward
  const validateAndNext = () => {
    setErrorMessage('');

    if (currentStep === 1) {
      if (isCustomGame) {
        if (!customGameTitle.trim()) {
          setErrorMessage('אנא הזן את שם המשחק.');
          return;
        }
      } else {
        if (!selectedGameId) {
          setErrorMessage('אנא בחר משחק מתוך המאגר או בחר בהזנת שם ידנית.');
          return;
        }
      }
      setCurrentStep(2);
      return;
    }

    if (currentStep === 2) {
      if (!selectedCity) {
        setErrorMessage('אנא בחר עיר בישראל מתוך הרשימה המסודרת.');
        return;
      }
      setCurrentStep(3);
      return;
    }

    if (currentStep === 3) {
      if (!condition) {
        setErrorMessage('אנא בחר את מצב המוצר.');
        return;
      }
      setCurrentStep(4);
      return;
    }

    if (currentStep === 4) {
      const numPrice = Number(price);
      if (!price || isNaN(numPrice) || numPrice <= 0) {
        setErrorMessage('אנא הזן מחיר תקין בשקלים (מעל 0 ₪).');
        return;
      }
      setCurrentStep(5);
      return;
    }

    if (currentStep === 5) {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    setErrorMessage('');

    // Check Phone
    if (!phone.trim()) {
      setErrorMessage('אנא הזן מספר טלפון ליצירת קשר.');
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMessage('מספר הטלפון שהוזן אינו תקין. יש להזין מספר ישראלי תקין (למשל: 052-1234567).');
      return;
    }

    // Check Captcha
    const expected = captchaNum1 + captchaNum2;
    if (Number(userCaptchaAnswer.trim()) !== expected) {
      setErrorMessage(`תשובה שגויה לבדיקת האנטי-ספאם: כמה זה ${captchaNum1} + ${captchaNum2}?`);
      return;
    }

    // Check Passcode
    if (!deletePasscode.trim()) {
      setErrorMessage('אנא קבע קוד מחיקה בן 4 ספרות לשמירת המודעה.');
      return;
    }

    const consoleToSave: ConsoleType = isCustomGame 
      ? customGameConsole 
      : (selectedGame?.console || 'ps1');

    // Title determination
    const finalTitle = isCustomGame
      ? customGameTitle.trim()
      : selectedGame ? `${selectedGame.title} (PAL)` : `משחק PlayStation ${consoleToSave === 'ps2' ? '2' : '1'} PAL`;

    const finalCover = uploadedImages.length > 0 
      ? uploadedImages[0] 
      : selectedGame?.coverImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80';

    const newListingData: Omit<MarketplaceListing, 'id' | 'createdAt' | 'viewsCount'> = {
      gameId: isCustomGame ? `custom-${Date.now()}` : selectedGameId,
      gameTitle: finalTitle,
      console: consoleToSave,
      region: 'PAL',
      city: selectedCity,
      condition,
      price: Number(price),
      phone: phone.trim(),
      description: description.trim() || `גרסת PAL מקורית ל-PlayStation ${consoleToSave === 'ps2' ? '2' : '1'}.`,
      images: uploadedImages.length > 0 ? uploadedImages : [finalCover],
      deletePasscode: deletePasscode.trim(),
      includesManual,
      includesOriginalCase,
    };

    onPublishSuccess(newListingData as any);
  };

  const stepsInfo = [
    { num: 1, title: 'בחירת משחק', desc: 'מאגר PS1 / PS2' },
    { num: 2, title: 'עיר מכירה', desc: 'רשימת ערי ישראל א-ב' },
    { num: 3, title: 'מצב המוצר', desc: 'איכות הדיסק והקופסה' },
    { num: 4, title: 'קביעת מחיר', desc: 'מחיר בשקלים (₪)' },
    { num: 5, title: 'פרטי קשר וסיום', desc: 'טלפון, תמונות ואבטחה' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Header */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-600/15 border border-blue-500/30 rounded-full text-blue-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>פרסום מודעה ב-5 שלבים פשוטים</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          פרסום משחק למכירה (PlayStation 1 & 2 PAL)
        </h1>
        <p className="text-sm text-slate-400 max-w-lg mx-auto">
          מלא את פרטי המשחק שלב אחר שלב. המודעה תפורסם מיד באתר ותהיה זמינה לכל הגיימרים והאספנים בישראל.
        </p>
      </div>

      {/* Stepper Progress Bar */}
      <div className="mb-8 bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="grid grid-cols-5 gap-1 sm:gap-2">
          {stepsInfo.map((s) => {
            const isCompleted = currentStep > s.num;
            const isCurrent = currentStep === s.num;

            return (
              <div 
                key={s.num}
                onClick={() => {
                  if (s.num < currentStep) setCurrentStep(s.num);
                }}
                className={`flex flex-col items-center text-center p-2 rounded-xl transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-blue-600/20 border border-blue-500/40 text-white'
                    : isCompleted
                    ? 'text-emerald-400 hover:bg-slate-800/50'
                    : 'text-slate-500 opacity-60 cursor-not-allowed'
                }`}
              >
                <div 
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm mb-1.5 transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white ring-4 ring-blue-600/30'
                      : isCompleted
                      ? 'bg-emerald-500 text-slate-950 font-extrabold'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : s.num}
                </div>
                
                <span className="text-xs font-semibold leading-tight hidden sm:block">
                  {s.title}
                </span>
                <span className="text-[10px] text-slate-400 hidden md:block">
                  שלב {s.num}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Card Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        
        {/* Error Alert Box */}
        {errorMessage && (
          <div className="p-4 bg-rose-500/15 border-b border-rose-500/30 text-rose-300 text-sm flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="p-6 sm:p-8">

          {/* ======================================================== */}
          {/* STEP 1: SELECT GAME */}
          {/* ======================================================== */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
                  שלב 1: בחירת משחק מתוך מאגר Sony PlayStation 1, 2 & 3
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  חפש ובחר את המשחק שברצונך למכור מתוך מאגר ה-PAL הרשמי.
                </p>
              </div>

              {/* Toggle custom vs catalog */}
              <div className="flex gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCustomGame(false)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    !isCustomGame
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  בחירה ממאגר המשחקים הרשמי ({gamesCatalog.length.toLocaleString()} כותרים)
                </button>
                <button
                  type="button"
                  onClick={() => setIsCustomGame(true)}
                  className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                    isCustomGame
                      ? 'bg-blue-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  הזנת משחק ידנית שאינו ברשימה
                </button>
              </div>

              {!isCustomGame ? (
                <div className="space-y-4">
                  {/* Console filter buttons */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-slate-400 font-semibold">סינון לפי קונסולה:</span>
                    <div className="flex gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      {[
                        { id: 'all', label: 'הכל' },
                        { id: 'ps1', label: 'PlayStation 1' },
                        { id: 'ps2', label: 'PlayStation 2' },
                        { id: 'ps3', label: 'PlayStation 3' },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setCatalogConsoleFilter(tab.id as any)}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                            catalogConsoleFilter === tab.id
                              ? tab.id === 'ps3' ? 'bg-red-600 text-white shadow' : 'bg-blue-600 text-white shadow'
                              : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Search Bar for Games */}
                  <div className="relative">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      placeholder="חפש לפי שם משחק (GTA, Crash, Tekken, God of War, Resident Evil...)"
                      value={gameSearchQuery}
                      onChange={(e) => setGameSearchQuery(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Games Selection Grid */}
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>
                      נמצאו <strong>{filteredGames.length.toLocaleString()}</strong> משחקים
                      {filteredGames.length > 60 && ' (מציג 60 ראשונים - הקלד לחיפוש מהיר ומדויק)'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
                    {filteredGames.slice(0, 60).map((game) => {
                      const isSelected = selectedGameId === game.id;
                      const isPs2 = game.console === 'ps2';
                      return (
                        <div
                          key={game.id}
                          onClick={() => {
                            setSelectedGameId(game.id);
                            setChosenConsole(game.console);
                          }}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 ${
                            isSelected
                              ? 'bg-blue-600/20 border-blue-500 ring-2 ring-blue-500/20 shadow-md'
                              : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                          }`}
                        >
                          <div className="w-12 h-14 rounded-lg overflow-hidden flex-shrink-0">
                            <GameCover
                              game={game}
                              alt={game.title}
                              aspectRatio="auto"
                              className="w-full h-full rounded-lg"
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-white truncate">
                                {game.title}
                              </h4>
                              {isSelected && <Check className="w-4 h-4 text-blue-400 flex-shrink-0" />}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-1">
                              <span className={`px-1.5 py-0.2 rounded font-black text-[9px] ${
                                isPs2 ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'
                              }`}>
                                {isPs2 ? 'PS2' : 'PS1'}
                              </span>
                              <span className="text-blue-300 font-mono">{game.serialNumber}</span>
                              <span>•</span>
                              <span>{game.releaseYear}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {selectedGame && (
                    <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <div className="text-xs">
                        <span className="text-slate-400">נבחר המשחק: </span>
                        <strong className="text-white font-semibold">{selectedGame.title}</strong>
                        <span className="text-slate-400 font-mono"> (PlayStation {selectedGame.console === 'ps2' ? '2' : '1'} | {selectedGame.serialNumber} - {selectedGame.releaseYear})</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      קונסולה:
                    </label>
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      <button
                        type="button"
                        onClick={() => setCustomGameConsole('ps1')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          customGameConsole === 'ps1'
                            ? 'bg-blue-600 text-white border-blue-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        PlayStation 1
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomGameConsole('ps2')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          customGameConsole === 'ps2'
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        PlayStation 2
                      </button>
                      <button
                        type="button"
                        onClick={() => setCustomGameConsole('ps3')}
                        className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                          customGameConsole === 'ps3'
                            ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white border-red-400'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}
                      >
                        PlayStation 3
                      </button>
                    </div>

                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      שם המשחק המלא:
                    </label>
                    <input
                      type="text"
                      placeholder="לדוגמה: Shadow of the Colossus, Silent Hill..."
                      value={customGameTitle}
                      onChange={(e) => setCustomGameTitle(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">
                    * המודעה תסווג תחת PlayStation {customGameConsole === 'ps2' ? '2' : '1'} | גרסת PAL.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 2: ISRAELI CITY */}
          {/* ======================================================== */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
                  שלב 2: עיר מכירה בישראל
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  בחר את העיר שבה מתבצעת המכירה או האיסוף מתוך הרשימה המסודרת לפי א'-ב'.
                </p>
              </div>

              {/* City Search and Select */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="סנן ערים (למשל: תל אביב, חיפה, ירושלים, ראשון לציון...)"
                    value={citySearchQuery}
                    onChange={(e) => setCitySearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1">
                  {filteredCities.map((cityName) => {
                    const isSelected = selectedCity === cityName;
                    return (
                      <button
                        key={cityName}
                        type="button"
                        onClick={() => setSelectedCity(cityName)}
                        className={`p-2.5 rounded-xl border text-right transition-all flex items-center justify-between text-xs ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-500 font-bold shadow'
                            : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <span className="truncate">{cityName}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 flex-shrink-0 text-white" />}
                      </button>
                    );
                  })}
                </div>

                {selectedCity && (
                  <div className="p-3 bg-blue-950/30 border border-blue-800/40 rounded-xl flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
                    <span className="text-xs text-slate-300">
                      עיר שנבחרה להצגה במודעה: <strong className="text-white font-bold">{selectedCity}</strong>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 3: CONDITION */}
          {/* ======================================================== */}
          {currentStep === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">3</span>
                  שלב 3: מצב המוצר
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  בחר את המצב המדויק של הדיסק והאריזה בהתאם למצבו הפיזי.
                </p>
              </div>

              {/* 4 Conditions defined by the prompt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* דרוש תיקון */}
                <div
                  onClick={() => setCondition('דרוש תיקון')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    condition === 'דרוש תיקון'
                      ? 'bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ConditionBadge condition="דרוש תיקון" size="md" />
                    {condition === 'דרוש תיקון' && <Check className="w-4 h-4 text-rose-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    דיסק עם שריטות שעלול להיתקע, קופסה שבורה או מוצר שדורש ליטוש/תיקון כדי לפעול כראוי.
                  </p>
                </div>

                {/* משומש */}
                <div
                  onClick={() => setCondition('משומש')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    condition === 'משומש'
                      ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ConditionBadge condition="משומש" size="md" />
                    {condition === 'משומש' && <Check className="w-4 h-4 text-amber-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    משחק משומש שנבדק ועובד באופן תקין לחלוטין. כולל סימני שימוש קלים רגילים לגיל המוצר.
                  </p>
                </div>

                {/* חדש */}
                <div
                  onClick={() => setCondition('חדש')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    condition === 'חדש'
                      ? 'bg-blue-950/30 border-blue-500 ring-2 ring-blue-500/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ConditionBadge condition="חדש" size="md" />
                    {condition === 'חדש' && <Check className="w-4 h-4 text-blue-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    מצב מושלם (Mint / Near Mint). דיסק נקי ללא שריטות, קופסה וחוברת שלמות ללא פגמים.
                  </p>
                </div>

                {/* חדש באריזה */}
                <div
                  onClick={() => setCondition('חדש באריזה')}
                  className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                    condition === 'חדש באריזה'
                      ? 'bg-emerald-950/30 border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <ConditionBadge condition="חדש באריזה" size="md" />
                    {condition === 'חדש באריזה' && <Check className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    מוצר אטום מהמפעל בניילון המקורי (Factory Sealed) עם רצועת Sony PlayStation מקורית.
                  </p>
                </div>

              </div>

              {/* Extra checkboxes */}
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <span className="text-xs font-semibold text-slate-300 block">תוספות למודעה:</span>
                
                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includesOriginalCase}
                    onChange={(e) => setIncludesOriginalCase(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>כולל קופסה מקורית של Sony PlayStation (PAL Case / Jewel Case)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includesManual}
                    onChange={(e) => setIncludesManual(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-blue-600 focus:ring-blue-500"
                  />
                  <span>כולל חוברת הפעלה מקורית (Manual)</span>
                </label>
              </div>

            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 4: PRICE */}
          {/* ======================================================== */}
          {currentStep === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">4</span>
                  שלב 4: קביעת מחיר בשקלים
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  קבע את המחיר שבו תרצה למכור את המשחק. המחיר יוצג במודעה בשקלים (₪).
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl text-center space-y-4">
                  <label className="text-sm font-medium text-slate-300 block">
                    הכנס מחיר מבוקש:
                  </label>

                  <div className="relative inline-block w-full">
                    <input
                      type="number"
                      min="1"
                      max="9999"
                      step="5"
                      placeholder="150"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full text-center text-4xl sm:text-5xl font-mono font-extrabold bg-slate-900 border-2 border-slate-700 rounded-2xl py-4 px-12 text-emerald-400 focus:outline-none focus:border-emerald-500 shadow-inner"
                    />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl sm:text-3xl font-bold text-slate-400 select-none">
                      ₪
                    </span>
                  </div>

                  {/* Quick price chips */}
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {[50, 80, 120, 150, 200, 300].map((pVal) => (
                      <button
                        key={pVal}
                        type="button"
                        onClick={() => setPrice(pVal.toString())}
                        className="px-3 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-mono border border-slate-800 transition-colors"
                      >
                        {pVal} ₪
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 bg-blue-950/20 border border-blue-800/30 rounded-xl text-xs text-slate-300 space-y-1">
                  <span className="font-semibold text-blue-400 block">טיפ לתמחור משחקים:</span>
                  <p className="text-slate-400 leading-relaxed">
                    משחקים נפוצים (FIFA, משחקי ספורט) נעים בדרך כלל בין 30 ל-70 ₪, בעוד קלאסיקות מבוקשות (Final Fantasy, Silent Hill, God of War, GTA, Crash) מתומחרים ב-120–350 ₪ ומעלה.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* STEP 5: CONTACT, IMAGES, SECURITY */}
          {/* ======================================================== */}
          {currentStep === 5 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="border-b border-slate-800 pb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">5</span>
                  שלב 5: פרטי קשר, תמונות ואבטחה
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  הזן מספר טלפון ליצירת קשר, תיאור המשחק, תמונות וקוד מחיקה אישי.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Left Side: Contact & Details */}
                <div className="space-y-4">
                  
                  {/* Phone input */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      מספר טלפון ליצירת קשר *
                    </label>
                    <div className="relative">
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        dir="ltr"
                        placeholder="050-1234567"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 rounded-xl pr-10 pl-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 font-mono text-right"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      * מטעמי אבטחה, מספר הטלפון יוצג רק בעמוד המודעה עצמו לאחר לחיצת משתמש, ולא ברשימת החיפוש הכללית.
                    </p>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      תיאור קצר של המוצר (אופציונלי):
                    </label>
                    <textarea
                      rows={3}
                      placeholder="פרט על מצב הדיסק, אפשרות למשלוח בדואר, שעות נוחות לאיסוף..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* Security / Anti-Spam Captcha */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      אימות אנושי נגד ספאם:
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-blue-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 font-mono">
                        {captchaNum1} + {captchaNum2} = ?
                      </span>
                      <input
                        type="number"
                        placeholder="תשובה"
                        value={userCaptchaAnswer}
                        onChange={(e) => setUserCaptchaAnswer(e.target.value)}
                        className="w-24 bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono text-center focus:outline-none focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Delete Passcode */}
                  <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200">
                      <Lock className="w-4 h-4 text-blue-400" />
                      קוד מחיקת מודעה (לשימושך בעתיד למחיקה):
                    </div>
                    <input
                      type="text"
                      maxLength={10}
                      value={deletePasscode}
                      onChange={(e) => setDeletePasscode(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white font-mono focus:outline-none focus:border-blue-500"
                      placeholder="קוד סודי (לדוגמה: 1234)"
                    />
                  </div>

                </div>

                {/* Right Side: Photo Upload & Summary Preview */}
                <div className="space-y-4">
                  
                  {/* Photo Upload Area */}
                  <div>
                    <label className="block text-xs font-bold text-slate-200 mb-1">
                      העלאת תמונות של המשחק שברשותך (אופציונלי):
                    </label>

                    <div className="border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-4 text-center bg-slate-950/60 transition-all">
                      <input
                        type="file"
                        id="wizard-file-input"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="wizard-file-input"
                        className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-2"
                      >
                        <div className="w-10 h-10 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center">
                          <Camera className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-blue-400 hover:underline">
                          לחץ להעלאת תמונות מהמכשיר
                        </span>
                        <span className="text-[10px] text-slate-500">
                          (JPG, PNG עד 5MB. אם לא תעלה, נשתמש בעטיפה הרשמית של המשחק מהמאגר)
                        </span>
                      </label>
                    </div>

                    {/* Previews of uploaded images */}
                    {uploadedImages.length > 0 && (
                      <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                        {uploadedImages.map((imgUrl, i) => (
                          <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-blue-500 flex-shrink-0 group">
                            <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setUploadedImages(uploadedImages.filter((_, idx) => idx !== i))}
                              className="absolute inset-0 bg-rose-950/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                            >
                              הסר
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      סיכום פרטי המודעה:
                    </h4>
                    
                    <div className="text-xs space-y-1.5 text-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">קונסולה:</span>
                        <span className="font-bold text-blue-400">
                          PlayStation {((isCustomGame ? customGameConsole : selectedGame?.console) === 'ps2') ? '2' : '1'} (PAL)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">משחק:</span>
                        <span className="font-semibold text-white truncate max-w-[180px]">
                          {isCustomGame ? customGameTitle : selectedGame?.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">עיר:</span>
                        <span className="font-semibold text-white">{selectedCity || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">מצב:</span>
                        <span className="font-semibold text-white">{condition}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">מחיר:</span>
                        <span className="font-bold text-emerald-400 font-mono">{price || '0'} ₪</span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

        </div>

        {/* Wizard Footer Navigation */}
        <div className="px-6 sm:px-8 py-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          
          <div>
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => {
                  setErrorMessage('');
                  setCurrentStep((prev) => Math.max(prev - 1, 1));
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
                <span>חזור לשלב הקודם</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
              >
                ביטול
              </button>
            )}
          </div>

          <div>
            {currentStep < 5 ? (
              <button
                type="button"
                id="wizard-next-btn"
                onClick={validateAndNext}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-lg shadow-blue-900/30 transition-all cursor-pointer"
              >
                <span>המשך לשלב הבא</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                id="wizard-publish-final-btn"
                onClick={validateAndNext}
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-sm font-extrabold flex items-center gap-2 shadow-xl shadow-emerald-950 transition-all cursor-pointer animate-pulse"
              >
                <Sparkles className="w-4 h-4" />
                <span>פרסם משחק למכירה</span>
              </button>
            )}
          </div>

        </div>

      </div>

    </div>
  );
};

