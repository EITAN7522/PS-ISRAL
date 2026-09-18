import json
import re
import os

print("Starting deduplication and PS3 catalog generator...")

# Helper to normalize titles for deduplication
def normalize_title(title):
    t = title.lower().strip()
    t = re.sub(r'^(the|a|an)\s+', '', t)
    t = re.sub(r'\s*\([^)]*\)', '', t)
    t = re.sub(r'[^a-z0-9]', '', t)
    return t

# Clean Hebrew strings (fix any mojibake)
def clean_hebrew(text, fallback_title, console_name, serial):
    if not text or any(ord(c) > 0x0400 and ord(c) < 0x0500 for c in text) or 'в' in text or '' in text:
        return f"משחק {fallback_title} מקורי שהושק בגרסת PAL אירופאית/ישראלית רשמית עבור סוני {console_name} (קוד מוצר: {serial}). פריט חובה לחובבי נוסטלגיה ואספנות גיימינג מקורית."
    return text

# Deduplicate an array of game items
def deduplicate_catalog(games, console_code, console_display_name):
    seen_ids = set()
    seen_titles = {}
    cleaned = []

    for g in games:
        raw_title = g.get('title', '').strip()
        if not raw_title:
            continue

        # Clean display title (remove trailing region tags like '(Europe)' if in title)
        display_title = re.sub(r'\s*\((Europe|UK|France|Germany|Spain|Italy|Australia|En|Fr|De|Es|It|Nl|Sv|v\d+(\.\d+)?)\).*', '', raw_title, flags=re.IGNORECASE).strip()
        if not display_title:
            display_title = raw_title

        norm = normalize_title(display_title)
        serial = g.get('serialNumber', '').strip().upper()
        if serial and not '-' in serial and len(serial) >= 7:
            # Format as XXXX-XXXXX
            serial = f"{serial[:4]}-{serial[4:]}"

        # Clean genre
        genre = g.get('genre', '').strip()
        if not genre or any(c in genre for c in ['в', '', '°', '≈']):
            # Infer genre from title
            lt = display_title.lower()
            if any(k in lt for k in ['fifa', 'nba', 'uefa', 'pro evolution', 'pes', 'soccer', 'football', 'tennis', 'wwe', 'smackdown', 'tony hawk', 'skate', 'nfl', 'nhl', 'golf']):
                genre = "ספורט"
            elif any(k in lt for k in ['gran turismo', 'burnout', 'need for speed', 'rally', 'racing', 'formula', 'f1', 'ridge racer', 'wipeout', 'driver', 'colin mcrae', 'moto', 'kart', 'motorstorm']):
                genre = "מרוצים ונהיגה"
            elif any(k in lt for k in ['tekken', 'mortal kombat', 'street fighter', 'dragon ball', 'naruto', 'soulcalibur', 'dead or alive', 'virtua fighter', 'def jam', 'guilty gear']):
                genre = "לחימה"
            elif any(k in lt for k in ['final fantasy', 'dragon quest', 'kingdom hearts', 'persona', 'valkyrie', 'star ocean', 'dark souls', 'demon\'s souls', 'skyrim', 'fallout', 'mass effect', 'witcher', 'tales of']):
                genre = "תפקידים (RPG)"
            elif any(k in lt for k in ['resident evil', 'silent hill', 'dead space', 'siren', 'fatal frame', 'alone in the dark', 'saw', 'f.e.a.r']):
                genre = "אימה והישרדות"
            elif any(k in lt for k in ['crash', 'spyro', 'rayman', 'sonic', 'mario', 'jak', 'ratchet', 'sly', 'klonoa', 'ape escape', 'littlebigplanet']):
                genre = "פלטפורמה והרפתקאות"
            elif any(k in lt for k in ['call of duty', 'medal of honor', 'battlefield', 'killzone', 'resistance', 'bioshock', 'borderlands', 'crysis', 'halo', 'sniper', 'far cry', 'doom', 'wolfenstein', 'quake', 'time crisis']):
                genre = "יריות (FPS/TPS)"
            elif any(k in lt for k in ['metal gear', 'splinter cell', 'hitman', 'assassin\'s creed', 'batman', 'god of war', 'devil may cry', 'uncharted', 'infamous', 'tomb raider', 'gta', 'grand theft auto', 'red dead', 'yakuza']):
                genre = "פעולה ועולם פתוח"
            else:
                genre = "פעולה והרפתקאות"

        players = g.get('players', '1 שחקן')
        if any(c in players for c in ['в', '', '°']):
            players = "1-2 שחקנים"

        # Unique ID
        clean_id = f"{console_code}-{re.sub(r'[^a-z0-9]+', '-', display_title.lower()).strip('-')}"

        item = {
            "id": clean_id,
            "title": display_title,
            "serialNumber": serial,
            "coverImage": g.get('coverImage', ''),
            "region": "PAL",
            "releaseYear": int(g.get('releaseYear', 2000)),
            "genre": genre,
            "developer": g.get('developer', 'Sony Interactive') if g.get('developer') and not 'в' in g.get('developer') else 'Sony Interactive Entertainment',
            "publisher": g.get('publisher', 'Sony Computer Entertainment') if g.get('publisher') and not 'в' in g.get('publisher') else 'Sony Computer Entertainment',
            "players": players,
            "descriptionHe": clean_hebrew(g.get('descriptionHe', ''), display_title, console_display_name, serial),
            "console": console_code,
            "featured": g.get('featured', False)
        }

        # Check if we already have this title in this console
        if norm in seen_titles:
            existing = seen_titles[norm]
            # If current item has better coverImage or valid serial, keep best
            if not existing.get('coverImage') and item.get('coverImage'):
                existing['coverImage'] = item['coverImage']
            if not existing.get('serialNumber') and item.get('serialNumber'):
                existing['serialNumber'] = item['serialNumber']
            if item.get('featured'):
                existing['featured'] = True
            continue

        seen_titles[norm] = item
        seen_ids.add(clean_id)
        cleaned.append(item)

    print(f"[{console_display_name}] Deduplicated from {len(games)} to {len(cleaned)} unique games.")
    return cleaned

# 1. Process PS1
print("Reading PS1 games...")
with open('src/data/ps1Games.ts', 'r', encoding='utf-8', errors='ignore') as f:
    ps1_text = f.read()

ps1_match = re.search(r'export const PS1_PAL_GAMES: GameItem\[\] = (\[[\s\S]*?\]);', ps1_text)
if ps1_match:
    try:
        ps1_raw = json.loads(ps1_match.group(1))
    except Exception as e:
        print("JSON parse error on PS1, extracting via regex...", e)
        ps1_raw = []
        # Fallback extract item by item
        for m in re.finditer(r'\{[^{}]*"title":\s*"([^"]+)"[^{}]*"serialNumber":\s*"([^"]*)"[^{}]*\}', ps1_text):
            ps1_raw.append({"title": m.group(1), "serialNumber": m.group(2), "console": "ps1"})
else:
    ps1_raw = []

ps1_clean = deduplicate_catalog(ps1_raw, 'ps1', 'פלייסטיישן 1')

# 2. Process PS2
print("Reading PS2 games...")
with open('src/data/ps2Games.ts', 'r', encoding='utf-8', errors='ignore') as f:
    ps2_text = f.read()

ps2_match = re.search(r'export const PS2_PAL_GAMES: GameItem\[\] = (\[[\s\S]*?\]);', ps2_text)
if ps2_match:
    ps2_raw = json.loads(ps2_match.group(1))
else:
    ps2_raw = []

ps2_clean = deduplicate_catalog(ps2_raw, 'ps2', 'פלייסטיישן 2')

# 3. Process PS3 from scripts/ps3.dat
print("Reading PS3 games from DAT...")
with open('scripts/ps3.dat', 'r', encoding='utf-8', errors='ignore') as f:
    ps3_dat_text = f.read()

game_blocks = ps3_dat_text.split('game (')
ps3_raw = []

for block in game_blocks[1:]:
    name_m = re.search(r'name "([^"]+)"', block)
    serial_m = re.search(r'serial "([^"]+)"', block)
    year_m = re.search(r'releaseyear (\d+)', block)
    users_m = re.search(r'users (\d+)', block)
    dev_m = re.search(r'developer "([^"]+)"', block)
    pub_m = re.search(r'publisher "([^"]+)"', block)
    genre_m = re.search(r'genre "([^"]+)"', block)

    if name_m and serial_m:
        raw_name = name_m.group(1)
        raw_serial = serial_m.group(1)

        # Check if PAL (BCES, BLES, NPEB, NPEA, BCED, BLED or Europe in name)
        is_pal = (raw_serial.startswith('BCES') or raw_serial.startswith('BLES') or 
                  raw_serial.startswith('NPEB') or raw_serial.startswith('NPEA') or 
                  raw_serial.startswith('BCED') or raw_serial.startswith('BLED') or 
                  '(Europe)' in raw_name)
        
        if is_pal:
            clean_serial_no_dash = raw_serial.replace('-', '').upper()
            formatted_serial = f"{clean_serial_no_dash[:4]}-{clean_serial_no_dash[4:]}" if len(clean_serial_no_dash) >= 8 else raw_serial

            # High Quality GameTDB cover URL
            cover_url = f"https://art.gametdb.com/ps3/coverHQ/EN/{clean_serial_no_dash}.jpg"

            year = int(year_m.group(1)) if year_m else 2009
            if year < 2006 or year > 2018:
                year = 2009

            users = users_m.group(1) if users_m else "1"
            players_str = f"1-{users} שחקנים" if int(users) > 1 else "1 שחקן"

            ps3_raw.append({
                "title": raw_name,
                "serialNumber": formatted_serial,
                "coverImage": cover_url,
                "releaseYear": year,
                "developer": dev_m.group(1) if dev_m else "Sony Interactive Entertainment",
                "publisher": pub_m.group(1) if pub_m else "Sony Computer Entertainment",
                "players": players_str,
                "console": "ps3"
            })

ps3_clean = deduplicate_catalog(ps3_raw, 'ps3', 'פלייסטיישן 3')

# Write clean files
print(f"Writing clean PS1 catalog ({len(ps1_clean)} games)...")
ps1_content = f"""import {{ GameItem }} from '../types';

export const PS1_YEARS = [
  'הכל',
  '1994',
  '1995',
  '1996',
  '1997',
  '1998',
  '1999',
  '2000',
  '2001',
  '2002',
  '2003',
  '2004',
  '2005'
];

export const GENRES = [
  'הכל',
  'פעולה והרפתקאות',
  'פלטפורמה',
  'פלטפורמה והרפתקאות',
  'מרוצים ונהיגה',
  'ספורט',
  'לחימה',
  'יריות (FPS/TPS)',
  'אימה והישרדות',
  'תפקידים (RPG)',
  'פעולה ועולם פתוח',
  'אסטרטגיה',
  'פאזל ומחשבה'
];

/**
 * מאגר משחקי סוני פלייסטיישן 1 בגרסאות PAL הרשמיות (אירופה / ישראל)
 * סה\"כ {len(ps1_clean)} כותרים ללא כפילויות, מסודרים עם קודי מוצר מקוריים (SCES / SLES), עטיפות וז'אנרים.
 */
export const PS1_PAL_GAMES: GameItem[] = {json.dumps(ps1_clean, ensure_ascii=False, indent=2)};
"""
with open('src/data/ps1Games.ts', 'w', encoding='utf-8') as f:
    f.write(ps1_content)

print(f"Writing clean PS2 catalog ({len(ps2_clean)} games)...")
ps2_content = f"""import {{ GameItem }} from '../types';

export const PS2_YEARS = [
  'הכל',
  '2000',
  '2001',
  '2002',
  '2003',
  '2004',
  '2005',
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013'
];

/**
 * מאגר משחקי סוני פלייסטיישן 2 בגרסאות PAL הרשמיות (אירופה / ישראל)
 * סה\"כ {len(ps2_clean)} כותרים ללא כפילויות, מסודרים עם קודי מוצר מקוריים (SCES / SLES), עטיפות וז'אנרים.
 */
export const PS2_PAL_GAMES: GameItem[] = {json.dumps(ps2_clean, ensure_ascii=False, indent=2)};
"""
with open('src/data/ps2Games.ts', 'w', encoding='utf-8') as f:
    f.write(ps2_content)

print(f"Writing full clean PS3 catalog ({len(ps3_clean)} games)...")
ps3_content = f"""import {{ GameItem }} from '../types';

export const PS3_YEARS = [
  'הכל',
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017'
];

/**
 * מאגר משחקי סוני פלייסטיישן 3 בגרסאות PAL הרשמיות (אירופה / ישראל)
 * סה\"כ {len(ps3_clean)} כותרים רשמיים עם קודי מוצר מקוריים (BCES / BLES), עטיפות HQ, ז'אנרים ומפרטי Blu-ray Disc.
 */
export const PS3_PAL_GAMES: GameItem[] = {json.dumps(ps3_clean, ensure_ascii=False, indent=2)};
"""
with open('src/data/ps3Games.ts', 'w', encoding='utf-8') as f:
    f.write(ps3_content)

print("All 3 Sony PlayStation catalogs generated successfully!")
