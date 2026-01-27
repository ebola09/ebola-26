'use client';

const COLORS = {
  orange: { bg: '#0d0502', text: '#E8620E', link: '#913800', hover: '#E8620E', border: '#210D00', overlay: 'rgba(33,13,0,0.75)', bottomBorder: '#913800', opacity: 0.6, svgColor: '#FF6200' },
  purple: { bg: '#0D0012', text: '#A70EE8', link: '#5A077D', hover: '#A70EE8', border: '#310046', overlay: 'rgba(49,0,70,0.75)', bottomBorder: '#5A077D', opacity: 0.6, svgColor: '#A70EE8' },
  green: { bg: '#000D00', text: '#0EE811', link: '#077408', hover: '#0EE811', border: '#004501', overlay: 'rgba(7,116,8,0.75)', bottomBorder: '#077408', opacity: 0.6, svgColor: '#0EE811' },
  teal: { bg: '#00150F', text: '#0EE8CB', link: '#0A836D', hover: '#0EE8CB', border: '#004641', overlay: 'rgba(0,31,33,0.75)', bottomBorder: '#0A836D', opacity: 0.6, svgColor: '#0EE8CB' },
  rose: { bg: '#120011', text: '#E80EB1', link: '#7D0767', hover: '#E80EB1', border: '#46002A', overlay: 'rgba(73,24,65,0.75)', bottomBorder: '#7D0767', opacity: 0.6, svgColor: '#E80EB1' },
  blue: { bg: '#001729', text: '#0055FF', link: '#005394', hover: '#0055FF', border: '#00335C', overlay: 'rgba(0,22,39,0.75)', bottomBorder: '#005394', opacity: 0.6, svgColor: '#0055FF' }
};

export type ThemeName = keyof typeof COLORS;

interface TopbarProps {
  theme: ThemeName;
  onSettingsClick: () => void;
}

export default function Topbar({ theme, onSettingsClick }: TopbarProps) {
  return (
    <div className="topbar">
      <div className="left">
        <a href="/arcade/" className="active">arcade</a>
        <a href="#"></a>
      </div>
      <div className="logo">
        <svg width="251" height="88" viewBox="0 0 251 88" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="filter0_di_36_21" x="172" y="25" width="78.875" height="66.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_36_21" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_36_21" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_36_21" />
            </filter>
            <filter id="filter1_di_36_21" x="146.375" y="0" width="47.75" height="91.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_36_21" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_36_21" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_36_21" />
            </filter>
            <filter id="filter2_di_36_21" x="104" y="25" width="68.5" height="66.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_36_21" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_36_21" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_36_21" />
            </filter>
            <filter id="filter3_di_36_21" x="52" y="0" width="78.875" height="91.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_36_21" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_36_21" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_36_21" />
            </filter>
            <filter id="filter4_di_36_21" x="0" y="25" width="68.5" height="66.5" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dx="6" />
              <feComposite in2="hardAlpha" operator="out" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0" />
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_36_21" />
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_36_21" result="shape" />
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
              <feOffset dy="4" />
              <feGaussianBlur stdDeviation="2" />
              <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
              <feBlend mode="normal" in2="shape" result="effect2_innerShadow_36_21" />
            </filter>
          </defs>
          <g filter="url(#filter0_di_36_21)">
            <path d="M172 75V62.5H182.375V50H213.625V37.5H182.375V25H224.125V37.5H234.5V75H244.875V87.5H224.125V75H213.625V62.5H192.875V75H213.625V87.5H182.375V75H172Z" fill={COLORS[theme].svgColor} />
          </g>
          <g filter="url(#filter1_di_36_21)">
            <path d="M177.625 75H188.125V87.5H146.375V75H156.875V12.5H146.375V0H177.625V75Z" fill={COLORS[theme].svgColor} />
          </g>
          <g filter="url(#filter2_di_36_21)">
            <path d="M104 75V37.5H114.375V25H156.125V37.5H166.5V75H156.125V87.5H114.375V75H104ZM124.875 75H145.625V37.5H124.875V75Z" fill={COLORS[theme].svgColor} />
          </g>
          <g filter="url(#filter3_di_36_21)">
            <path d="M52 87.5V75H62.375V12.5H52V0H83.25V37.5H114.5V50H124.875V75H114.5V87.5H83.25V75H104.125V50H83.25V75H72.875V87.5H52Z" fill={COLORS[theme].svgColor} />
          </g>
          <g filter="url(#filter4_di_36_21)">
            <path d="M0 75V37.5H10.375V25H52.125V37.5H62.5V62.5H20.875V75H52.125V87.5H10.375V75H0ZM20.875 37.5V50H41.625V37.5H20.875Z" fill={COLORS[theme].svgColor} />
          </g>
        </svg>
      </div>
      <div className="right">
        <a id="settingsButton" onClick={onSettingsClick} style={{ cursor: 'pointer' }}>settings</a>
      </div>
    </div>
  );
}
