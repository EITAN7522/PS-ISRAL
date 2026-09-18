const fs = require('fs');

const ps1File = fs.readFileSync('src/data/ps1Games.ts', 'utf8');
const ps2File = fs.readFileSync('src/data/ps2Games.ts', 'utf8');

const ps1Games = JSON.parse(ps1File.match(/export const PS1_PAL_GAMES: GameItem\[\] = (\[[\s\S]*?\]);/)[1]);
const ps2Games = JSON.parse(ps2File.match(/export const PS2_PAL_GAMES: GameItem\[\] = (\[[\s\S]*?\]);/)[1]);

const ps1Boxarts = JSON.parse(fs.readFileSync('scripts/libretro_ps1_boxarts.json', 'utf8'));
const ps2Boxarts = JSON.parse(fs.readFileSync('scripts/libretro_ps2_boxarts.json', 'utf8'));

function createMatcher(boxartList, consolePrefix) {
  const clean = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
  const romanMap = { ' i': ' 1', ' ii': ' 2', ' iii': ' 3', ' iv': ' 4', ' v': ' 5', ' vi': ' 6', ' vii': ' 7', ' viii': ' 8', ' ix': ' 9', ' x': ' 10' };
  
  function norm(s) {
    let res = s.toLowerCase();
    for (const [r, n] of Object.entries(romanMap)) {
      res = res.replace(new RegExp(r + '(?![a-z])', 'g'), n);
    }
    return clean(res);
  }

  const tokenize = s => s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter(w => w.length > 1 && !['the','and','of','in','a','an','for','on','part','vol','edition','europe','pal'].includes(w));
  
  const entries = boxartList.map(filename => {
    const withoutExt = filename.replace(/\.png$/i, '');
    const baseTitle = withoutExt.replace(/\s*\([^)]*\).*/g, '').trim();
    return {
      filename,
      withoutExt,
      baseTitle,
      cleanBase: clean(baseTitle),
      normBase: norm(baseTitle),
      tokens: new Set(tokenize(baseTitle)),
      isEurope: withoutExt.includes('(Europe)') || withoutExt.includes('(France)') || withoutExt.includes('(Germany)') || withoutExt.includes('(Italy)') || withoutExt.includes('(Spain)') || withoutExt.includes('(UK)'),
      isUSA: withoutExt.includes('(USA)'),
      isJapan: withoutExt.includes('(Japan)'),
    };
  });

  return function findBest(title, serial) {
    const cleanTitle = clean(title);
    const normTitle = norm(title);
    const titleTokens = tokenize(title);
    
    // 1. Exact base match
    const exact = entries.filter(e => e.cleanBase === cleanTitle || e.normBase === normTitle);
    if (exact.length > 0) return pickBest(exact);

    // 2. Stripped prefix / subtitle match
    const prefixRegex = /^(007\s*-\s*|disney'?s\s+|walt disney'?s\s+|tom clancy'?s\s+|ea sports\s+|marvel'?s\s+|colin mcrae\s+|tony hawk'?s\s+|sony\s+|capcom\s+|konami\s+|lego\s+)/i;
    const strippedTitle = clean(title.replace(prefixRegex, ''));
    const strippedExact = entries.filter(e => {
      const eStripped = clean(e.baseTitle.replace(prefixRegex, ''));
      return e.cleanBase === strippedTitle || eStripped === strippedTitle;
    });
    if (strippedExact.length > 0) return pickBest(strippedExact);

    // 3. Subtitle truncation match (before ':' or ' - ')
    const mainTitle = title.split(/[:\-–]/)[0].trim();
    if (mainTitle.length > 3) {
      const cleanMain = clean(mainTitle);
      const normMain = norm(mainTitle);
      const mainMatches = entries.filter(e => e.cleanBase === cleanMain || e.normBase === normMain);
      if (mainMatches.length > 0) return pickBest(mainMatches);
    }

    // 4. Token overlap match (Jaccard / containment)
    if (titleTokens.length >= 2) {
      let bestCandidate = null;
      let bestScore = 0;
      for (const e of entries) {
        if (e.tokens.size === 0) continue;
        let intersection = 0;
        for (const t of titleTokens) {
          if (e.tokens.has(t)) intersection++;
        }
        if (intersection >= 2) {
          const score = (intersection / Math.max(titleTokens.length, e.tokens.size)) * 100 + (e.isEurope ? 20 : 0) + (e.isUSA ? 10 : 0);
          if (score > bestScore && (intersection >= titleTokens.length * 0.6 || intersection >= e.tokens.size * 0.6)) {
            bestScore = score;
            bestCandidate = e;
          }
        }
      }
      if (bestCandidate && bestScore >= 45) return bestCandidate.filename;
    }

    return null;
  };

  function pickBest(candidates) {
    return candidates.sort((a, b) => {
      let sA = (a.isEurope ? 100 : 0) + (a.isUSA ? 50 : 0) - (a.withoutExt.includes('Demo') ? 30 : 0) - (a.isJapan ? 20 : 0);
      let sB = (b.isEurope ? 100 : 0) + (b.isUSA ? 50 : 0) - (b.withoutExt.includes('Demo') ? 30 : 0) - (b.isJapan ? 20 : 0);
      return sB - sA;
    })[0].filename;
  }
}

const matchPs1 = createMatcher(ps1Boxarts, 'Sony_-_PlayStation');
const matchPs2 = createMatcher(ps2Boxarts, 'Sony_-_PlayStation_2');

let ps1Matched = 0;
for (const g of ps1Games) {
  const matchedBoxart = matchPs1(g.title, g.serialNumber);
  if (matchedBoxart) {
    ps1Matched++;
    g.coverImage = `https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/${encodeURIComponent(matchedBoxart)}`;
  } else {
    g.coverImage = `https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/${encodeURIComponent(g.title + ' (Europe)')}.png`;
  }
}

let ps2Matched = 0;
for (const g of ps2Games) {
  const matchedBoxart = matchPs2(g.title, g.serialNumber);
  if (matchedBoxart) {
    ps2Matched++;
    g.coverImage = `https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/${encodeURIComponent(matchedBoxart)}`;
  } else if (g.serialNumber && g.serialNumber.match(/^S[CL][E][SD]-\d{5}$/)) {
    g.coverImage = `https://raw.githubusercontent.com/xlenore/ps2-covers/main/covers/default/${g.serialNumber}.jpg`;
  } else {
    g.coverImage = `https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/${encodeURIComponent(g.title + ' (Europe)')}.png`;
  }
}

console.log(`PS1 matched: ${ps1Matched}/${ps1Games.length}`);
console.log(`PS2 matched: ${ps2Matched}/${ps2Games.length}`);

// Write updated data files
const updatedPs1Content = ps1File.replace(
  /export const PS1_PAL_GAMES: GameItem\[\] = (\[[\s\S]*?\]);/,
  `export const PS1_PAL_GAMES: GameItem[] = ${JSON.stringify(ps1Games, null, 2)};`
);

const updatedPs2Content = ps2File.replace(
  /export const PS2_PAL_GAMES: GameItem\[\] = (\[[\s\S]*?\]);/,
  `export const PS2_PAL_GAMES: GameItem[] = ${JSON.stringify(ps2Games, null, 2)};`
);

fs.writeFileSync('src/data/ps1Games.ts', updatedPs1Content, 'utf8');
fs.writeFileSync('src/data/ps2Games.ts', updatedPs2Content, 'utf8');
console.log('Successfully updated src/data/ps1Games.ts and src/data/ps2Games.ts');
