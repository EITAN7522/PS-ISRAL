import React, { useState } from 'react';
import { 
  Gamepad2, 
  Disc, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  HelpCircle, 
  Cpu, 
  Info, 
  ArrowLeft,
  CheckCircle2,
  Tv,
  Mail,
  User,
  Copy,
  Check,
  Send,
  Globe,
  ExternalLink
} from 'lucide-react';

interface AboutViewProps {
  onNavigateToPublish: () => void;
  onNavigateToDatabase: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigateToPublish,
  onNavigateToDatabase,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('y0771175@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 3000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-400 text-xs font-semibold">
          <Info className="w-4 h-4" />
          <span>אודות האתר ופרטי המערכת</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          VideoGamesIL
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          הפלטפורמה הישראלית הראשונה המוקדשת כולה לתיעוד, שימור, קנייה ומכירה של משחקי Sony PlayStation 1 בגרסת PAL.
        </p>
      </div>

      {/* Official Site Details & Contact Card */}
      <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-blue-950/30 to-slate-900 border border-blue-900/50 rounded-3xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400 flex-shrink-0">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">פרטי האתר והנהלה</h2>
              <span className="text-xs text-slate-400">מידע רשמי, פרטי בעלות ויצירת קשר</span>
            </div>
          </div>
          
          <div className="px-3.5 py-1.5 rounded-full bg-slate-950 border border-slate-800 text-xs font-medium text-slate-400">
            גרסת מערכת: <span className="text-blue-400 font-bold">1.0 PAL IL</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Site Name Block */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Gamepad2 className="w-4 h-4 text-blue-400" />
              <span>שם האתר</span>
            </div>
            <div className="text-lg font-extrabold text-white tracking-wide">
              VideoGamesIL
            </div>
            <p className="text-xs text-slate-400">
              המאגר ולוח המודעות הישראלי למשחקי PlayStation 1
            </p>
          </div>

          {/* Webmaster / Owner Block */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <User className="w-4 h-4 text-emerald-400" />
              <span>בעל האתר והמנהל</span>
            </div>
            <div className="text-lg font-extrabold text-white">
              Eitan Moshe
            </div>
            <p className="text-xs text-slate-400">
              ניהול תוכן, אבטחת מידע ופיתוח פלטפורמת הקהילה
            </p>
          </div>

          {/* Contact Email Block */}
          <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Mail className="w-4 h-4 text-indigo-400" />
              <span>מייל ליצירת קשר</span>
            </div>
            <div className="text-sm sm:text-base font-bold text-white font-mono dir-ltr select-all truncate">
              y0771175@gmail.com
            </div>
            <div className="flex items-center gap-2 pt-1">
              <a
                href="mailto:y0771175@gmail.com?subject=פנייה בנושא אתר VideoGamesIL"
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-lg transition-colors border border-blue-500/30"
              >
                <Send className="w-3 h-3" />
                <span>שלח מייל</span>
              </a>
              <button
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1 text-xs px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors cursor-pointer"
              >
                {copiedEmail ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400">הועתק!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>העתק כתובת</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

        {/* Official Copyright Notice */}
        <div className="p-4 bg-slate-950/60 rounded-2xl border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-right">
          <div className="flex items-center gap-2 font-medium text-slate-300">
            <ShieldCheck className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>© 2026 VideoGamesIL — כל הזכויות שמורות</span>
          </div>
          <span className="text-slate-500 text-[11px]">
            PlayStation והלוגואים הנלווים הינם סימנים מסחריים רשומים של Sony Interactive Entertainment.
          </span>
        </div>
      </div>

      {/* Main Info Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Block 1: Why PAL? */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
            <Tv className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">
            מדוע התמקדנו בגרסאות PAL?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            בשנות ה-90 (החל מ-1995 בישראל), קונסולת ה-PlayStation 1 שווקה בארץ בתקן השידור האירופאי <strong>PAL (50Hz)</strong>. 
            כל המשחקים הרשמיים שנמכרו בחנויות הצעצועים והגיימינג בישראל היו בעלי קודי מוצר <strong>SCES</strong> (משחקי סוני מקוריים) או <strong>SLES</strong> (משחקי צד שלישי).
          </p>
          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400">
            <strong className="text-white block mb-1">מאפייני דיסק PAL מקורי:</strong>
            הדיסקים המקוריים של PS1 יוצרו עם תחתית שחורה ייחודית (Black Bottom Disc) ובקופסאות פלסטיק עבות ומסיביות המגנות על הדיסק ועל חוברת ההדרכה.
          </div>
        </div>

        {/* Block 2: Safe Community Marketplace */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">
            לוח מודעות קהילתי ישיר ומאובטח
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            המטרה שלנו היא לחבר בין אספנים, שחקני נוסטלגיה ומוכרים פרטיים בכל רחבי ישראל, ללא עמלות תיווך ובשקיפות מלאה.
          </p>
          <ul className="space-y-2 text-xs text-slate-300">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>הגנה על פרטי המוכר – מספר הטלפון מוצג רק בלחיצה יזומה.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>מנגנון מחיקה עצמית של מודעה באמצעות קוד סודי אישי.</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>הגנה מפני בוטים וספאם עם בדיקת אימות אנושי.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Future Roadmap / Multi-Console Architecture */}
      <div className="p-8 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-900/50 rounded-3xl space-y-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-600/20 text-indigo-400 text-xs font-bold rounded-lg border border-indigo-500/30">
            <Cpu className="w-4 h-4" />
            <span>תוכנית התרחבות עתידית</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            מבנה קוד פתוח ומודולרי לקונסולות נוספות
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
            הפרויקט נבנה מראש בארכיטקטורה מודולרית המאפשרת הרחבה פשוטה למאגרי קונסולות נוספות. 
            כל מודל הנתונים והממשק תומכים בהוספת קטלוגים עתידיים:
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-950/80 rounded-xl border border-blue-500/40 space-y-1 text-center">
            <span className="text-xs font-bold text-blue-400 block">שלב 1 (פעיל כעת)</span>
            <h4 className="font-extrabold text-white text-base">PlayStation 1</h4>
            <span className="text-[11px] text-emerald-400 font-semibold">2,165 משחקי PAL</span>
          </div>

          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-1 text-center opacity-80">
            <span className="text-xs font-bold text-slate-500 block">שלב 2 (בקרוב)</span>
            <h4 className="font-extrabold text-white text-base">PlayStation 2</h4>
            <span className="text-[11px] text-slate-400">דור ה-DVD ו-PAL</span>
          </div>

          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-1 text-center opacity-80">
            <span className="text-xs font-bold text-slate-500 block">שלב 3</span>
            <h4 className="font-extrabold text-white text-base">Nintendo 64</h4>
            <span className="text-[11px] text-slate-400">קלטות ורטרו</span>
          </div>

          <div className="p-4 bg-slate-950/50 rounded-xl border border-slate-800 space-y-1 text-center opacity-80">
            <span className="text-xs font-bold text-slate-500 block">שלב 4</span>
            <h4 className="font-extrabold text-white text-base">Xbox Original</h4>
            <span className="text-[11px] text-slate-400">הדור הראשון</span>
          </div>
        </div>
      </div>

      {/* Retro Tips */}
      <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          מדריך לאספן: כיצד לבדוק תקינות משחק PS1 לפני קנייה?
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
            <strong className="text-white block font-semibold">1. בדיקת תחתית הדיסק</strong>
            <p className="text-slate-400 leading-relaxed">
              הסתכלו מול מקור אור. שריטות מעגליות עמוקות עלולות למנוע מהעין לקרוא נתונים, בעוד שריטות שטחיות ניתנות לליטוש.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
            <strong className="text-white block font-semibold">2. שלמות הקופסה (Jewel Case)</strong>
            <p className="text-slate-400 leading-relaxed">
              הקופסאות של PS1 PAL ידועות בשבירות שיני המרכז (Spindle). בדקו אם השיניים שלמות והדיסק מוחזק היטב.
            </p>
          </div>

          <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1.5">
            <strong className="text-white block font-semibold">3. קוד האזור והקונסולה</strong>
            <p className="text-slate-400 leading-relaxed">
              ודאו שקונסולת ה-PS1 שלכם היא מדגם PAL אירופאי (SCPH-xxxx) התואם את הדיסקים ללא צורך בצ'יפ מיוחד.
            </p>
          </div>
        </div>
      </div>

      {/* Action CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <button
          onClick={onNavigateToDatabase}
          className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer"
        >
          צפה במאגר המשחקים
        </button>
        <button
          onClick={onNavigateToPublish}
          className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-colors cursor-pointer shadow-lg shadow-blue-900/30"
        >
          פרסם משחק למכירה באתר
        </button>
      </div>

    </div>
  );
};
