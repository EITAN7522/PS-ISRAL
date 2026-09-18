import https from 'https';
import fs from 'fs';
import path from 'path';

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'NodeJS' } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

function detectGenre(title) {
  const t = title.toLowerCase();
  if (t.includes('fifa') || t.includes('soccer') || t.includes('nba') || t.includes('basketball') || t.includes('tennis') || t.includes('golf') || t.includes('hockey') || t.includes('skate') || t.includes('tony hawk') || t.includes('olympic') || t.includes('football') || t.includes('rugby') || t.includes('wrestling') || t.includes('wwf') || t.includes('wwe') || t.includes('bowling') || t.includes('snooker') || t.includes('pool') || t.includes('athletics') || t.includes('cricket') || t.includes('cycling') || t.includes('boxing') || t.includes('snowboard') || t.includes('jonah lomu') || t.includes('striker')) return 'ספורט';
  if (t.includes('racing') || t.includes('gran turismo') || t.includes('ridge racer') || t.includes('rally') || t.includes('formula') || t.includes('f1') || t.includes('colin mcrae') || t.includes('toca') || t.includes('need for speed') || t.includes('driver') || t.includes('moto') || t.includes('kart') || t.includes('wipeout') || t.includes('gt') || t.includes('nascar') || t.includes('v-rally') || t.includes('test drive') || t.includes('speed') || t.includes('championship') || t.includes('burnout') || t.includes('motor') || t.includes('superbike') || t.includes('grand prix') || t.includes('destruction derby') || t.includes('rollcage') || t.includes('rage racer') || t.includes('rc revenge') || t.includes('porsche')) return 'מירוצים';
  if (t.includes('tekken') || t.includes('street fighter') || t.includes('mortal kombat') || t.includes('versus') || t.includes('vs.') || t.includes('kombat') || t.includes('dead or alive') || t.includes('bloody roar') || t.includes('rival schools') || t.includes('soul blade') || t.includes('battle arena') || t.includes('fighter') || t.includes('fighting') || t.includes('brawler') || t.includes('guilty gear') || t.includes('kof') || t.includes('king of fighters') || t.includes('bushido blade') || t.includes('darkstalkers') || t.includes('fatal fury') || t.includes('samurai shodown') || t.includes('tobal') || t.includes('destrega') || t.includes('iron fist') || t.includes('wu-tang') || t.includes('dynasty warriors') || t.includes('star wars masters')) return 'לחימה';
  if (t.includes('final fantasy') || t.includes('dragon quest') || t.includes('breath of fire') || t.includes('suikoden') || t.includes('valkyrie') || t.includes('chrono') || t.includes('grandia') || t.includes('tales of') || t.includes('star ocean') || t.includes('persona') || t.includes('legend of dragoon') || t.includes('xenogears') || t.includes('rpg') || t.includes('legend of mana') || t.includes('wild arms') || t.includes('alundra') || t.includes('vagrant story') || t.includes('diablo') || t.includes('koudelka') || t.includes('sa-ga') || t.includes('saga frontier') || t.includes('vandal hearts') || t.includes('crusader') || t.includes('shadow madness') || t.includes('tactics ogre') || t.includes('jade cocoon') || t.includes('king\'s field') || t.includes('azure dreams') || t.includes('blaze & blade') || t.includes('legend of kartia') || t.includes('starcon')) return 'תפקידים (RPG)';
  if (t.includes('crash bandicoot') || t.includes('spyro') || t.includes('rayman') || t.includes('croc') || t.includes('gex') || t.includes('ape escape') || t.includes('pandemonium') || t.includes('klonoa') || t.includes('medievil') || t.includes('tarzan') || t.includes('hercules') || t.includes('sonic') || t.includes('mario') || t.includes('platform') || t.includes('jump') || t.includes('tomba') || t.includes('heart of darkness') || t.includes('earthworm jim') || t.includes('oddworld') || t.includes('abe') || t.includes('bugs bunny') || t.includes('donald duck') || t.includes('mickey') || t.includes('disney') || t.includes('aladdin') || t.includes('lion king') || t.includes('toy story') || t.includes('pac-man') || t.includes('jersey devil') || t.includes('rascal') || t.includes('bugs') || t.includes('smurfs') || t.includes('monsters') || t.includes('looney tunes') || t.includes('frogger') || t.includes('glover') || t.includes('pink panther') || t.includes('asterix') || t.includes('tintin') || t.includes('lucky luke') || t.includes('hugo') || t.includes('lucky') || t.includes('40 winks') || t.includes('santa claus') || t.includes('sheep') || t.includes('worms armageddon')) return 'פלטפורמה';
  if (t.includes('resident evil') || t.includes('silent hill') || t.includes('dino crisis') || t.includes('alone in the dark') || t.includes('parasite eve') || t.includes('clock tower') || t.includes('fear effect') || t.includes('evil') || t.includes('nightmare') || t.includes('dracula') || t.includes('horror') || t.includes('shadow man') || t.includes('martian gothic') || t.includes('overblood') || t.includes('evil dead') || t.includes('galerians') || t.includes('vampire') || t.includes('zombie') || t.includes('alien resurrection') || t.includes('alien trilogy')) return 'אימה והישרדות';
  if (t.includes('simcity') || t.includes('command & conquer') || t.includes('warcraft') || t.includes('red alert') || t.includes('theme park') || t.includes('theme hospital') || t.includes('civilization') || t.includes('populous') || t.includes('front mission') || t.includes('tactics') || t.includes('strategy') || t.includes('monopoly') || t.includes('risk') || t.includes('chess') || t.includes('worms') || t.includes('dune') || t.includes('warhammer') || t.includes('syndicate') || t.includes('constructor') || t.includes('kkned') || t.includes('age of empires') || t.includes('battle isle') || t.includes('panzer') || t.includes('transport tycoon') || t.includes('sim city')) return 'אסטרטגיה וניהול';
  if (t.includes('tetris') || t.includes('bust-a-move') || t.includes('puzzle') || t.includes('lemmings') || t.includes('kurushi') || t.includes('iq') || t.includes('devil dice') || t.includes('super puzzle') || t.includes('bomberman') || t.includes('puyo') || t.includes('billiards') || t.includes('scrabble') || t.includes('trivial') || t.includes('who wants to be a millionaire') || t.includes('millionaire') || t.includes('quiz') || t.includes('mahjong') || t.includes('board') || t.includes('word') || t.includes('puzz') || t.includes('baku baku') || t.includes('columns') || t.includes('jewels') || t.includes('bubble') || t.includes('roll away')) return 'פאזל וחשיבה';
  if (t.includes('dance dance') || t.includes('parappa') || t.includes('bust a groove') || t.includes('music') || t.includes('mtv') || t.includes('guitar') || t.includes('rhythm') || t.includes('vib-ribbon') || t.includes('umjammer lammy') || t.includes('beatmania') || t.includes('pop\'n music') || t.includes('sing') || t.includes('karaoke') || t.includes('b-boy')) return 'מוזיקה וקצב';
  if (t.includes('tomb raider') || t.includes('metal gear') || t.includes('syphon filter') || t.includes('medal of honor') || t.includes('doom') || t.includes('quake') || t.includes('duke nukem') || t.includes('time crisis') || t.includes('point blank') || t.includes('007') || t.includes('tenchu') || t.includes('rainbow six') || t.includes('spec ops') || t.includes('delta force') || t.includes('alien') || t.includes('star wars') || t.includes('die hard') || t.includes('spider-man') || t.includes('batman') || t.includes('blade') || t.includes('mission impossible') || t.includes('armored core') || t.includes('g-police') || t.includes('colony wars') || t.includes('action') || t.includes('strike') || t.includes('force') || t.includes('gun') || t.includes('shooter') || t.includes('shadow') || t.includes('assault') || t.includes('commando') || t.includes('crush') || t.includes('war') || t.includes('combat') || t.includes('mission') || t.includes('in cold blood') || t.includes('c-12') || t.includes('apocalypse')) return 'פעולה ויריות';
  return 'הרפתקאות';
}

function detectPublisherAndDeveloper(serial, title) {
  const isSony = serial.startsWith('SCES') || serial.startsWith('SCED');
  const t = title.toLowerCase();

  if (isSony) {
    if (t.includes('crash') || t.includes('jak')) return { pub: 'Sony Computer Entertainment', dev: 'Naughty Dog' };
    if (t.includes('spyro')) return { pub: 'Sony Computer Entertainment', dev: 'Insomniac Games' };
    if (t.includes('gran turismo')) return { pub: 'Sony Computer Entertainment', dev: 'Polyphony Digital' };
    if (t.includes('medievil')) return { pub: 'Sony Computer Entertainment', dev: 'SCE Cambridge Studio' };
    if (t.includes('wipeout')) return { pub: 'Sony Computer Entertainment', dev: 'Psygnosis' };
    if (t.includes('ape escape')) return { pub: 'Sony Computer Entertainment', dev: 'Japan Studio' };
    if (t.includes('syphon filter')) return { pub: 'Sony Computer Entertainment', dev: 'Eidetic / Bend Studio' };
    return { pub: 'Sony Computer Entertainment', dev: 'Sony Interactive Europe' };
  }

  if (t.includes('final fantasy') || t.includes('tomb raider') || t.includes('chrono') || t.includes('parasite') || t.includes('vagrant') || t.includes('front mission')) {
    if (t.includes('tomb raider')) return { pub: 'Eidos Interactive', dev: 'Core Design' };
    return { pub: 'Square Enix (Squaresoft)', dev: 'Square Co., Ltd.' };
  }
  if (t.includes('resident evil') || t.includes('dino crisis') || t.includes('street fighter') || t.includes('mega man') || t.includes('rival schools')) {
    return { pub: 'Capcom', dev: 'Capcom Production Studio' };
  }
  if (t.includes('metal gear') || t.includes('silent hill') || t.includes('castlevania') || t.includes('suikoden') || t.includes('pro evolution') || t.includes('iss') || t.includes('gradius') || t.includes('dance dance')) {
    return { pub: 'Konami', dev: 'Konami Computer Entertainment' };
  }
  if (t.includes('tekken') || t.includes('ridge racer') || t.includes('time crisis') || t.includes('point blank') || t.includes('soul blade') || t.includes('tales of') || t.includes('ace combat') || t.includes('klonoa') || t.includes('pac-man')) {
    return { pub: 'Namco', dev: 'Namco Limited' };
  }
  if (t.includes('fifa') || t.includes('need for speed') || t.includes('medal of honor') || t.includes('command & conquer') || t.includes('nba live') || t.includes('tiger woods') || t.includes('nhl') || t.includes('simcity') || t.includes('theme park')) {
    return { pub: 'Electronic Arts (EA)', dev: 'EA Sports / EA UK' };
  }
  if (t.includes('tony hawk') || t.includes('spider-man') || t.includes('quake') || t.includes('doom') || t.includes('pitfall') || t.includes('tarzan')) {
    return { pub: 'Activision', dev: 'Neversoft / Activision Studios' };
  }
  if (t.includes('rayman') || t.includes('driver') || t.includes('grand theft auto') || t.includes('worms')) {
    if (t.includes('rayman')) return { pub: 'Ubisoft', dev: 'Ubisoft Montpellier' };
    if (t.includes('driver')) return { pub: 'GT Interactive / Infogrames', dev: 'Reflections Interactive' };
    if (t.includes('grand theft auto')) return { pub: 'Rockstar Games / Take-Two', dev: 'DMA Design' };
    if (t.includes('worms')) return { pub: 'Team17 / Ocean', dev: 'Team17 Digital' };
  }
  if (t.includes('disney') || t.includes('hercules') || t.includes('aladdin') || t.includes('toy story') || t.includes('bugs life')) {
    return { pub: 'Disney Interactive', dev: 'Traveller\'s Tales' };
  }
  if (t.includes('colin mcrae') || t.includes('toca') || t.includes('brian lara')) {
    return { pub: 'Codemasters', dev: 'Codemasters Software' };
  }
  if (t.includes('oddworld')) {
    return { pub: 'GT Interactive', dev: 'Oddworld Inhabitants' };
  }
  return { pub: 'European Publisher', dev: 'European Development Studio' };
}

// Normalize title to group duplicates
function getNormalizedKey(title) {
  return title
    .replace(/\s*\(Disc\s*\d+\)/gi, '')
    .replace(/\s*\(CD\s*\d+\)/gi, '')
    .replace(/\s*\(Disc\s*[A-Z]\)/gi, '')
    .replace(/\s*\(Deutsch\)/gi, '')
    .replace(/\s*\(German\)/gi, '')
    .replace(/\s*\(French\)/gi, '')
    .replace(/\s*\(Français\)/gi, '')
    .replace(/\s*\(Italian\)/gi, '')
    .replace(/\s*\(Italiano\)/gi, '')
    .replace(/\s*\(Spanish\)/gi, '')
    .replace(/\s*\(Español\)/gi, '')
    .replace(/\s*\(Dutch\)/gi, '')
    .replace(/\s*\(Nederlands\)/gi, '')
    .replace(/\s*\(Swedish\)/gi, '')
    .replace(/\s*\(Svenska\)/gi, '')
    .replace(/\s*\(Portuguese\)/gi, '')
    .replace(/\s*\(Europe\)/gi, '')
    .replace(/\s*\(UK\)/gi, '')
    .replace(/\s*\(France\)/gi, '')
    .replace(/\s*\(Germany\)/gi, '')
    .replace(/\s*\(Italy\)/gi, '')
    .replace(/\s*\(Spain\)/gi, '')
    .replace(/\s*\(Demo\)/gi, '')
    .replace(/\s*\(En[^\)]*\)/gi, '')
    .replace(/[\s\-_:'",.!?()]+/g, ' ')
    .trim()
    .toLowerCase();
}

async function main() {
  console.log('Fetching idlst and libretro boxarts tree...');
  const idlstData = await get('https://raw.githubusercontent.com/libretro/libretro-database/master/dat/ps1.idlst');
  const boxartsRes = await get('https://api.github.com/repos/libretro-thumbnails/Sony_-_PlayStation/git/trees/master?recursive=1');
  const boxarts = JSON.parse(boxartsRes).tree
    .filter(x => x.path.startsWith('Named_Boxarts/'))
    .map(x => x.path.replace('Named_Boxarts/', '').replace('.png', ''));

  const palEntries = idlstData.split('\n')
    .map(line => line.trim())
    // Include PAL serials (SCES = Sony First Party, SLES = Third Party)
    .filter(line => line.startsWith('SCES-') || line.startsWith('SLES-'));

  console.log(`Processing ${palEntries.length} PAL serials against ${boxarts.length} boxarts...`);

  // Build boxart map
  const boxartMap = new Map();
  for (const b of boxarts) {
    boxartMap.set(b.toLowerCase(), b);
  }

  const boxartCleanMap = new Map();
  for (const b of boxarts) {
    const cleanKey = b.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!boxartCleanMap.has(cleanKey)) {
      boxartCleanMap.set(cleanKey, b);
    }
  }

  // Group entries by normalized key to eliminate duplicates
  const grouped = new Map();

  for (const entry of palEntries) {
    const match = entry.match(/^([A-Z]{4}-\d{5})\s+"(.+)"$/);
    if (!match) continue;
    const [_, serial, rawTitle] = match;

    // Filter out obvious demo/sampler entries
    if (rawTitle.toLowerCase().includes('(demo)') || rawTitle.toLowerCase().includes('sampler') || rawTitle.toLowerCase().includes('registered user demo')) {
      continue;
    }

    let cleanTitle = rawTitle
      .replace(/\s*\(Disc\s*\d+\)/gi, '')
      .replace(/\s*\(CD\s*\d+\)/gi, '')
      .replace(/\s*\(Disc\s*[A-Z]\)/gi, '')
      .replace(/\s*\(Deutsch\)/gi, '')
      .replace(/\s*\(German\)/gi, '')
      .replace(/\s*\(French\)/gi, '')
      .replace(/\s*\(Français\)/gi, '')
      .replace(/\s*\(Italian\)/gi, '')
      .replace(/\s*\(Italiano\)/gi, '')
      .replace(/\s*\(Spanish\)/gi, '')
      .replace(/\s*\(Español\)/gi, '')
      .replace(/\s*\(Dutch\)/gi, '')
      .replace(/\s*\(Nederlands\)/gi, '')
      .replace(/\s*\(Swedish\)/gi, '')
      .replace(/\s*\(Svenska\)/gi, '')
      .replace(/\s*\(Portuguese\)/gi, '')
      .replace(/\s*\(En[^\)]*\)/gi, '')
      .trim();

    // Specific famous English titles mapping for regional localized names
    if (cleanTitle.startsWith('007 - Demain') || cleanTitle.startsWith('007 - Der Morgen') || cleanTitle.startsWith('007 - Tomorrow')) {
      cleanTitle = '007 - Tomorrow Never Dies';
    } else if (cleanTitle.startsWith('007 - Le Monde') || cleanTitle.startsWith('007 - Die Welt') || cleanTitle.startsWith('007 - El Mundo') || cleanTitle.startsWith('007 - The World')) {
      cleanTitle = '007 - The World Is Not Enough';
    }

    const normKey = getNormalizedKey(cleanTitle);

    if (!grouped.has(normKey)) {
      grouped.set(normKey, []);
    }
    grouped.get(normKey).push({ serial, rawTitle, cleanTitle });
  }

  console.log(`Unique normalized game titles: ${grouped.size}`);

  const catalog = [];

  for (const [normKey, items] of grouped.entries()) {
    // Select the best representative item:
    // Prefer English/clean title and Disc 1 / primary serial
    let chosen = items[0];
    for (const item of items) {
      if (!item.rawTitle.includes('(') || item.rawTitle.includes('Disc 1') || item.rawTitle.includes('Europe')) {
        chosen = item;
        break;
      }
    }

    const serial = chosen.serial;
    const cleanTitle = chosen.cleanTitle;
    const id = cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || serial.toLowerCase();

    // Find best boxart match
    let matchedBoxart = null;
    const directCandidates = [
      `${cleanTitle} (Europe)`,
      `${cleanTitle} (Europe) (En,Fr,De,Es,It)`,
      `${cleanTitle} (Europe) (En,Fr,De)`,
      `${cleanTitle} (Europe) (En,Fr)`,
      `${cleanTitle} (Europe) (En,Es)`,
      `${cleanTitle} (Europe) (En,It)`,
      `${cleanTitle} (UK)`,
      `${cleanTitle} (France)`,
      `${cleanTitle} (Germany)`,
      `${cleanTitle} (Italy)`,
      `${cleanTitle} (Spain)`,
      `${cleanTitle} (USA)`,
      `${chosen.rawTitle} (Europe)`,
      chosen.rawTitle,
      cleanTitle
    ];

    for (const c of directCandidates) {
      if (boxartMap.has(c.toLowerCase())) {
        matchedBoxart = boxartMap.get(c.toLowerCase());
        break;
      }
    }

    if (!matchedBoxart) {
      const cleanK = cleanTitle.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (boxartCleanMap.has(cleanK)) {
        matchedBoxart = boxartCleanMap.get(cleanK);
      } else {
        for (const [k, v] of boxartCleanMap.entries()) {
          if ((k.includes(cleanK) || cleanK.includes(k)) && k.length >= 4) {
            matchedBoxart = v;
            break;
          }
        }
      }
    }

    const coverUrl = matchedBoxart
      ? `https://thumbnails.libretro.com/Sony%20-%20PlayStation/Named_Boxarts/${encodeURIComponent(matchedBoxart)}.png`
      : `https://thumbnails.libretro.com/Sony%20-%20PlayStation/Named_Boxarts/${encodeURIComponent(cleanTitle + ' (Europe)')}.png`;

    const genre = detectGenre(cleanTitle);
    const { pub, dev } = detectPublisherAndDeveloper(serial, cleanTitle);

    // Approximate release year
    let year = 1998;
    const serialNum = parseInt(serial.split('-')[1] || '0', 10);
    if (serialNum < 500) year = 1995;
    else if (serialNum < 1000) year = 1996;
    else if (serialNum < 1700) year = 1997;
    else if (serialNum < 2400) year = 1998;
    else if (serialNum < 3200) year = 1999;
    else if (serialNum < 3800) year = 2000;
    else if (serialNum < 4100) year = 2001;
    else year = 2002;

    const isMultiplayer = genre.includes('ספורט') || genre.includes('לחימה') || genre.includes('מירוצים') || genre.includes('פאזל');
    const players = isMultiplayer ? '1-2 שחקנים' : '1 שחקן';

    const descriptionHe = `משחק ${genre} מקורי שהושק בגרסת PAL אירופאית/ישראלית רשמית עבור סוני פלייסטיישן 1 (קוד מוצר: ${serial}). פריט חובה לחובבי נוסטלגיה ואספנות גיימינג מקורית.`;

    catalog.push({
      id,
      title: cleanTitle,
      serialNumber: serial,
      coverImage: coverUrl,
      region: 'PAL',
      releaseYear: year,
      genre,
      developer: dev,
      publisher: pub,
      players,
      descriptionHe,
      console: 'ps1'
    });
  }

  // Ensure unique IDs
  const finalCatalog = [];
  const seenFinalIds = new Set();
  for (const g of catalog) {
    let finalId = g.id;
    if (seenFinalIds.has(finalId)) {
      finalId = `${g.id}-${g.serialNumber.toLowerCase()}`;
    }
    seenFinalIds.add(finalId);
    g.id = finalId;
    finalCatalog.push(g);
  }

  // Sort alphabetically by title
  finalCatalog.sort((a, b) => a.title.localeCompare(b.title));

  console.log(`Deduplication complete! Cleaned unique PAL games count: ${finalCatalog.length}`);

  const outputPath = path.resolve('src/data/ps1Games.ts');
  const fileContent = `import { PS1Game } from '../types';

export const GENRES = [
  'הכל',
  'פלטפורמה',
  'פעולה ויריות',
  'מירוצים',
  'תפקידים (RPG)',
  'לחימה',
  'ספורט',
  'אימה והישרדות',
  'הרפתקאות',
  'אסטרטגיה וניהול',
  'פאזל וחשיבה',
  'מוזיקה וקצב'
];

export const YEARS = [
  'הכל',
  '1995',
  '1996',
  '1997',
  '1998',
  '1999',
  '2000',
  '2001',
  '2002',
  '2003',
  '2004'
];

/**
 * מאגר הנתונים הנקי והייחודי (ללא כפילויות) של משחקי Sony PlayStation 1 בגרסאות PAL (אירופה / ישראל)
 * מכיל ${finalCatalog.length} כותרי PAL ייחודיים ללא כפילויות של דיסקים ושפות, עם מספרי סידוריים מקוריים (SCES / SLES), ז'אנרים, מפתחים ועטיפות רשמיות.
 */
export const PS1_PAL_GAMES: PS1Game[] = ${JSON.stringify(finalCatalog, null, 2)};
`;

  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`Successfully written ${finalCatalog.length} unique PAL games to ${outputPath}`);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
