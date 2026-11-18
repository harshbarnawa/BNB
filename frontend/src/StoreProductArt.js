import { useId, useState } from 'react';

export function StoreProductArt({ product }) {
  const uid = useId().replace(/:/g, '');
  const gradient = 'metal-' + uid;
  const screen = 'screen-' + uid;
  const dark = '#1c2925';
  const mint = '#16b98a';
  const art = product.art || 'gpu';

  return (
    <div className={'shop-art shop-art-' + (product.tone || 'stone')}>
      <svg viewBox="0 0 400 300" role="img" aria-label={product.name + ' concept illustration'} preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id={gradient} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#dce4df" />
            <stop offset=".48" stopColor="#919f98" />
            <stop offset="1" stopColor="#36453e" />
          </linearGradient>
          <linearGradient id={screen} x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="#142e36" />
            <stop offset=".65" stopColor="#227e74" />
            <stop offset="1" stopColor="#94dfb6" />
          </linearGradient>
          <filter id={'shadow-' + uid} x="-40%" y="-40%" width="180%" height="200%">
            <feGaussianBlur stdDeviation="9" />
          </filter>
        </defs>
        <ellipse cx="204" cy="251" rx="136" ry="21" fill="#172d261e" />
        {art === 'keyboard' && (
          <g transform="translate(38 85) rotate(-8 160 78)">
            <rect x="4" y="16" width="320" height="147" rx="13" fill="#0a1714" opacity=".2" />
            <rect width="320" height="144" rx="12" fill="#263530" stroke="#586960" strokeWidth="3" />
            <rect x="8" y="8" width="304" height="127" rx="7" fill="#17231f" />
            {Array.from({ length: 5 }, (_, row) => Array.from({ length: row === 4 ? 11 : 14 }, (_, key) => (
              <rect key={row + '-' + key} x={15 + key * 21} y={16 + row * 24} width={row === 4 && key === 5 ? 43 : 17} height="18" rx="3" fill={(row + key) % 13 === 0 ? '#19b78b' : (row + key) % 7 === 0 ? '#a7b6ac' : '#46584e'} stroke="#111c17" strokeWidth="1.5" />
            )))}
          </g>
        )}
        {art === 'mouse' && (
          <g transform="rotate(-15 202 148)">
            <ellipse cx="204" cy="236" rx="84" ry="20" fill="#1c30252b" />
            <path d="M130 166 C129 85 153 48 200 45 C249 42 275 92 276 166 C276 217 247 239 202 240 C151 238 130 213 130 166 Z" fill={'url(#' + gradient + ')'} stroke="#2e3e37" strokeWidth="5" />
            <path d="M200 48 L200 131" stroke="#253d32" strokeWidth="5" />
            <rect x="195" y="83" width="11" height="30" rx="5" fill={mint} />
            <path d="M135 166 C158 187 247 187 273 164" stroke="#d5e3d9" strokeWidth="4" fill="none" opacity=".65" />
          </g>
        )}
        {art === 'monitor' && (
          <g>
            <rect x="47" y="37" width="306" height="199" rx="12" fill="#202a29" />
            <rect x="55" y="44" width="290" height="177" rx="5" fill={'url(#' + screen + ')'} />
            <path d="M55 179 C114 126 156 172 198 127 C233 92 263 114 345 62 L345 221 L55 221 Z" fill="#65ceaa" opacity=".62" />
            <path d="M55 173 C151 85 182 119 234 87 C271 65 312 76 345 53" fill="none" stroke="#d3f9e4" strokeWidth="4" opacity=".55" />
            <rect x="188" y="236" width="24" height="20" fill="#536059" />
            <path d="M147 265 L253 265 L222 255 L178 255 Z" fill="#425148" />
          </g>
        )}
        {art === 'headphones' && (
          <g>
            <path d="M112 160 L112 139 C112 42 281 41 281 141 L281 166" stroke="#212d28" strokeWidth="32" fill="none" strokeLinecap="round" />
            <path d="M125 137 C130 46 268 45 268 137" stroke="#9faf9f" strokeWidth="12" fill="none" strokeLinecap="round" />
            <rect x="91" y="145" width="65" height="100" rx="26" fill="#1d2c26" />
            <rect x="238" y="145" width="65" height="100" rx="26" fill="#1d2c26" />
            <rect x="111" y="163" width="45" height="70" rx="20" fill="#5c7467" />
            <rect x="238" y="163" width="45" height="70" rx="20" fill="#5c7467" />
            <path d="M118 188 L119 208 M276 186 L275 211" stroke={mint} strokeWidth="5" strokeLinecap="round" />
          </g>
        )}
        {art === 'ssd' && (
          <g transform="translate(56 114) rotate(-10 142 55)">
            <rect x="6" y="9" width="304" height="97" rx="7" fill="#192721" opacity=".2" />
            <rect width="304" height="91" rx="7" fill="#1a2924" stroke="#526a5d" strokeWidth="3" />
            <rect x="21" y="18" width="130" height="53" rx="4" fill="#263c33" />
            <text x="34" y="46" fontFamily="Arial,sans-serif" fontSize="22" fontWeight="800" fill="#d6e5db">PULSE</text>
            <text x="36" y="61" fontFamily="Arial,sans-serif" fontSize="9" fill="#18b888">1TB NVMe / CONCEPT</text>
            <rect x="177" y="18" width="49" height="53" rx="2" fill="#111c17" stroke="#435c4a" />
            <rect x="237" y="18" width="49" height="53" rx="2" fill="#111c17" stroke="#435c4a" />
            {Array.from({ length: 13 }, (_, i) => <rect key={i} x={13 + i * 12} y="86" width="8" height="7" fill="#bda764" />)}
            <circle cx="292" cy="44" r="8" fill="#8ea495" />
          </g>
        )}
        {art === 'gpu' && (
          <g transform="translate(40 78) rotate(-7 160 88)">
            <rect x="10" y="20" width="322" height="153" rx="12" fill="#16211b" opacity=".15" />
            <rect x="0" y="7" width="320" height="148" rx="12" fill="#25342d" stroke="#66796e" strokeWidth="3" />
            <rect x="11" y="18" width="300" height="126" rx="7" fill="#18251f" />
            {[94, 227].map(x => <g key={x}>
              <circle cx={x} cy="81" r="55" fill="#526557" />
              <circle cx={x} cy="81" r="48" fill="#1b2b21" stroke="#96aa99" strokeWidth="2" />
              {Array.from({ length: 8 }, (_, i) => <path key={i} d={'M' + x + ' 81 l8 -39 q24 13 17 36 Z'} transform={'rotate(' + (i * 45) + ' ' + x + ' 81)'} fill="#718679" />)}
              <circle cx={x} cy="81" r="12" fill="#1d3327" stroke="#1ab88e" strokeWidth="3" />
            </g>)}
            {Array.from({ length: 16 }, (_, i) => <rect key={i} x={69 + i * 12} y="151" width="7" height="8" fill="#cfbb75" />)}
          </g>
        )}
        {art === 'laptop' && (
          <g>
            <rect x="67" y="40" width="270" height="184" rx="13" fill="#2d3e35" stroke="#667d6e" strokeWidth="4" />
            <rect x="75" y="48" width="254" height="167" rx="4" fill={'url(#' + screen + ')'} />
            <path d="M75 176 C151 124 191 136 236 86 C265 57 299 76 329 50 L329 215 L75 215Z" fill="#64d8aa" opacity=".64" />
            <path d="M39 230 L365 230 L339 254 L64 254 Z" fill={'url(#' + gradient + ')'} stroke="#67786e" strokeWidth="2" />
            <rect x="153" y="231" width="98" height="6" rx="3" fill="#60776a" />
          </g>
        )}
        {art === 'mic' && (
          <g>
            <rect x="151" y="31" width="101" height="159" rx="50" fill="#1b2b27" stroke="#5d7167" strokeWidth="4" />
            <rect x="164" y="48" width="74" height="113" rx="37" fill="#34493d" />
            {Array.from({ length: 8 }, (_, i) => <path key={i} d={'M171 ' + (65 + i * 12) + ' L231 ' + (65 + i * 12)} stroke="#658074" strokeWidth="3" />)}
            <path d="M127 131 V167 Q127 225 204 225 Q279 225 279 167 V131" fill="none" stroke="#24342c" strokeWidth="13" strokeLinecap="round" />
            <rect x="196" y="223" width="16" height="28" fill="#223b30" />
            <path d="M143 260 H261" stroke="#26372e" strokeWidth="13" strokeLinecap="round" />
            <circle cx="202" cy="178" r="5" fill="#16b98a" />
          </g>
        )}
        {art === 'deskmat' && (
          <g transform="rotate(-11 202 143)">
            <rect x="48" y="85" width="313" height="151" rx="16" fill="#1d2a25" opacity=".15" />
            <rect x="42" y="76" width="313" height="151" rx="16" fill="#304b3e" stroke="#5c8870" strokeWidth="3" />
            <path d="M46 181 C136 125 183 193 256 137 C293 112 325 143 353 112" stroke="#6a9a80" strokeWidth="4" fill="none" opacity=".66" />
            <rect x="98" y="94" width="175" height="79" rx="8" fill="#1c2c23" />
            {Array.from({ length: 4 }, (_, row) => Array.from({ length: 9 }, (_, col) => <rect key={row + '-' + col} x={108 + col * 17} y={103 + row * 16} width="13" height="12" rx="2" fill={row === 0 && col === 2 ? mint : '#506a58'} />))}
            <ellipse cx="310" cy="178" rx="21" ry="30" fill="#c1d4c6" />
          </g>
        )}
        {(art === 'tower' || art === 'pc') && (
          <g transform={art === 'pc' ? 'translate(-14 -6)' : ''}>
            <rect x="126" y="29" width="166" height="240" rx="12" fill="#1a2420" stroke="#65756b" strokeWidth="4" />
            <rect x="137" y="40" width="116" height="216" rx="5" fill="#2a3e34" stroke="#3b5e4c" />
            {[100, 172].map(y => <g key={y}>
              <circle cx="190" cy={y} r="35" fill="#12221a" stroke="#1ab88c" strokeWidth="5" />
              <circle cx="190" cy={y} r="23" fill="#406b57" />
              <circle cx="190" cy={y} r="10" fill="#b3e3c1" />
            </g>)}
            <rect x="260" y="43" width="21" height="209" rx="3" fill="#111e17" />
            <circle cx="269" cy="61" r="4" fill={mint} />
            {art === 'pc' && <g>
              <rect x="294" y="77" width="81" height="145" rx="6" fill="#1e2e28" stroke="#507963" strokeWidth="3" />
              <rect x="303" y="87" width="62" height="93" rx="2" fill={'url(#' + screen + ')'} />
              <rect x="331" y="222" width="8" height="16" fill="#66796e" />
              <path d="M306 241 H364" stroke="#43554b" strokeWidth="7" strokeLinecap="round" />
            </g>}
          </g>
        )}
        {art === 'cpu' && (
          <g transform="rotate(-14 200 145)">
            <rect x="112" y="61" width="184" height="184" rx="13" fill="#1b352d" stroke="#b3a874" strokeWidth="8" />
            <rect x="143" y="92" width="122" height="122" rx="8" fill={'url(#' + gradient + ')'} />
            <text x="165" y="148" fill="#16251d" fontFamily="Arial" fontWeight="900" fontSize="24">CORE</text>
            <text x="167" y="175" fill="#294b3e" fontFamily="Arial" fontWeight="700" fontSize="11">PERFORMANCE</text>
            {Array.from({ length: 12 }, (_, i) => <g key={i}>
              <path d={'M' + (119 + i * 14) + ' 61 v-17 M' + (119 + i * 14) + ' 245 v18'} stroke="#b4a979" strokeWidth="6" />
              <path d={'M112 ' + (67 + i * 14) + ' h-17 M296 ' + (67 + i * 14) + ' h17'} stroke="#b4a979" strokeWidth="6" />
            </g>)}
          </g>
        )}
      </svg>
    </div>
  );
}

export function StoreProductImage({ product }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (!product.imageUrl || imageFailed) return <StoreProductArt product={product} />;

  return (
    <div className="shop-art shop-art-photo">
      <img
        src={product.imageUrl}
        alt={product.name}
        loading="lazy"
        decoding="async"
        onError={() => setImageFailed(true)}
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
