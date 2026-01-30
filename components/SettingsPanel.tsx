'use client';

interface SettingsPanelProps {
  isOpen: boolean;
  theme: string;
  onThemeChange: (theme: string) => void;
  showHomeButton: boolean;
  onToggleHomeButton: (value: boolean) => void;
  onExport: () => void;
  onImportClick: () => void;
  onFileImport: (file: File) => void;
}

export default function SettingsPanel({
  isOpen,
  theme,
  onThemeChange,
  showHomeButton,
  onToggleHomeButton,
  onExport,
  onImportClick,
  onFileImport,
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
        <label htmlFor="toggleHomeButton" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px' }}>
          <input
            id="toggleHomeButton"
            type="checkbox"
            checked={showHomeButton}
            onChange={(e) => onToggleHomeButton(e.target.checked)}
          />
          toggle home button
        </label>
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
