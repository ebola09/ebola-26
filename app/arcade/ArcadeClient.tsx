"use client";

import { useEffect, useState, useCallback } from "react";
import Script from "next/script";
import Topbar from "@/components/Topbar";
import Bottombar from "@/components/Bottombar";
import SettingsPanel from "@/components/SettingsPanel";

const themeOptions = ["orange", "purple", "green", "teal", "rose", "blue"] as const;
type ThemeName = (typeof themeOptions)[number];

const isThemeName = (value: string | null): value is ThemeName =>
  !!value && themeOptions.includes(value as ThemeName);

export default function ArcadeClient() {
  const [theme, setThemeState] = useState<ThemeName>("orange");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const getCookie = useCallback((name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop()!.split(";").shift() ?? null : null;
  }, []);

  const setCookie = useCallback((name: string, value: string, days?: number) => {
    let expires = "";
    if (days) {
      const date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }
    document.cookie = `${name}=${value}${expires}; path=/`;
  }, []);

  const applyTheme = useCallback(
    (themeName: ThemeName) => {
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
      setThemeState(themeName);
    },
    [setCookie]
  );

  const handleThemeChange = useCallback(
    (nextTheme: string) => {
      if (isThemeName(nextTheme)) {
        applyTheme(nextTheme);
      }
    },
    [applyTheme]
  );

  const toggleSettings = useCallback(() => {
    setSettingsOpen((prev) => !prev);
  }, []);

  const handleExport = useCallback(() => {
    const allStorage: Record<string, string> = {};
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (key) allStorage[key] = localStorage.getItem(key) || "";
    }
    const blob = new Blob([JSON.stringify(allStorage, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "localStorage_backup.json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, []);

  const handleImportClick = useCallback(() => {
    const fileInput = document.getElementById("importFile") as HTMLInputElement | null;
    fileInput?.click();
  }, []);

  const handleFileImport = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        localStorage.setItem("gameProgress", JSON.stringify(JSON.parse(reader.result as string)));
        alert("Game progress imported successfully!");
      } catch {
        alert("Invalid JSON file. Please select a valid game progress file.");
      }
    };
    reader.readAsText(file);
  }, []);

  useEffect(() => {
    const savedTheme = getCookie("theme");
    const initialTheme = isThemeName(savedTheme) ? savedTheme : "orange";
    if (!savedTheme || !isThemeName(savedTheme)) {
      setCookie("theme", "orange", 30);
    }
    applyTheme(initialTheme);
  }, [applyTheme, getCookie, setCookie]);

  useEffect(() => {
    const settingsButton = document.getElementById("settingsButton");
    settingsButton?.classList.toggle("settings-open", settingsOpen);
  }, [settingsOpen]);

  return (
    <>
      <Script src="/js/themes.js" strategy="beforeInteractive" />

      {/* Now Topbar receives required props */}
      <Topbar theme={theme} onSettingsClick={toggleSettings} />

      <div className="main-content">
        {/* ... unchanged ... */}
      </div>

      <Bottombar />
      <SettingsPanel
        isOpen={settingsOpen}
        theme={theme}
        onThemeChange={handleThemeChange}
        onExport={handleExport}
        onImportClick={handleImportClick}
        onFileImport={handleFileImport}
      />
    </>
  );
}
