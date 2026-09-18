const fs = require('fs');
const ps1File = fs.readFileSync('src/data/ps1Games.ts', 'utf8');
const ps2File = fs.readFileSync('src/data/ps2Games.ts', 'utf8');

const ps1Games = JSON.parse(ps1File.match(/export const PS1_PAL_GAMES: GameItem\[\] = (\[[\s\S]*?\]);/)[1]);
const ps2Games = JSON.parse(ps2File.match(/export const PS2_PAL_GAMES: GameItem\[\] = (\[[\s\S]*?\]);/)[1]);

console.log('Original PS1 count:', ps1Games.length);
console.log('Original PS2 count:', ps2Games.length);

function checkDups(list, name) {
  const seenIds = new Set();
  const seenTitles = new Map();
  const seenSerials = new Map();
  let idDups = 0, titleDups = 0, serialDups = 0;

  for (const g of list) {
    if (seenIds.has(g.id)) idDups++;
    else seenIds.add(g.id);

    const cleanTitle = g.title.toLowerCase().trim();
    if (seenTitles.has(cleanTitle)) {
      titleDups++;
      seenTitles.get(cleanTitle).push(g);
    } else {
      seenTitles.set(cleanTitle, [g]);
    }

    if (g.serialNumber && g.serialNumber !== '') {
      if (seenSerials.has(g.serialNumber)) {
        serialDups++;
        seenSerials.get(g.serialNumber).push(g);
      } else {
        seenSerials.set(g.serialNumber, [g]);
      }
    }
  }

  console.log(`[${name}] ID duplicates: ${idDups}, Title duplicates: ${titleDups}, Serial duplicates: ${serialDups}`);
  
  let count = 0;
  for (const [title, items] of seenTitles.entries()) {
    if (items.length > 1) {
      count++;
      if (count <= 10) {
        console.log(` - Dup title '${title}':`, items.map(i => `${i.serialNumber} (${i.id})`));
      }
    }
  }
}

checkDups(ps1Games, 'PS1');
checkDups(ps2Games, 'PS2');
