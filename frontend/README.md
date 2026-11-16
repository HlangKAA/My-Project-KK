# The Lost Spectrum frontend

The React and Vite app is organized by game feature:

| Folder | Contents |
| --- | --- |
| `src/features/auth/` | Login, registration, password recovery, and their UI |
| `src/features/world/` | Dashboard, map, story scenes, and walkthrough |
| `src/features/gameplay/` | Stage screen, puzzles, spellbook, editor, and arena |
| `src/features/character/` | Profile and character progression |
| `src/features/stages/` | Playable stage data and supporting content |
| `src/features/dev/` | Character and sprite demo routes |
| `src/shared/` | API client, game context, translations, and shared styles |
| `src/assets/` and `public/` | Artwork and other static assets |

`src/App.jsx` owns routes. Import across folders with `@/`; use relative imports within a folder. The alias is configured in `vite.config.js` and `jsconfig.json`.

The playable stage list is in `src/features/stages/stageData.js`. After changing stages, run `node scripts/export-game-catalog.mjs` from the repository root. Do not edit generated backend catalog files by hand.

Run `npm.cmd run lint` and `npm.cmd run build` here to verify frontend changes on Windows.
