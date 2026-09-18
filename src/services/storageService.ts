import { GameItem, MarketplaceListing, FilterState, ConsoleType } from '../types';
import { PS1_PAL_GAMES } from '../data/ps1Games';
import { PS2_PAL_GAMES } from '../data/ps2Games';
import { PS3_PAL_GAMES } from '../data/ps3Games';
import { INITIAL_LISTINGS } from '../data/initialListings';

const LISTINGS_STORAGE_KEY = 'videogamesil_marketplace_listings_v4';

// Clear old mock data versions if present
try {
  localStorage.removeItem('ps1_marketplace_listings_v1');
  localStorage.removeItem('ps1_marketplace_listings_v2');
  localStorage.removeItem('ps1_marketplace_listings_v3');
} catch (e) {
  // ignore in SSR / restricted environments
}

// Cached combined list for high performance
let combinedGamesCache: GameItem[] | null = null;

export const StorageService = {
  getGames(consoleFilter?: ConsoleType | 'all'): GameItem[] {
    if (!combinedGamesCache) {
      combinedGamesCache = [...PS1_PAL_GAMES, ...PS2_PAL_GAMES, ...PS3_PAL_GAMES];
    }
    if (consoleFilter && consoleFilter !== 'all') {
      return combinedGamesCache.filter((g) => g.console === consoleFilter);
    }
    return combinedGamesCache;
  },

  getPs1Games(): GameItem[] {
    return PS1_PAL_GAMES;
  },

  getPs2Games(): GameItem[] {
    return PS2_PAL_GAMES;
  },

  getPs3Games(): GameItem[] {
    return PS3_PAL_GAMES;
  },

  getGameById(id: string): GameItem | undefined {
    const games = this.getGames();
    return games.find((g) => g.id === id);
  },

  getListings(): MarketplaceListing[] {
    try {
      const stored = localStorage.getItem(LISTINGS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to load listings from localStorage', e);
    }
    // Initialize with empty array (0 listings)
    this.saveListings(INITIAL_LISTINGS);
    return INITIAL_LISTINGS;
  },

  saveListings(listings: MarketplaceListing[]): void {
    try {
      localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
    } catch (e) {
      console.error('Failed to save listings to localStorage', e);
    }
  },

  addListing(newListingData: Omit<MarketplaceListing, 'id' | 'createdAt' | 'viewsCount'>): MarketplaceListing {
    const listings = this.getListings();
    const newListing: MarketplaceListing = {
      ...newListingData,
      id: `listing-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      createdAt: new Date().toISOString(),
      viewsCount: 1,
    };

    const updated = [newListing, ...listings];
    this.saveListings(updated);
    return newListing;
  },

  getListingById(id: string): MarketplaceListing | undefined {
    const listings = this.getListings();
    const listing = listings.find((l) => l.id === id);
    if (listing) {
      // Increment view count safely
      listing.viewsCount = (listing.viewsCount || 0) + 1;
      this.saveListings(listings);
    }
    return listing;
  },

  deleteListing(id: string, enteredPasscode: string): { success: boolean; message: string } {
    const listings = this.getListings();
    const listing = listings.find((l) => l.id === id);

    if (!listing) {
      return { success: false, message: 'המודעה לא נמצאה במערכת.' };
    }

    // Check passcode or master bypass
    if (listing.deletePasscode && listing.deletePasscode !== enteredPasscode.trim() && enteredPasscode !== '1234') {
      return { success: false, message: 'קוד המחיקה שהוזן שגוי. יש להזין את הקוד שנקבע בעת פרסום המודעה.' };
    }

    const filtered = listings.filter((l) => l.id !== id);
    this.saveListings(filtered);
    return { success: true, message: 'המודעה נמחקה בהצלחה מהמאגר.' };
  },

  getListingsForGame(gameId: string): MarketplaceListing[] {
    const listings = this.getListings();
    return listings.filter((l) => l.gameId === gameId);
  },

  filterListings(listings: MarketplaceListing[], filters: FilterState): MarketplaceListing[] {
    return listings.filter((item) => {
      // Console filter
      if (filters.console && filters.console !== 'all') {
        if (item.console !== filters.console) return false;
      }

      // Search query (game name, description, city)
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase().trim();
        const matchTitle = item.gameTitle.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchCity = item.city.toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchCity) return false;
      }

      // City filter
      if (filters.city && filters.city !== 'all') {
        if (item.city !== filters.city) return false;
      }

      // Min Price
      if (filters.minPrice && !isNaN(Number(filters.minPrice))) {
        if (item.price < Number(filters.minPrice)) return false;
      }

      // Max Price
      if (filters.maxPrice && !isNaN(Number(filters.maxPrice))) {
        if (item.price > Number(filters.maxPrice)) return false;
      }

      // Condition
      if (filters.condition && filters.condition !== 'all') {
        if (item.condition !== filters.condition) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (filters.sortBy === 'price-asc') {
        return a.price - b.price;
      }
      if (filters.sortBy === 'price-desc') {
        return b.price - a.price;
      }
      if (filters.sortBy === 'name') {
        return a.gameTitle.localeCompare(b.gameTitle);
      }
      return 0;
    });
  },

  resetToDefaultListings(): void {
    this.saveListings(INITIAL_LISTINGS);
  }
};

