# EcoRanger: Wild Rescue — TypeScript

Permainan pendidikan SDG 15 (Hidupan di Darat), dalam Bahasa Melayu.
Ditukar daripada satu fail HTML besar kepada projek **Vite + TypeScript** bermodul.

## Jalankan
```bash
npm install
npm run dev       # pelayan pembangunan (HMR) → http://localhost:5173
npm run build     # taip-semak (tsc) + bina produksi ke dist/
npm run typecheck # tsc --noEmit sahaja
npm run preview   # pratonton hasil binaan
```

## Struktur `src/`
| Fail | Tanggungjawab |
|------|----------------|
| `types.ts` | Semua antara muka (Species, Stage, Item, Scenario, SaveData, ...) |
| `data.ts`  | Data permainan: STAGES (kuiz), EXTRA/MYSTERY (haiwan), SCENARIOS, ITEMS (kedai), RANKS, ACH, RARITY + pembina CATALOG |
| `state.ts` | Simpanan pemain (`save`), localStorage, kutipan koleksi |
| `audio.ts` | Kesan bunyi sintetik + bunyi haiwan sebenar (Wikimedia) |
| `game.ts`  | Enjin kanvas (teroka), UI semua skrin, kuiz, babak, kedai, koleksi, 2 mini-game (Teka/Dengar) |
| `main.ts`  | Titik masuk |

`index.html` menyimpan markup statik semua skrin; `game.ts` mendedahkan handler ke `window` untuk `onclick`.
