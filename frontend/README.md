# The Lost Spectrum frontend

The React and Vite app is organized by game feature:

| Folder | Contents |
| --- | --- |
| `src/features/auth/` | Login, registration, password recovery, and their UI |
| `src/features/world/` | Dashboard, map, story scenes, and walkthrough |
| `src/features/gameplay/` | Stage screen, puzzles, spellbook, editor, and arena |
| `src/features/character/` | Profile and character progression |
| `src/features/stages/` | Playable stage data and supporting content |
| `src/shared/` | API client, game context, translations, and shared styles |
| `src/assets/` and `public/` | Artwork and other static assets |

`src/App.jsx` owns routes. Import across folders with `@/`; use relative imports within a folder. The alias is configured in `vite.config.js` and `jsconfig.json`.

The playable stage list is in `src/features/stages/stageData.js`. After changing stages, run `node scripts/export-game-catalog.mjs` from the repository root. Do not edit generated backend catalog files by hand.

Run `npm.cmd run test`, `npm.cmd run lint`, and `npm.cmd run build` here to verify frontend changes on Windows.

## Where to find a feature

| Task | Source of truth |
| --- | --- |
| Add or reorder a playable stage | `src/features/stages/stageData.js` (`REGIONS`); implementation in the chapter module |
| Change stage story or scene | `src/features/stages/stageStories.js` and `src/features/gameplay/StageStoryIntro.jsx` |
| Change stage code execution | `src/features/gameplay/StagePage.jsx` and `usePythonInterpreter.js` |
| Change guided, debug, or puzzle views | `src/features/gameplay/StageTypeContent.jsx` and the corresponding stage component |
| Change arena movement or visuals | `src/features/gameplay/CodeCombatArena/` |
| Change progress shown to players | `src/shared/context/GameContext.jsx`, then backend `app/game/progress.py` |
| Change Thai text | `src/features/stages/stageThai.js` and stage-specific Thai content in `src/features/stages/` |
| Change the world map | `src/features/world/Dashboard.jsx` and `RegionMap.jsx` |

Stage keys in saved progress are stable identifiers. The UI may show a different display number. Keep `REGIONS` and the backend catalog in sync through the exporter.
