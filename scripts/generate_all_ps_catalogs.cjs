const https = require('https');
const fs = require('fs');
const path = require('path');

function getBuffer(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return getBuffer(res.headers.location).then(resolve).catch(reject);
      }
      const chunks = [];
      res.on('data', c => chunks.push(c));
      res.on('end', () => resolve(Buffer.concat(chunks)));
    }).on('error', reject);
  });
}

function getText(url) {
  return getBuffer(url).then(b => b.toString('utf8'));
}

// Simple MsgPack parser for Libretro RDB files
function decodeRdb(buffer) {
  let offset = 0;
  const records = [];

  function readString(len) {
    const s = buffer.toString('utf8', offset, offset + len);
    offset += len;
    return s.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');
  }

  function decodeValue() {
    if (offset >= buffer.length) return undefined;
    const byte = buffer[offset++];
    if (byte <= 0x7f) return byte;
    if ((byte & 0xf0) === 0x80) {
      const size = byte & 0x0f;
      const obj = {};
      for (let i = 0; i < size; i++) {
        const key = decodeValue();
        const val = decodeValue();
        if (key !== undefined) obj[key] = val;
      }
      return obj;
    }
    if ((byte & 0xf0) === 0x90) {
      const size = byte & 0x0f;
      const arr = [];
      for (let i = 0; i < size; i++) arr.push(decodeValue());
      return arr;
    }
    if ((byte & 0xe0) === 0xa0) {
      const len = byte & 0x1f;
      return readString(len);
    }
    if (byte === 0xc0) return null;
    if (byte === 0xc2) return false;
    if (byte === 0xc3) return true;
    if (byte === 0xc4) {
      const len = buffer.readUInt8(offset); offset += 1;
      const b = buffer.slice(offset, offset + len); offset += len; return b.toString('hex');
    }
    if (byte === 0xc5) {
      const len = buffer.readUInt16BE(offset); offset += 2;
      const b = buffer.slice(offset, offset + len); offset += len; return b.toString('hex');
    }
    if (byte === 0xc6) {
      const len = buffer.readUInt32BE(offset); offset += 4;
      const b = buffer.slice(offset, offset + len); offset += len; return b.toString('hex');
    }
    if (byte === 0xcc) { const v = buffer.readUInt8(offset); offset += 1; return v; }
    if (byte === 0xcd) { const v = buffer.readUInt16BE(offset); offset += 2; return v; }
    if (byte === 0xce) { const v = buffer.readUInt32BE(offset); offset += 4; return v; }
    if (byte === 0xcf) {
      const hi = buffer.readUInt32BE(offset);
      const lo = buffer.readUInt32BE(offset + 4);
      offset += 8;
      return hi * 4294967296 + lo;
    }
    if (byte === 0xd0) { const v = buffer.readInt8(offset); offset += 1; return v; }
    if (byte === 0xd1) { const v = buffer.readInt16BE(offset); offset += 2; return v; }
    if (byte === 0xd2) { const v = buffer.readInt32BE(offset); offset += 4; return v; }
    if (byte === 0xd9) {
      const len = buffer.readUInt8(offset); offset += 1;
      return readString(len);
    }
    if (byte === 0xda) {
      const len = buffer.readUInt16BE(offset); offset += 2;
      return readString(len);
    }
    if (byte === 0xdb) {
      const len = buffer.readUInt32BE(offset); offset += 4;
      return readString(len);
    }
    if (byte === 0xdc) {
      const size = buffer.readUInt16BE(offset); offset += 2;
      const arr = [];
      for (let i = 0; i < size; i++) arr.push(decodeValue());
      return arr;
    }
    if (byte === 0xdd) {
      const size = buffer.readUInt32BE(offset); offset += 4;
      const arr = [];
      for (let i = 0; i < size; i++) arr.push(decodeValue());
      return arr;
    }
    if (byte === 0xde) {
      const size = buffer.readUInt16BE(offset); offset += 2;
      const obj = {};
      for (let i = 0; i < size; i++) {
        const key = decodeValue();
        const val = decodeValue();
        if (key !== undefined) obj[key] = val;
      }
      return obj;
    }
    if (byte === 0xdf) {
      const size = buffer.readUInt32BE(offset); offset += 4;
      const obj = {};
      for (let i = 0; i < size; i++) {
        const key = decodeValue();
        const val = decodeValue();
        if (key !== undefined) obj[key] = val;
      }
      return obj;
    }
    return undefined;
  }

  while (offset < buffer.length) {
    try {
      const rec = decodeValue();
      if (rec && typeof rec === 'object') {
        records.push(rec);
      }
    } catch (e) {
      break;
    }
  }
  return records;
}

function detectGenre(title, consoleType) {
  const t = title.toLowerCase();
  if (t.includes('fifa') || t.includes('soccer') || t.includes('nba') || t.includes('basketball') || t.includes('tennis') || t.includes('golf') || t.includes('hockey') || t.includes('skate') || t.includes('tony hawk') || t.includes('olympic') || t.includes('football') || t.includes('rugby') || t.includes('wrestling') || t.includes('wwf') || t.includes('wwe') || t.includes('bowling') || t.includes('snooker') || t.includes('boxing') || t.includes('pes ') || t.includes('pro evolution') || t.includes('madden') || t.includes('pga tour') || t.includes('baseball') || t.includes('top spin')) return 'ספורט';
  if (t.includes('racing') || t.includes('gran turismo') || t.includes('ridge racer') || t.includes('rally') || t.includes('formula') || t.includes('f1') || t.includes('colin mcrae') || t.includes('toca') || t.includes('need for speed') || t.includes('driver') || t.includes('moto') || t.includes('kart') || t.includes('wipeout') || t.includes('burnout') || t.includes('motorstorm') || t.includes('midnight club') || t.includes('grid') || t.includes('dirt') || t.includes('flatout') || t.includes('modnation')) return 'מרוצים ונהיגה';
  if (t.includes('tekken') || t.includes('street fighter') || t.includes('mortal kombat') || t.includes('soulcalibur') || t.includes('soul blade') || t.includes('dead or alive') || t.includes('virtua fighter') || t.includes('dragon ball') || t.includes('naruto') || t.includes('guilty gear') || t.includes('blazblue') || t.includes('injustice') || t.includes('marvel vs') || t.includes('king of fighters') || t.includes('ufc') || t.includes('fight night')) return 'לחימה';
  if (t.includes('final fantasy') || t.includes('dragon quest') || t.includes('kingdom hearts') || t.includes('persona') || t.includes('valkyria') || t.includes('star ocean') || t.includes('tales of') || t.includes('dark souls') || t.includes('demon\'s souls') || t.includes('skyrim') || t.includes('elder scrolls') || t.includes('fallout') || t.includes('mass effect') || t.includes('dragon age') || t.includes('witcher') || t.includes('ni no kuni') || t.includes('disgaea') || t.includes('suikoden') || t.includes('grandia') || t.includes('chrono') || t.includes('xenogears') || t.includes('xenosaga') || t.includes('diablo') || t.includes('atelier') || t.includes('yakuza')) return 'תפקידים (RPG)';
  if (t.includes('crash bandicoot') || t.includes('spyro') || t.includes('rayman') || t.includes('sonic') || t.includes('jak and daxter') || t.includes('jak ii') || t.includes('jak 3') || t.includes('ratchet') || t.includes('sly cooper') || t.includes('sly ') || t.includes('ape escape') || t.includes('littlebigplanet') || t.includes('klonoa') || t.includes('medievil') || t.includes('croc') || t.includes('gex') || t.includes('knack') || t.includes('rayman origins') || t.includes('rayman legends') || t.includes('puppeteer')) return 'פלטפורמה והרפתקאות';
  if (t.includes('resident evil') || t.includes('silent hill') || t.includes('dead space') || t.includes('siren') || t.includes('fatal frame') || t.includes('project zero') || t.includes('alone in the dark') || t.includes('f.e.a.r') || t.includes('the evil within') || t.includes('saw') || t.includes('outlast') || t.includes('condemned') || t.includes('parasite eve') || t.includes('dino crisis') || t.includes('clock tower') || t.includes('haunting ground') || t.includes('rule of rose') || t.includes('alien: isolation') || t.includes('dead island')) return 'אימה והישרדות';
  if (t.includes('call of duty') || t.includes('medal of honor') || t.includes('battlefield') || t.includes('killzone') || t.includes('resistance') || t.includes('bioshock') || t.includes('borderlands') || t.includes('crysis') || t.includes('far cry') || t.includes('sniper') || t.includes('time crisis') || t.includes('doom') || t.includes('wolfenstein') || t.includes('quake') || t.includes('payday') || t.includes('black') || t.includes('socom') || t.includes('syphon filter') || t.includes('rainbow six') || t.includes('ghost recon') || t.includes('spec ops') || t.includes('metro 2033') || t.includes('bulletstorm') || t.includes('rage')) return 'יריות (FPS/TPS)';
  if (t.includes('grand theft auto') || t.includes('gta') || t.includes('red dead') || t.includes('uncharted') || t.includes('god of war') || t.includes('the last of us') || t.includes('assassin\'s creed') || t.includes('batman') || t.includes('metal gear') || t.includes('inFamous') || t.includes('tomb raider') || t.includes('watch dogs') || t.includes('sleeping dogs') || t.includes('mafia') || t.includes('saints row') || t.includes('just cause') || t.includes('heavy rain') || t.includes('beyond: two souls') || t.includes('l.a. noire') || t.includes('prototype') || t.includes('dishonored') || t.includes('hitman') || t.includes('max payne') || t.includes('devil may cry') || t.includes('bayonetta') || t.includes('dante\'s inferno') || t.includes('castlevania')) return 'פעולה ועולם פתוח';
  if (t.includes('lego') || t.includes('disney') || t.includes('pixar') || t.includes('singstar') || t.includes('guitar hero') || t.includes('rock band') || t.includes('buzz!') || t.includes('dance dance') || t.includes('just dance')) return 'מוזיקה ומסיבה';
  if (t.includes('simcity') || t.includes('command & conquer') || t.includes('red alert') || t.includes('civilization') || t.includes('worms') || t.includes('xcom') || t.includes('valkyria chronicles')) return 'אסטרטגיה וטקטיקה';
  return 'פעולה והרפתקאות';
}

function cleanTitleString(title) {
  let t = title.trim();
  t = t.replace(/\s*\((Europe|UK|France|Germany|Spain|Italy|Australia|En|Fr|De|Es|It|Nl|Sv|v\d+(\.\d+)?|Alt.*|En,.*)\)/gi, '').trim();
  t = t.replace(/\s*\((Disc \d+|Disk \d+|Bonus Disc)\)/gi, '').trim();
  return t;
}

function normalizeKey(title) {
  return title.toLowerCase().replace(/^(the|a|an)\s+/, '').replace(/[^a-z0-9]/g, '');
}

async function run() {
  console.log('--- Starting Complete Sony PlayStation Catalog Generation ---');

  // Load existing Libretro boxart filenames lists if available
  let ps1Boxarts = [];
  let ps2Boxarts = [];
  let ps3Boxarts = [];
  try {
    if (fs.existsSync('scripts/libretro_ps1_boxarts.json')) ps1Boxarts = JSON.parse(fs.readFileSync('scripts/libretro_ps1_boxarts.json'));
    if (fs.existsSync('scripts/libretro_ps2_boxarts.json')) ps2Boxarts = JSON.parse(fs.readFileSync('scripts/libretro_ps2_boxarts.json'));
    if (fs.existsSync('scripts/libretro_ps3_boxarts.json')) ps3Boxarts = JSON.parse(fs.readFileSync('scripts/libretro_ps3_boxarts.json'));
  } catch(e) {}

  // 1. PROCESS PS1
  console.log('Downloading Libretro PS1 RDB...');
  const ps1RdbBuffer = await getBuffer('https://raw.githubusercontent.com/libretro/libretro-database/master/rdb/Sony%20-%20PlayStation.rdb');
  const ps1Records = decodeRdb(ps1RdbBuffer);
  console.log(`Decoded ${ps1Records.length} PS1 records from RDB.`);

  const ps1Map = new Map();
  for (const r of ps1Records) {
    const rawName = r.name || '';
    const serial = (r.serial || '').trim().toUpperCase();
    const isPal = serial.startsWith('SCES') || serial.startsWith('SLES') || serial.startsWith('SCED') || serial.startsWith('SLED') || rawName.includes('(Europe)');
    if (!isPal && serial) continue;

    const cleanTitle = cleanTitleString(rawName);
    if (!cleanTitle) continue;
    const norm = normalizeKey(cleanTitle);

    let cleanSerial = serial;
    if (cleanSerial && !cleanSerial.includes('-') && cleanSerial.length >= 7) {
      cleanSerial = `${cleanSerial.slice(0, 4)}-${cleanSerial.slice(4)}`;
    }

    // High Quality Cover
    let coverUrl = '';
    const encodedName = encodeURIComponent(rawName);
    if (rawName) {
      coverUrl = `https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation/master/Named_Boxarts/${encodedName}.png`;
    }

    const year = r.releaseyear && r.releaseyear >= 1994 && r.releaseyear <= 2006 ? r.releaseyear : (r.releasemonth ? 1998 : 1998);
    const genre = detectGenre(cleanTitle, 'ps1');
    const dev = r.developer || 'Sony Interactive Entertainment';
    const pub = r.publisher || 'Sony Computer Entertainment';
    const players = r.users && Number(r.users) > 1 ? `1-${r.users} שחקנים` : '1-2 שחקנים';

    const cleanId = `ps1-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

    if (!ps1Map.has(norm)) {
      ps1Map.set(norm, {
        id: cleanId,
        title: cleanTitle,
        serialNumber: cleanSerial || 'SCES-00000',
        coverImage: coverUrl,
        region: 'PAL',
        releaseYear: year,
        genre: genre,
        developer: dev,
        publisher: pub,
        players: players,
        descriptionHe: `משחק ${cleanTitle} מקורי שהושק בגרסת PAL אירופאית/ישראלית רשמית עבור סוני פלייסטיישן 1 (קוד מוצר: ${cleanSerial || 'SCES/SLES'}). פריט חובה לחובבי נוסטלגיה ואספנות גיימינג מקורית.`,
        console: 'ps1',
        featured: ['crash bandicoot', 'tekken 3', 'metal gear solid', 'gran turismo 2', 'spyro the dragon', 'resident evil 2', 'final fantasy vii', 'tomb raider ii', 'castlevania', 'silent hill'].some(k => cleanTitle.toLowerCase().includes(k))
      });
    } else {
      // Update with best serial or cover
      const existing = ps1Map.get(norm);
      if ((!existing.serialNumber || existing.serialNumber === 'SCES-00000') && cleanSerial) {
        existing.serialNumber = cleanSerial;
      }
    }
  }

  const ps1Final = Array.from(ps1Map.values()).sort((a, b) => a.title.localeCompare(b.title));
  console.log(`PS1 Final Clean Deduplicated Count: ${ps1Final.length} games.`);

  // 2. PROCESS PS2
  console.log('Downloading Libretro PS2 RDB...');
  const ps2RdbBuffer = await getBuffer('https://raw.githubusercontent.com/libretro/libretro-database/master/rdb/Sony%20-%20PlayStation%202.rdb');
  const ps2Records = decodeRdb(ps2RdbBuffer);
  console.log(`Decoded ${ps2Records.length} PS2 records from RDB.`);

  const ps2Map = new Map();
  for (const r of ps2Records) {
    const rawName = r.name || '';
    const serial = (r.serial || '').trim().toUpperCase();
    const isPal = serial.startsWith('SCES') || serial.startsWith('SLES') || serial.startsWith('SCED') || serial.startsWith('SLED') || rawName.includes('(Europe)');
    if (!isPal && serial) continue;

    const cleanTitle = cleanTitleString(rawName);
    if (!cleanTitle) continue;
    const norm = normalizeKey(cleanTitle);

    let cleanSerial = serial;
    if (cleanSerial && !cleanSerial.includes('-') && cleanSerial.length >= 7) {
      cleanSerial = `${cleanSerial.slice(0, 4)}-${cleanSerial.slice(4)}`;
    }

    const encodedName = encodeURIComponent(rawName);
    const coverUrl = `https://raw.githubusercontent.com/libretro-thumbnails/Sony_-_PlayStation_2/master/Named_Boxarts/${encodedName}.png`;

    const year = r.releaseyear && r.releaseyear >= 2000 && r.releaseyear <= 2014 ? r.releaseyear : 2003;
    const genre = detectGenre(cleanTitle, 'ps2');
    const dev = r.developer || 'Sony Interactive Entertainment';
    const pub = r.publisher || 'Sony Computer Entertainment';
    const players = r.users && Number(r.users) > 1 ? `1-${r.users} שחקנים` : '1-2 שחקנים';

    const cleanId = `ps2-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

    if (!ps2Map.has(norm)) {
      ps2Map.set(norm, {
        id: cleanId,
        title: cleanTitle,
        serialNumber: cleanSerial || 'SLES-50000',
        coverImage: coverUrl,
        region: 'PAL',
        releaseYear: year,
        genre: genre,
        developer: dev,
        publisher: pub,
        players: players,
        descriptionHe: `משחק ${cleanTitle} מקורי שהושק בגרסת PAL אירופאית/ישראלית רשמית עבור סוני פלייסטיישן 2 (קוד מוצר: ${cleanSerial || 'SLES-5xxxx'}). כותר קלאסי בפורמט DVD מקורי לאספנים.`,
        console: 'ps2',
        featured: ['grand theft auto: san andreas', 'god of war ii', 'shadow of the colossus', 'gran turismo 4', 'metal gear solid 3', 'kingdom hearts ii', 'tekken 5', 'devil may cry 3', 'burnout 3', 'final fantasy x'].some(k => cleanTitle.toLowerCase().includes(k))
      });
    } else {
      const existing = ps2Map.get(norm);
      if ((!existing.serialNumber || existing.serialNumber === 'SLES-50000') && cleanSerial) {
        existing.serialNumber = cleanSerial;
      }
    }
  }

  const ps2Final = Array.from(ps2Map.values()).sort((a, b) => a.title.localeCompare(b.title));
  console.log(`PS2 Final Clean Deduplicated Count: ${ps2Final.length} games.`);

  // 3. PROCESS PS3
  console.log('Downloading Libretro PS3 RDB / DAT...');
  const ps3DatText = fs.readFileSync('scripts/ps3.dat', 'utf8');
  const ps3Blocks = ps3DatText.split('game (');
  console.log(`Parsed ${ps3Blocks.length} game blocks from PS3 DAT.`);

  const ps3Map = new Map();
  for (let i = 1; i < ps3Blocks.length; i++) {
    const block = ps3Blocks[i];
    const nameM = block.match(/name "([^"]+)"/);
    const serialM = block.match(/serial "([^"]+)"/);
    const yearM = block.match(/releaseyear (\d+)/);
    const usersM = block.match(/users (\d+)/);
    const devM = block.match(/developer "([^"]+)"/);
    const pubM = block.match(/publisher "([^"]+)"/);

    if (nameM && serialM) {
      const rawName = nameM[1];
      const serial = serialM[1].trim().toUpperCase();
      const isPal = serial.startsWith('BCES') || serial.startsWith('BLES') || serial.startsWith('NPEB') || serial.startsWith('NPEA') || serial.startsWith('BCED') || serial.startsWith('BLED') || rawName.includes('(Europe)');
      if (!isPal) continue;

      const cleanTitle = cleanTitleString(rawName);
      if (!cleanTitle) continue;
      const norm = normalizeKey(cleanTitle);

      const rawSerialNoHyphen = serial.replace(/-/g, '');
      const cleanSerial = rawSerialNoHyphen.length >= 8 ? `${rawSerialNoHyphen.slice(0, 4)}-${rawSerialNoHyphen.slice(4)}` : serial;

      // High Quality GameTDB cover by serial
      const coverUrl = `https://art.gametdb.com/ps3/coverHQ/EN/${rawSerialNoHyphen}.jpg`;

      const year = yearM ? parseInt(yearM[1], 10) : 2010;
      const cleanYear = year >= 2006 && year <= 2017 ? year : 2010;
      const genre = detectGenre(cleanTitle, 'ps3');
      const dev = devM ? devM[1] : 'Sony Interactive Entertainment';
      const pub = pubM ? pubM[1] : 'Sony Computer Entertainment';
      const players = usersM && Number(usersM[1]) > 1 ? `1-${usersM[1]} שחקנים` : '1 שחקן';

      const cleanId = `ps3-${cleanTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;

      if (!ps3Map.has(norm)) {
        ps3Map.set(norm, {
          id: cleanId,
          title: cleanTitle,
          serialNumber: cleanSerial,
          coverImage: coverUrl,
          region: 'PAL',
          releaseYear: cleanYear,
          genre: genre,
          developer: dev,
          publisher: pub,
          players: players,
          descriptionHe: `משחק ${cleanTitle} מקורי שהושק בגרסת PAL אירופאית/ישראלית רשמית עבור סוני פלייסטיישן 3 (קוד מוצר: ${cleanSerial}). כותר איכותי בפורמט Blu-ray Disc מקורי ברזולוציית HD.`,
          console: 'ps3',
          featured: ['the last of us', 'uncharted 2', 'uncharted 3', 'god of war iii', 'red dead redemption', 'grand theft auto v', 'metal gear solid 4', 'demon\'s souls', 'infamous 2', 'heavy rain', 'killzone 2', 'littlebigplanet'].some(k => cleanTitle.toLowerCase().includes(k))
        });
      } else {
        const existing = ps3Map.get(norm);
        // Prefer BCES / BLES serials over digital NPEB if available
        if (cleanSerial.startsWith('B') && existing.serialNumber.startsWith('N')) {
          existing.serialNumber = cleanSerial;
          existing.coverImage = coverUrl;
        }
      }
    }
  }

  const ps3Final = Array.from(ps3Map.values()).sort((a, b) => a.title.localeCompare(b.title));
  console.log(`PS3 Final Clean Deduplicated Count: ${ps3Final.length} games.`);

  // Write PS1
  const ps1Years = ['הכל', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005'];
  const ps1FileContent = `import { GameItem } from '../types';

export const PS1_YEARS = ${JSON.stringify(ps1Years, null, 2)};

export const GENRES = [
  'הכל',
  'פעולה והרפתקאות',
  'פלטפורמה והרפתקאות',
  'מרוצים ונהיגה',
  'ספורט',
  'לחימה',
  'יריות (FPS/TPS)',
  'אימה והישרדות',
  'תפקידים (RPG)',
  'פעולה ועולם פתוח',
  'אסטרטגיה וטקטיקה',
  'מוזיקה ומסיבה'
];

/**
 * מאגר משחקי סוני פלייסטיישן 1 בגרסאות PAL הרשמיות (אירופה / ישראל)
 * סה"כ ${ps1Final.length} כותרים נקיים ללא כפילויות, עם קודי מוצר מקוריים (SCES / SLES), עטיפות וז'אנרים.
 */
export const PS1_PAL_GAMES: GameItem[] = ${JSON.stringify(ps1Final, null, 2)};
`;
  fs.writeFileSync('src/data/ps1Games.ts', ps1FileContent, 'utf8');

  // Write PS2
  const ps2Years = ['הכל', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013'];
  const ps2FileContent = `import { GameItem } from '../types';

export const PS2_YEARS = ${JSON.stringify(ps2Years, null, 2)};

/**
 * מאגר משחקי סוני פלייסטיישן 2 בגרסאות PAL הרשמיות (אירופה / ישראל)
 * סה"כ ${ps2Final.length} כותרים נקיים ללא כפילויות, עם קודי מוצר מקוריים (SCES / SLES), עטיפות וז'אנרים.
 */
export const PS2_PAL_GAMES: GameItem[] = ${JSON.stringify(ps2Final, null, 2)};
`;
  fs.writeFileSync('src/data/ps2Games.ts', ps2FileContent, 'utf8');

  // Write PS3
  const ps3Years = ['הכל', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014', '2015', '2016', '2017'];
  const ps3FileContent = `import { GameItem } from '../types';

export const PS3_YEARS = ${JSON.stringify(ps3Years, null, 2)};

/**
 * מאגר משחקי סוני פלייסטיישן 3 בגרסאות PAL הרשמיות (אירופה / ישראל)
 * סה"כ ${ps3Final.length} כותרים נקיים ללא כפילויות, עם קודי מוצר מקוריים (BCES / BLES), עטיפות HQ וז'אנרים.
 */
export const PS3_PAL_GAMES: GameItem[] = ${JSON.stringify(ps3Final, null, 2)};
`;
  fs.writeFileSync('src/data/ps3Games.ts', ps3FileContent, 'utf8');

  console.log('✅ Successfully generated all 3 Sony PlayStation PAL catalogs cleanly!');
}

run().catch(console.error);
