'use client';

interface SettingsPanelProps {
  isOpen: boolean;
  theme: string;
  onThemeChange: (theme: string) => void;
  onExport: () => void;
  onImportClick: () => void;
  onFileImport: (file: File) => void;
  showHomeButton: boolean;
  onHomeButtonToggle: (showHomeButton: boolean) => void;
}

export default function SettingsPanel({
  isOpen,
  theme,
  onThemeChange,
  onExport,
  onImportClick,
  onFileImport,
  showHomeButton,
  onHomeButtonToggle,
}: SettingsPanelProps) {
  return (
    <>
      <div className={`settings-panel ${isOpen ? 'show' : ''}`}>
        <h3>settings</h3>
        <label htmlFor="themeSelect">theme:</label>
        <select
          id="themeSelect"
          value={theme}
          onChange={(e) => onThemeChange(e.target.value)}
        >
          <option value="orange">orange</option>
          <option value="purple">purple</option>
          <option value="green">green</option>
          <option value="blue">blue</option>
          <option value="teal">teal</option>
          <option value="rose">rose</option>
        </select>
        <div className="settings-toggle">
          <label htmlFor="homeButtonToggle" className="settings-toggle-label">
            show home button:
          </label>
          <input
            id="homeButtonToggle"
            type="checkbox"
            className="settings-toggle-checkbox"
            checked={showHomeButton}
            onChange={(e) => onHomeButtonToggle(e.target.checked)}
          />
        </div>
        <button id="exportProgress" onClick={onExport}>
          export website data
        </button>
        <button id="importProgress" onClick={onImportClick}>
          import website data
        </button>
      </div>
      <input
        type="file"
        id="importFile"
        accept=".json"
        onChange={(e) => {
          const file = e.currentTarget.files?.[0];
          if (file) onFileImport(file);
          e.currentTarget.value = '';
        }}
        style={{ display: 'none' }}
        suppressHydrationWarning={true}
      />
    </>
  );
}
