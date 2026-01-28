"use client";

import { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import Topbar, { ThemeName } from "@/components/Topbar";
import Bottombar from "@/components/Bottombar";
import SettingsPanel from "@/components/SettingsPanel";

const THEME_NAMES: ThemeName[] = ["orange", "purple", "green", "teal", "rose", "blue"];

function normalizeTheme(themeName: string): ThemeName {
  return THEME_NAMES.includes(themeName as ThemeName) ? (themeName as ThemeName) : "orange";
}

export default function ArcadeClient() {
  const [theme, setThemeState] = useState<ThemeName>("orange");

  const toggleSettings = useCallback(() => {
    const settingsButton = document.getElementById("settingsButton");
    const settingsPanel = document.querySelector(".settings-panel") as HTMLElement | null;
    if (!settingsPanel) return;

    const isOpen = settingsPanel.style.display === "block";
    settingsPanel.style.display = isOpen ? "none" : "block";
    settingsButton?.classList.toggle("settings-open", !isOpen);
  }, []);

  useEffect(() => {
    const MAX_RECENT = 5;

    const recentlyPlayedGrid = document.getElementById("recentlyPlayedGrid")!;
    const gameGrid = document.getElementById("gameGrid")!;
    const settingsButton = document.getElementById("settingsButton")!;
    const settingsPanel = document.querySelector(".settings-panel") as HTMLElement;
    const themeSelect = document.getElementById("themeSelect") as HTMLSelectElement;
    const importButton = document.getElementById("importProgress")!;
    const importFile = document.getElementById("importFile") as HTMLInputElement;

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

    function setTheme(themeName: ThemeName) {
      // @ts-expect-error global from themes.js
      const c = window.colors?.[themeName];
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

      setCookie("theme", themeName, 30);
      setThemeState(themeName); // <-- keep React in sync
    }

    const savedTheme = getCookie("theme");
    const initialTheme = normalizeTheme(savedTheme ?? "orange");
    if (!savedTheme) setCookie("theme", "orange", 30);

    setTheme(initialTheme);
    themeSelect.value = initialTheme;

    settingsButton.addEventListener("click", toggleSettings);
    themeSelect.addEventListener("change", () => setTheme(normalizeTheme(themeSelect.value)));

    // ... keep the rest of your existing effect code ...

    return () => {
      settingsButton.removeEventListener("click", toggleSettings);
    };
  }, [toggleSettings]);

  return (
    <>
      <Script src="/js/themes.js" strategy="beforeInteractive" />

      {/* Now Topbar receives required props */}
      <Topbar theme={theme} onSettingsClick={toggleSettings} />

      <div className="main-content">
        {/* ... unchanged ... */}
      </div>

      <Bottombar />
      <SettingsPanel />
    </>
  );
}
