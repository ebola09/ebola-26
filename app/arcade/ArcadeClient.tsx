"use client";

import { useEffect } from "react";
import Script from "next/script";
import Topbar from "@/components/topbar";
import Bottombar from "@/components/Bottombar";
import SettingsPanel from "@/components/SettingsPanel";

export default function ArcadeClient() {
  useEffect(() => {
    // ===== Port of your initApp() logic =====
    const MAX_RECENT = 5;

    const recentlyPlayedGrid = document.getElementById("recentlyPlayedGrid")!;
    const gameGrid = document.getElementById("gameGrid")!;
    const settingsButton = document.getElementById("settingsButton")!;
    const settingsPanel = document.querySelector(".settings-panel") as HTMLElement;
    const themeSelect = document.getElementById("themeSelect") as HTMLSelectElement;
    const importButton = document.getElementById("importProgress")!;
    const importFile = document.getElementById("importFile") as HTMLInputElement;

    // active tab highlight (ported from your pathname logic) :contentReference[oaicite:3]{index=3}
    const leftLinks = document.querySelectorAll(".topbar .left a");
    leftLinks.forEach((link) => link.classList.remove("active"));
    leftLinks[0]?.classList.add("active");

    function getCookie(name: string) {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      return parts.length === 2 ? parts.pop()!.split(";").shift() : null;
    }

    function setCookie(name: string, value: string, days?: number) {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = `${name}=${value}${expires}; path=/`;
    }

    function getRecentlyPlayed() {
      const cookie = getCookie("recentlyPlayed");
      if (!cookie) return [];
      try {
        return JSON.parse(cookie);
      } catch {
        return [];
      }
    }

    function saveRecentlyPlayed(games: any[]) {
      setCookie("recentlyPlayed", JSON.stringify(games), 30);
    }

    function updateRecentlyPlayedUI(games: any[]) {
      recentlyPlayedGrid.innerHTML = "";
      if (!games.length) {
        recentlyPlayedGrid.innerHTML =
          "<p style='color: var(--link-color);'>you haven't played any games yet :(</p>";
        return;
      }
      games.forEach((game) => {
        const card = document.createElement("a");
        card.href = game.path || "#";
        card.className = "card";
        card.style.backgroundImage = `url('${game.thumbnail || ""}')`;
        card.setAttribute("data-title", game.name || "Untitled");
        recentlyPlayedGrid.appendChild(card);
      });
    }

    function addRecentlyPlayed(game: any) {
      const recent = getRecentlyPlayed().filter((g: any) => g.name !== game.name);
      recent.unshift(game);
      if (recent.length > MAX_RECENT) recent.pop();
      saveRecentlyPlayed(recent);
      updateRecentlyPlayedUI(recent);
    }

    function getFavorites() {
      const cookie = getCookie("favorites");
      if (!cookie) return [];
      try {
        return JSON.parse(cookie);
      } catch {
        return [];
      }
    }

    function saveFavorites(games: any[]) {
      setCookie("favorites", JSON.stringify(games), 30);
    }

    function isFavorited(game: any) {
      return getFavorites().some((f: any) => f.name === game.name);
    }

    let allGames: any[] = [];

    function sortGames(games: any[]) {
      return games.sort((a, b) => {
        const aFav = isFavorited(a);
        const bFav = isFavorited(b);
        if (aFav && !bFav) return -1;
        if (!aFav && bFav) return 1;
        return (a.name || "").toLowerCase().localeCompare((b.name || "").toLowerCase());
      });
    }

    function displayGames(games: any[]) {
      gameGrid.innerHTML = "";
      games.forEach((game) => {
        const card = document.createElement("a");
        card.href = game.path || "#";
        card.className = "card";
        if (isFavorited(game)) card.classList.add("favorited");
        card.style.backgroundImage = `url('${game.thumbnail || ""}')`;
        card.setAttribute("data-title", game.name || "Untitled");
        card.addEventListener("click", () => addRecentlyPlayed(game));

        const favoriteBadge = document.createElement("div");
        favoriteBadge.className = "favorite-badge";
        favoriteBadge.textContent = isFavorited(game) ? "★" : "☆";
        favoriteBadge.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          let favs = getFavorites();
          if (isFavorited(game)) favs = favs.filter((f: any) => f.name !== game.name);
          else favs.push(game);
          saveFavorites(favs);

          const query = (document.getElementById("gameSearch") as HTMLInputElement).value.toLowerCase();
          let gamesToDisplay = allGames;
          if (query) {
            gamesToDisplay = allGames.filter((g) => {
              const nameMatch = (g.name || "").toLowerCase().includes(query);
              const tagMatch = g.tags && g.tags.some((tag: string) => tag.toLowerCase().includes(query));
              return nameMatch || tagMatch;
            });
          }
          displayGames(sortGames(gamesToDisplay));
        });

        card.appendChild(favoriteBadge);

        if (game.tags && game.tags.includes("new")) {
          const newBadge = document.createElement("div");
          newBadge.className = "new-badge";
          newBadge.textContent = "new";
          card.appendChild(newBadge);
        }

        gameGrid.appendChild(card);
      });
    }

    // export/import localStorage (ported) :contentReference[oaicite:4]{index=4}
    document.getElementById("exportProgress")!.addEventListener("click", () => {
      const allStorage: Record<string, string | null> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)!;
        allStorage[key] = localStorage.getItem(key);
      }
      const blob = new Blob([JSON.stringify(allStorage, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "localStorage_backup.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    });

    importButton.addEventListener("click", () => importFile.click());
    importFile.addEventListener("change", (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        try {
          localStorage.setItem("gameProgress", JSON.stringify(JSON.parse(String(reader.result))));
          alert("Game progress imported successfully!");
        } catch {
          alert("Invalid JSON file. Please select a valid game progress file.");
        }
      };
      reader.readAsText(file);
      importFile.value = "";
    });

    // themes: relies on global `colors` from your themes.js :contentReference[oaicite:5]{index=5}
    function setTheme(theme: string) {
      // @ts-expect-error global from themes.js
      const c = window.colors?.[theme];
      if (!c) return;

      const root = document.documentElement;
      root.style.setProperty("--bg-color", c.bg);
      root.style.setProperty("--text-color", c.text);
      root.style.setProperty("--link-color", c.link);
      root.style.setProperty("--link-hover-color", c.hover);
      root.style.setProperty("--card-border-color", c.border);
      root.style.setProperty("--card-overlay-color", c.overlay);
      root.style.setProperty("--bottombar-border-color", c.bottomBorder);
      root.style.setProperty("--bottombar-opacity", c.opacity);

      document.querySelectorAll(".tos-button").forEach((btn) => {
        (btn as HTMLElement).style.backgroundColor = c.bg;
        (btn as HTMLElement).style.color = c.text;
        (btn as HTMLElement).style.borderColor = c.border;
      });

      const svg = document.querySelector(".topbar .logo svg");
      if (svg) svg.querySelectorAll("path").forEach((p) => p.setAttribute("fill", c.svgColor));

      setCookie("theme", theme, 30);
    }

    const savedTheme = getCookie("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      themeSelect.value = savedTheme;
    } else {
      setCookie("theme", "orange", 30);
      setTheme("orange");
      themeSelect.value = "orange";
    }

    settingsButton.addEventListener("click", () => {
      const isOpen = settingsPanel.style.display === "block";
      settingsPanel.style.display = isOpen ? "none" : "block";
      settingsButton.classList.toggle("settings-open", !isOpen);
    });

    themeSelect.addEventListener("change", () => setTheme(themeSelect.value));

    // load games list (adjusted path for Next page) :contentReference[oaicite:6]{index=6}
    fetch("/arcade/gameList.json")
      .then((res) => res.json())
      .then((data) => {
        if (!data.games?.length) {
          gameGrid.innerHTML = `<p style="color: var(--link-color);">No games found. Check gameList.json.</p>`;
          return;
        }
        allGames = sortGames(data.games);
        displayGames(allGames);
      })
      .catch((err) => {
        gameGrid.innerHTML = `<p style="color: var(--link-color);">Failed to load gameList.json</p>`;
        console.error("Error loading game list:", err);
      });

    const gameSearch = document.getElementById("gameSearch") as HTMLInputElement;
    gameSearch.addEventListener("input", () => {
      const query = gameSearch.value.toLowerCase();
      const filteredGames = allGames.filter((game) => {
        const nameMatch = (game.name || "").toLowerCase().includes(query);
        const tagMatch = game.tags && game.tags.some((tag: string) => tag.toLowerCase().includes(query));
        return nameMatch || tagMatch;
      });
      displayGames(sortGames(filteredGames));
    });

    updateRecentlyPlayedUI(getRecentlyPlayed());

    // cleanup (avoid duplicate listeners in dev hot reload)
    return () => {};
  }, []);

  return (
    <>
      {/* Loads your existing JS that defines `colors` etc. */}
      <Script src="/js/themes.js" strategy="beforeInteractive" />

      {/* Your old HTML structure, but now as JSX */}
      <Topbar />

      <div className="main-content">
        <div className="games-container">
          <div className="grid-section">
            <h2 className="grid-title">recently played</h2>
            <div id="recentlyPlayedGrid" />
          </div>

          <div className="grid-section">
            <div className="grid-title-container">
              <h2 className="grid-title">all games</h2>
              <input type="text" className="search-input" id="gameSearch" placeholder="search" />
            </div>
            <div id="gameGrid" />
          </div>
        </div>
      </div>

      <Bottombar />
      <SettingsPanel />
    </>
  );
}
