'use client';

import { useEffect, useState } from 'react';
import Topbar from '../../components/Topbar';
import SettingsPanel from '../../components/SettingsPanel';
import Bottombar from '../../components/Bottombar';

interface Game {
  gameID: number;
  name: string;
  path: string;
  thumbnail: string;
  dateAdded: string;
  tags?: string[];
}

const COLORS = {
  orange: { bg: '#0d0502', text: '#E8620E', link: '#913800', hover: '#E8620E', border: '#210D00', overlay: 'rgba(33,13,0,0.75)', bottomBorder: '#913800', opacity: 0.6, svgColor: '#FF6200' },
  purple: { bg: '#0D0012', text: '#A70EE8', link: '#5A077D', hover: '#A70EE8', border: '#310046', overlay: 'rgba(49,0,70,0.75)', bottomBorder: '#5A077D', opacity: 0.6, svgColor: '#A70EE8' },
  green: { bg: '#000D00', text: '#0EE811', link: '#077408', hover: '#0EE811', border: '#004501', overlay: 'rgba(7,116,8,0.75)', bottomBorder: '#077408', opacity: 0.6, svgColor: '#0EE811' },
  teal: { bg: '#00150F', text: '#0EE8CB', link: '#0A836D', hover: '#0EE8CB', border: '#004641', overlay: 'rgba(0,31,33,0.75)', bottomBorder: '#0A836D', opacity: 0.6, svgColor: '#0EE8CB' },
  rose: { bg: '#120011', text: '#E80EB1', link: '#7D0767', hover: '#E80EB1', border: '#46002A', overlay: 'rgba(73,24,65,0.75)', bottomBorder: '#7D0767', opacity: 0.6, svgColor: '#E80EB1' },
  blue: { bg: '#001729', text: '#0055FF', link: '#005394', hover: '#0055FF', border: '#00335C', overlay: 'rgba(0,22,39,0.75)', bottomBorder: '#005394', opacity: 0.6, svgColor: '#0055FF' }
};

export default function ArcadePage() {
  const [allGames, setAllGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Game[]>([]);
  const [favorites, setFavorites] = useState<Game[]>([]);
  const [theme, setTheme] = useState<keyof typeof COLORS>('orange');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const MAX_RECENT = 5;

  // Cookie utilities
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop()?.split(';').shift() : null;
  };

  const setCookie = (name: string, value: string, days: number = 30) => {
    let expires = '';
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = '; expires=' + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  };

  // Recently Played
  const getRecentlyPlayedFromStorage = () => {
    const cookie = getCookie('recentlyPlayed');
    if (!cookie) return [];
    try {
      return JSON.parse(cookie);
    } catch {
      return [];
    }
  };

  const saveRecentlyPlayed = (games: Game[]) => {
    setCookie('recentlyPlayed', JSON.stringify(games));
    setRecentlyPlayed(games);
  };

  const addRecentlyPlayed = (game: Game) => {
    const recent = getRecentlyPlayedFromStorage().filter((g: Game) => g.name !== game.name);
    recent.unshift(game);
    if (recent.length > MAX_RECENT) recent.pop();
    saveRecentlyPlayed(recent);
  };

  // Favorites
  const getFavoritesFromStorage = () => {
    const cookie = getCookie('favorites');
    if (!cookie) return [];
    try {
      return JSON.parse(cookie);
    } catch {
      return [];
    }
  };

  const saveFavorites = (games: Game[]) => {
    setCookie('favorites', JSON.stringify(games));
    setFavorites(games);
  };

  const isFavorited = (game: Game, favs: Game[] = favorites) => {
    return favs.some(f => f.name === game.name);
  };

  const toggleFavorite = (game: Game) => {
    const favs = getFavoritesFromStorage();
    let newFavs;
    if (isFavorited(game, favs)) {
      newFavs = favs.filter((f: Game) => f.name !== game.name);
    } else {
      newFavs = [...favs, game];
    }
    saveFavorites(newFavs);
    updateGamesDisplay(searchQuery, newFavs);
  };

  const sortGames = (games: Game[], favs: Game[] = favorites) => {
    return games.sort((a, b) => {
      const aFav = isFavorited(a, favs);
      const bFav = isFavorited(b, favs);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return (a.name || '').toLowerCase().localeCompare((b.name || '').toLowerCase());
    });
  };

  const updateGamesDisplay = (query: string, favs?: Game[]) => {
    const currentFavs = favs || getFavoritesFromStorage();
    let gamesToDisplay = allGames;
    if (query) {
      gamesToDisplay = allGames.filter(g => {
        const nameMatch = (g.name || '').toLowerCase().includes(query);
        const tagMatch = g.tags && g.tags.some(tag => tag.toLowerCase().includes(query));
        return nameMatch || tagMatch;
      });
    }
    setFilteredGames(sortGames(gamesToDisplay, currentFavs));
  };

  const setThemeStyle = (themeName: keyof typeof COLORS) => {
    const c = COLORS[themeName];
    const root = document.documentElement;
    root.style.setProperty('--bg-color', c.bg);
    root.style.setProperty('--text-color', c.text);
    root.style.setProperty('--link-color', c.link);
    root.style.setProperty('--link-hover-color', c.hover);
    root.style.setProperty('--card-border-color', c.border);
    root.style.setProperty('--card-overlay-color', c.overlay);
    root.style.setProperty('--bottombar-border-color', c.bottomBorder);
    root.style.setProperty('--bottombar-opacity', c.opacity.toString());
    setCookie('theme', themeName);
    setTheme(themeName);
  };

  const exportProgress = () => {
    const allStorage: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) allStorage[key] = localStorage.getItem(key) || '';
    }
    const blob = new Blob([JSON.stringify(allStorage, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'localStorage_backup.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importProgress = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        localStorage.setItem('gameProgress', JSON.stringify(JSON.parse(reader.result as string)));
        alert('Game progress imported successfully!');
      } catch {
        alert('Invalid JSON file. Please select a valid game progress file.');
      }
    };
    reader.readAsText(file);
  };

  // Initialize
  useEffect(() => {
    // Load theme
    const savedTheme = (getCookie('theme') as keyof typeof COLORS) || 'orange';
    setThemeStyle(savedTheme);

    // Load games and blacklist
    Promise.all([
      fetch('https://cdn.jsdelivr.net/gh/gn-math/assets@master/zones.json').then(res => res.json()),
      fetch('/blacklist.json').then(res => res.json()),
      fetch('/localGames.json').then(res => res.json()).catch(() => [])
    ])
      .then(([gamesData, blacklist, localGames]) => {
        const blacklistIds = new Set(blacklist);
        const allGamesList: Game[] = [];

        // Add CDN games
        if (gamesData?.length) {
          const cdnGames = gamesData
            .filter((g: any) => !blacklistIds.has(g.id))
            .map((g: any) => ({
              gameID: g.id,
              name: g.name,
              path: `/arcade/${g.id}`,
              thumbnail: `https://cdn.jsdelivr.net/gh/gn-math/covers@main/${g.id}.png`,
              dateAdded: '0',
              tags: []
            })) as Game[];
          allGamesList.push(...cdnGames);
        }

        // Add local games
        if (localGames?.length) {
          const local = localGames
            .map((g: any) => ({
              gameID: g.id,
              name: g.name,
              path: g.url,
              thumbnail: g.cover,
              dateAdded: '0',
              tags: g.tags || []
            })) as Game[];
          allGamesList.push(...local);
        }

        setAllGames(allGamesList);
        const favs = getFavoritesFromStorage();
        setFilteredGames(sortGames(allGamesList, favs));
      })
      .catch(err => console.error('Error loading game list:', err));

    // Load recently played
    const recent = getRecentlyPlayedFromStorage();
    setRecentlyPlayed(recent);

    // Load favorites
    const favs = getFavoritesFromStorage();
    setFavorites(favs);

    // Initialize localStorage
    if (!localStorage.getItem('gameProgress')) {
      localStorage.setItem('gameProgress', '{}');
    }

    // Handle tree.html easter egg
    const sequence = ['t', 'r', 'e', 'e'];
    let currentIndex = 0;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === sequence[currentIndex]) {
        currentIndex++;
        if (currentIndex === sequence.length) {
          window.location.href = '/arcade/tree.html';
        }
      } else {
        currentIndex = 0;
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <style>
        {`
          :root {
            --bg-color: ${COLORS[theme].bg};
            --text-color: ${COLORS[theme].text};
            --link-color: ${COLORS[theme].link};
            --link-hover-color: ${COLORS[theme].hover};
            --card-border-color: ${COLORS[theme].border};
            --card-overlay-color: ${COLORS[theme].overlay};
            --bottombar-border-color: ${COLORS[theme].bottomBorder};
            --bottombar-opacity: ${COLORS[theme].opacity.toString()};
          }
        `}
      </style>
      
      {/* Topbar */}
      <Topbar theme={theme} onSettingsClick={() => setSettingsOpen(!settingsOpen)} />

      {/* Main Content */}
      <div className="main-content">
        <div className="games-container">
          {/* Recently Played */}
          <div className="grid-section">
            <h2 className="grid-title">recently played</h2>
            <div id="recentlyPlayedGrid">
              {recentlyPlayed.length === 0 ? (
                <p style={{ color: 'var(--link-color)' }}>you haven't played any games yet :(</p>
              ) : (
                recentlyPlayed.map(game => (
                  <a
                    key={`recent-${game.gameID}`}
                    href={game.path}
                    onClick={() => addRecentlyPlayed(game)}
                    className="card"
                    data-title={game.name}
                  >
                    <img src={game.thumbnail} alt={game.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }} />
                  </a>
                ))
              )}
            </div>
          </div>

          {/* All Games */}
          <div className="grid-section">
            <div className="grid-title-container">
              <h2 className="grid-title">all games</h2>
              <input
                type="text"
                className="search-input"
                placeholder="search"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  updateGamesDisplay(e.target.value);
                }}
              />
            </div>
            <div id="gameGrid">
              {filteredGames.map(game => (
                <a
                  key={`game-${game.gameID}`}
                  href={game.path}
                  onClick={() => addRecentlyPlayed(game)}
                  className={`card ${isFavorited(game) ? 'favorited' : ''}`}
                  data-title={game.name}
                >
                  <img src={game.thumbnail} alt={game.name} loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none', position: 'absolute', top: 0, left: 0 }} />
                  <div
                    className="favorite-badge"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(game);
                    }}
                  >
                    {isFavorited(game) ? '★' : '☆'}
                  </div>
                  {game.tags?.includes('new') && (
                    <div className="new-badge">new</div>
                  )}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={settingsOpen}
        theme={theme}
        onThemeChange={(newTheme) => setThemeStyle(newTheme as keyof typeof COLORS)}
        onExport={exportProgress}
        onImportClick={() => {
          const input = document.getElementById('importFile') as HTMLInputElement;
          input?.click();
        }}
        onFileImport={importProgress}
      />

      {/* Bottombar */}
      <Bottombar />
    </>
  );
}
