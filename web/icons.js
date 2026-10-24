// Original LeverMeme line icons. Fixed paths only; never inject user SVG/URLs.
const paths={
 arrowUpRight:'<path d="M6 18 18 6M6 6h12v12"/>',
 arrowRight:'<path d="M4 12h15m-6-6 6 6-6 6"/>',
 arrowLeft:'<path d="M20 12H5m6-6-6 6 6 6"/>',
 arrowDown:'<path d="M12 4v16m-6-6 6 6 6-6"/>',
 arrowUp:'<path d="M12 20V4m-6 6 6-6 6 6"/>',
 trendUp:'<path d="m3 17 6-6 4 4 8-10m-7 0h7v7"/>',
 trendDown:'<path d="m3 7 6 6 4-4 8 10m-7 0h7v-7"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 grid:'<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
 plus:'<path d="M12 5v14M5 12h14"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 close:'<path d="m6 6 12 12M6 18 18 6"/>',
 shield:'<path d="m12 3 8 3v6c0 4-5 7-8 9-3-2-8-5-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
 burn:'<path d="M13 3c1 5-4 6-3 10-2-1-3-3-3-3-2 3-3 5-2 8 2 5 12 5 14-1 1-5-3-8-6-14Z"/><path d="M12 15c-3 3-1 6 1 5 2-1 2-3-1-5Z"/>',
 split:'<path d="M4 12h7m-1 0 5-6h5m-10 6 5 6h5m-3-15 3 3-3 3m0 6 3 3-3 3"/>',
 wallet:'<rect x="3" y="6" width="18" height="15" rx="3"/><path d="M4 6V4h14v2m-2 5h5v5h-5z"/>',
 layers:'<path d="m12 3 10 6-10 6L2 9l10-6Zm-9 11 9 5 9-5M3 18l9 5 9-5"/>',
 coin:'<circle cx="12" cy="12" r="9"/><path d="M9 7v10h7M9 12h5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.1"/>'
};
export function icon(name){
 if(!Object.hasOwn(paths,name))throw new Error('Unknown interface icon.');
 return `<svg class="ui-icon" data-icon="${name}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${paths[name]}</svg>`;
}
export function leverageArtwork(){
 return `<svg class="leverage-art" viewBox="0 0 400 210" role="img" aria-label="Isolated leverage up to ten times, with defined market limits"><g fill="none" stroke="currentColor"><path opacity=".12" d="M25 40h350M25 85h350M25 130h350M25 175h350M60 20v170M130 20v170M200 20v170M270 20v170M340 20v170"/><path opacity=".4" d="m80 124 110-66 110 66-110 65-110-65Zm0-18 110-65 110 65-110 65-110-65Zm0-18 110-65 110 65-110 65-110-65Z"/><path d="m104 96 86-50 86 50-86 50-86-50Z" stroke-width="1.5"/><path d="M190 146v43m-86-93v28m172-28v28" opacity=".6"/><path d="m285 68 48-28m-17-4 17 4-5 17" stroke-width="2"/></g><text x="190" y="108" text-anchor="middle" fill="currentColor" font-family="sans-serif" font-size="44" font-weight="600" letter-spacing="-2">10×</text><text x="20" y="204" fill="currentColor" opacity=".6" font-family="monospace" font-size="9" letter-spacing="2">ISOLATED EXPOSURE / DEFINED LIMITS</text></svg>`;
}
