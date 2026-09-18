import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { DatabaseView } from './components/DatabaseView';
import { MarketplaceView } from './components/MarketplaceView';
import { PublishWizard } from './components/PublishWizard';
import { AboutView } from './components/AboutView';
import { ListingDetailModal } from './components/ListingDetailModal';
import { GameDetailModal } from './components/GameDetailModal';
import { StorageService } from './services/storageService';
import { GameItem, MarketplaceListing, ConsoleType, PS1Game } from './types';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'home' | 'database' | 'marketplace' | 'publish' | 'about'>('home');
  const [games, setGames] = useState<PS1Game[]>([]);
  const [listings, setListings] = useState<MarketplaceListing[]>([]);
  
  // Modals & Navigation state
  const [selectedListing, setSelectedListing] = useState<MarketplaceListing | null>(null);
  const [selectedGame, setSelectedGame] = useState<PS1Game | null>(null);
  const [prefilledGameForPublish, setPrefilledGameForPublish] = useState<PS1Game | null>(null);
  const [searchInitialQuery, setSearchInitialQuery] = useState<string>('');
  const [searchInitialConsole, setSearchInitialConsole] = useState<'all' | 'ps1' | 'ps2' | 'ps3'>('all');

  // Toast notification for newly published listings
  const [toastMessage, setToastMessage] = useState<string>('');

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

  const handleNavigateToPublish = (game?: PS1Game) => {
    setPrefilledGameForPublish(game || null);
    setActiveTab('publish');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Publish success handler
  const handlePublishSuccess = (newListingData: MarketplaceListing) => {
    const created = StorageService.addListing(newListingData);
    refreshListings();
    
    // Show toast
    setToastMessage(`המודעה למשחק "${created.gameTitle}" פורסמה בהצלחה וזמינה כעת באתר!`);
    setTimeout(() => {
      setToastMessage('');
    }, 6000);

    // Redirect to marketplace and open the newly created listing
    setActiveTab('marketplace');
    setSelectedListing(created);
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
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 right-6 sm:left-auto sm:right-6 z-50 max-w-md bg-emerald-900/95 border-2 border-emerald-500 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-bounce">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-500/30 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-300" />
            </div>
            <span className="text-xs sm:text-sm font-bold leading-tight">
              {toastMessage}
            </span>
          </div>
          <button
            onClick={() => setToastMessage('')}
            className="p-1 hover:bg-emerald-800 rounded-lg text-emerald-300 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

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
            onNavigateToPublish={handleNavigateToPublish}
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
            onPublishForGame={(game) => handleNavigateToPublish(game)}
            initialSearchQuery={searchInitialQuery}
            initialConsole={searchInitialConsole}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceView
            listings={listings}
            onSelectListing={(listing) => setSelectedListing(listing)}
            onNavigateToPublish={() => handleNavigateToPublish()}
            initialSearchQuery={searchInitialQuery}
            initialConsole={searchInitialConsole}
          />
        )}

        {activeTab === 'publish' && (
          <PublishWizard
            gamesCatalog={games}
            initialSelectedGame={prefilledGameForPublish}
            onPublishSuccess={handlePublishSuccess}
            onCancel={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'about' && (
          <AboutView
            onNavigateToPublish={() => handleNavigateToPublish()}
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
          onPublishForGame={(game) => handleNavigateToPublish(game)}
        />
      )}

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />

    </div>
  );
}
