export type ConsoleType = 'ps1' | 'ps2' | 'ps3' | 'n64' | 'xbox' | 'retro';

export type GameRegion = 'PAL' | 'NTSC-U' | 'NTSC-J';

export type GameCondition = 'דרוש תיקון' | 'משומש' | 'חדש' | 'חדש באריזה';

export interface GameItem {
  id: string;
  title: string;
  hebrewTitle?: string;
  serialNumber: string; // e.g. SCES-00344 / SLES-50000 / BCES-00569 / BLES-00680
  coverImage: string;
  region: GameRegion;
  releaseYear: number;
  genre: string;
  developer: string;
  publisher: string;
  players: string;
  descriptionHe: string;
  console: ConsoleType;
  discsCount?: number;
  featured?: boolean;
}

// Backwards compatibility alias
export type PS1Game = GameItem;

export interface MarketplaceListing {
  id: string;
  gameId: string;
  gameTitle: string;
  console: ConsoleType;
  region: GameRegion;
  city: string;
  condition: GameCondition;
  price: number;
  phone: string;
  description: string;
  images: string[];
  createdAt: string;
  deletePasscode: string;
  includesManual?: boolean;
  includesOriginalCase?: boolean;
  viewsCount?: number;
  isPromoted?: boolean;
}

export interface FilterState {
  searchQuery: string;
  console: 'all' | 'ps1' | 'ps2' | 'ps3';
  city: string;
  minPrice: string;
  maxPrice: string;
  condition: string;
  genre: string;
  releaseYear: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'name';
}

