/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { Search, Gamepad2, X, Maximize2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import gamesData from './games.json';

export default function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const filteredGames = useMemo(() => {
    return gamesData.filter(game => 
      game.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-emerald-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setSelectedGame(null)}>
            <div className="p-2 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20">
              <Gamepad2 className="w-6 h-6 text-black" />
            </div>
            <h1 className="text-xl font-bold tracking-tight uppercase italic">Unblocked Hub</h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
            <input
              type="text"
              placeholder="Search games..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-white/20"
            />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {!selectedGame ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredGames.map((game) => (
                <motion.div
                  key={game.id}
                  layoutId={game.id}
                  onClick={() => setSelectedGame(game)}
                  className="group relative bg-[#151515] rounded-2xl overflow-hidden border border-white/5 hover:border-emerald-500/50 transition-all cursor-pointer"
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={game.thumbnail}
                      alt={game.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <h3 className="font-semibold text-lg">{game.title}</h3>
                    <p className="text-white/40 text-sm mt-1">Click to play</p>
                  </div>
                  <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                </motion.div>
              ))}
              {filteredGames.length === 0 && (
                <div className="col-span-full py-20 text-center text-white/40">
                  <p className="text-xl">No games found matching "{searchQuery}"</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`relative flex flex-col gap-4 ${isFullScreen ? 'fixed inset-0 z-50 bg-black p-0' : ''}`}
            >
              {/* Player Controls */}
              <div className={`flex items-center justify-between ${isFullScreen ? 'absolute top-4 right-4 z-50 bg-black/50 p-2 rounded-xl backdrop-blur-md' : ''}`}>
                {!isFullScreen && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setSelectedGame(null)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                    <h2 className="text-2xl font-bold">{selectedGame.title}</h2>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsFullScreen(!isFullScreen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                    title="Toggle Fullscreen"
                  >
                    <Maximize2 className="w-5 h-5" />
                    {!isFullScreen && <span className="text-sm font-medium">Fullscreen</span>}
                  </button>
                  <a
                    href={selectedGame.iframeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
                  >
                    <ExternalLink className="w-5 h-5" />
                    {!isFullScreen && <span className="text-sm font-medium">Open Original</span>}
                  </a>
                  {isFullScreen && (
                    <button
                      onClick={() => setIsFullScreen(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  )}
                </div>
              </div>

              {/* Iframe Container */}
              <div className={`relative bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl ${isFullScreen ? 'h-full w-full rounded-none border-none' : 'aspect-video w-full'}`}>
                <iframe
                  src={selectedGame.iframeUrl}
                  className="w-full h-full border-none"
                  title={selectedGame.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {!isFullScreen && (
                <div className="flex flex-col gap-2 mt-4">
                  <h4 className="text-white/40 uppercase text-xs font-bold tracking-widest">About this game</h4>
                  <p className="text-white/80 leading-relaxed">
                    Enjoy {selectedGame.title} directly in your browser. This game is loaded via a secure iframe. 
                    If the game doesn't load, try opening it in a new tab using the "Open Original" button.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/5 py-8 px-6 text-center text-white/20 text-sm">
        <p>© 2026 Unblocked Hub • Built with React & Tailwind</p>
      </footer>
    </div>
  );
}
