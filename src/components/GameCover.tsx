import React, { useState } from 'react';
import { Disc, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { GameItem, ConsoleType } from '../types';

interface GameCoverProps {
  game?: Partial<GameItem> | null;
  src?: string;
  alt?: string;
  consoleType?: ConsoleType;
  serialNumber?: string;
  title?: string;
  aspectRatio?: 'auto' | 'square' | 'dvd' | 'bluray' | 'custom';
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  enableGoogleSearchHover?: boolean;
}

export const GameCover: React.FC<GameCoverProps> = ({
  game,
  src,
  alt,
  consoleType,
  serialNumber,
  title,
  aspectRatio = 'auto',
  className = '',
  imgClassName = '',
  enableGoogleSearchHover = false,
}) => {
  const actualConsole: ConsoleType =
    game?.console ||
    consoleType ||
    (serialNumber?.startsWith('BCES') || serialNumber?.startsWith('BLES') || serialNumber?.startsWith('NPEB')
      ? 'ps3'
      : serialNumber?.startsWith('SLES-5') || serialNumber?.startsWith('SCES-5')
      ? 'ps2'
      : 'ps1');

  const isPs1 = actualConsole === 'ps1';
  const isPs2 = actualConsole === 'ps2';
  const isPs3 = actualConsole === 'ps3';

  const actualSerial = game?.serialNumber || serialNumber || '';
  const actualTitle = game?.title || title || 'PlayStation Game';
  const initialSrc = src || game?.coverImage || '';

  // Calculate fallbacks list
  const getFallbackList = () => {
    const list: string[] = [];
    if (initialSrc) list.push(initialSrc);

    const rawSerial = actualSerial.trim().toUpperCase().replace(/-/g, '');

    if (isPs3 && rawSerial) {
      list.push(`https://art.gametdb.com/ps3/coverHQ/EN/${rawSerial}.jpg`);
      list.push(`https://art.gametdb.com/ps3/cover/EN/${rawSerial}.jpg`);
      list.push(`https://art.gametdb.com/ps3/coverM/EN/${rawSerial}.jpg`);
    } else if (isPs2 && actualSerial) {
      const formattedSerial = actualSerial.trim().toUpperCase();
      list.push(`https://raw.githubusercontent.com/xlenore/ps2-covers/main/covers/default/${formattedSerial}.jpg`);
      list.push(`https://raw.githubusercontent.com/xlenore/ps2-covers/main/covers/3d/${formattedSerial}.png`);
    }

    if (actualTitle) {
      const cleanTitle = actualTitle.trim();
      const encodedTitle = encodeURIComponent(cleanTitle);
      const titleWithoutColon = encodeURIComponent(cleanTitle.replace(/:/g, ' -'));
      const baseTitle = encodeURIComponent(cleanTitle.split(/[:\-–]/)[0].trim());

      if (isPs3) {
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Boxarts/${encodedTitle}%20(Europe).png`);
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Boxarts/${titleWithoutColon}%20(Europe).png`);
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_3/master/Named_Boxarts/${encodedTitle}%20(USA).png`);
      } else if (isPs2) {
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/${encodedTitle}%20(Europe).png`);
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/${titleWithoutColon}%20(Europe).png`);
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/${encodedTitle}%20(USA).png`);
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/${baseTitle}%20(Europe).png`);
        list.push(`https://thumbnails.libretro.com/Sony%20-%20PlayStation%202/Named_Boxarts/${encodedTitle}%20(Europe).png`);
      } else {
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/${encodedTitle}%20(Europe).png`);
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/${titleWithoutColon}%20(Europe).png`);
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/${encodedTitle}%20(USA).png`);
        list.push(`https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/${baseTitle}%20(Europe).png`);
        list.push(`https://thumbnails.libretro.com/Sony%20-%20PlayStation/Named_Boxarts/${encodedTitle}%20(Europe).png`);
      }
    }

    return Array.from(new Set(list));
  };

  const fallbacks = getFallbackList();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hasError, setHasError] = useState(fallbacks.length === 0);

  const handleError = () => {
    if (currentIdx + 1 < fallbacks.length) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setHasError(true);
    }
  };

  // Determine container aspect ratio
  const ratioClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === 'dvd' || aspectRatio === 'bluray'
      ? isPs3 ? 'aspect-[3/3.7]' : 'aspect-[3/4.2]'
      : aspectRatio === 'auto'
      ? isPs3
        ? 'aspect-[3/3.7]'
        : isPs2
        ? 'aspect-[3/4.2]'
        : 'aspect-square'
      : '';

  const consoleSearchQuery = isPs3 ? 'PS3 PAL cover' : isPs2 ? 'PS2 PAL cover' : 'PS1 PAL cover';
  const googleImagesUrl = `https://www.google.com/search?tbm=isch&q=${encodeURIComponent(`${actualTitle} ${consoleSearchQuery}`)}`;
  const ebaySearchUrl = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(`${actualTitle} ${isPs3 ? 'PS3' : isPs2 ? 'PS2' : 'PS1'} PAL`)}`;

  return (
    <div
      className={`relative overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group/cover ${ratioClass} ${className}`}
    >
      {!hasError && fallbacks[currentIdx] ? (
        <img
          key={fallbacks[currentIdx]}
          src={fallbacks[currentIdx]}
          alt={alt || actualTitle}
          onError={handleError}
          className={`w-full h-full object-cover object-center transition-all duration-300 ${imgClassName}`}
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      ) : (
        /* High-Definition Procedural Box Art Mockup if image not found */
        <div className="w-full h-full flex flex-col justify-between p-3 bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-white select-none">
          {/* Top Console Banner */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <div className="flex items-center gap-1.5">
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider uppercase ${
                  isPs3
                    ? 'bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-sm'
                    : isPs2
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-700 text-slate-100'
                }`}
              >
                {isPs3 ? 'PlayStation 3' : isPs2 ? 'PlayStation 2' : 'PlayStation'}
              </span>
              <span className="text-[9px] font-bold text-slate-400 bg-slate-800/80 px-1 rounded">
                PAL
              </span>
            </div>
            <Disc className={`w-4 h-4 ${isPs3 ? 'text-red-400' : isPs2 ? 'text-blue-400' : 'text-slate-400'} animate-spin-slow`} />
          </div>

          {/* Center Title Display */}
          <div className="my-auto text-center px-1 space-y-1.5 py-4">
            <div className="w-8 h-8 mx-auto rounded-full bg-slate-800/70 border border-slate-700/60 flex items-center justify-center text-slate-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <h4 className="font-black text-xs sm:text-sm text-slate-100 line-clamp-3 leading-snug">
              {actualTitle}
            </h4>
            {actualSerial && (
              <span className={`inline-block font-mono text-[10px] px-1.5 py-0.5 rounded ${
                isPs3 
                  ? 'text-red-400 bg-red-950/60 border border-red-800/40' 
                  : 'text-blue-400 bg-blue-950/60 border border-blue-800/40'
              }`}>
                {actualSerial}
              </span>
            )}
          </div>

          {/* Bottom PAL specs bar */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
            <span>{isPs3 ? 'Blu-ray Disc' : isPs2 ? 'DVD-ROM' : 'CD-ROM'}</span>
            <span className="text-slate-500 font-mono">Sony Official</span>
          </div>
        </div>
      )}

      {/* Quick Google & eBay HD Image Finder Action Overlay on Hover if enabled */}
      {enableGoogleSearchHover && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs opacity-0 group-hover/cover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2 p-3 text-center">
          <p className="text-[11px] font-semibold text-slate-200">
            צפייה בעטיפות מקוריות ברזולוציה גבוהה:
          </p>
          <div className="flex flex-col gap-1.5 w-full max-w-[170px]">
            <a
              href={googleImagesUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <span>חיפוש ב-Google</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href={ebaySearchUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors border border-slate-700"
            >
              <span>חיפוש ב-eBay</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
};
