import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DatabaseView } from './components/DatabaseView';
import { MarketplaceView } from './components/MarketplaceView';
import { AboutView } from './components/AboutView';
import { ListingDetailModal } from './components/ListingDetailModal';
import { GameDetailModal } from './components/GameDetailModal';
import { StorageService } from './services/storageService';
import { GameItem, MarketplaceListing, ConsoleType, PS1Game } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'database' | 'marketplace' | 'about'>('home');
  const [games, setGames] = useState<PS1Game[]>([]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  
  // Modals & Navigation state
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [selectedGame, setSelectedGame] = useState<PS1Game | null>(null);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [searchInitialConsole, setSearchInitialConsole] = useState<'all' | 'ps1' | 'ps2' | 'ps3'>('all');

  // Load initial data
  useEffect(() => {
    const loadedGames = StorageService.getGames();
    const loadedListings = StorageService.getListings();
    setGames(loadedGames);
    setListings(loadedListings);
  }, []);

  const refreshListings = () => {
    const loaded = StorageService.getListings();
    setListings(loaded);
  };

  // Handlers for navigation with search prefilling
  const handleNavigateToMarketplace = (searchQuery?: string, consoleFilter?: ConsoleType | 'all') => {
    if (searchQuery !== undefined) {
      setSearchInitialQuery(searchQuery);
    }
    if (consoleFilter !== undefined) {
      setSearchInitialConsole(consoleFilter === 'n64' || consoleFilter === 'xbox' || consoleFilter === 'retro' ? 'all' : consoleFilter);
    }
    setActiveTab('marketplace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToDatabase = (searchQuery?: string, consoleFilter?: ConsoleType | 'all') => {
    if (searchQuery !== undefined) {
      setSearchInitialQuery(searchQuery);
    }
    if (consoleFilter !== undefined) {
      setSearchInitialConsole(consoleFilter === 'n64' || consoleFilter === 'xbox' || consoleFilter === 'retro' ? 'all' : consoleFilter);
    }
    setActiveTab('database');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete listing handler
  const handleDeleteListing = (id: string, passcode: string) => {
    const res = StorageService.deleteListing(id, passcode);
    if (res.success) {
      refreshListings();
    }
    return res;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white" dir="rtl">
      
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        listingsCount={listings.length}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <HomeView
            games={games}
            listings={listings}
            onNavigateToMarketplace={handleNavigateToMarketplace}
            onNavigateToDatabase={handleNavigateToDatabase}
            onSelectListing={(listing) => setSelectedListing(listing)}
            onSelectGame={(game) => setSelectedGame(game)}
            onNavigateToAbout={() => {
              setActiveTab('about');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'database' && (
          <DatabaseView
            games={games}
            listings={listings}
            onSelectGame={(game) => setSelectedGame(game)}
            initialSearchQuery={searchInitialQuery}
            initialConsole={searchInitialConsole}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceView
            listings={listings}
            onSelectListing={(listing) => setSelectedListing(listing)}
            initialSearchQuery={searchInitialQuery}
            initialConsole={searchInitialConsole}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            onNavigateToDatabase={() => handleNavigateToDatabase()}
          />
        )}
      </main>

      {/* Listing Detail Modal */}
      {selectedListing && (
        <ListingDetailModal
          listing={selectedListing}
          gameDetails={games.find((g) => g.id === selectedListing.gameId)}
          onClose={() => setSelectedListing(null)}
          onDeleteListing={handleDeleteListing}
          onSelectGame={(gameId) => {
            const found = games.find((g) => g.id === gameId);
            if (found) setSelectedGame(found);
          }}
        />
      )}

      {/* Game Detail Modal from Database */}
      {selectedGame && (
        <GameDetailModal
          game={selectedGame}
          listings={listings.filter((l) => l.gameId === selectedGame.id)}
          onClose={() => setSelectedGame(null)}
          onSelectListing={(listing) => setSelectedListing(listing)}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
