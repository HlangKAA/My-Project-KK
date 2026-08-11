# 🌈 The Lost Spectrum — Project Status

> **Last Updated:** 2026-08-11  
> **Analysis Method:** Full codebase audit (every source file read)

---

## 1. Project Overview

**The Lost Spectrum** is an educational web game that teaches **Python programming** through a fantasy narrative set in a magical world of lost color. Players (wizards) progress through themed **Regions** and **Stages**, writing real Python code to solve puzzles involving variables, lists, conditionals, and RGB color theory.

The application wraps Python concepts in a **Computer Vision / color-spectrum** storyline: players restore shattered color channels by writing code that manipulates RGB values, searches arrays, and applies conditional logic — all executed in the browser via the Skulpt interpreter.

---

## 2. Architecture & Tech Stack

### Frontend

| Layer | Technology | Version / Notes |
|---|---|---|
| **Framework** | React | 19.2.0 |
| **Build Tool** | Vite | 7.2.4 (`@vitejs/plugin-react` 5.1.1) |
| **Routing** | react-router-dom | 7.13.0 |
| **HTTP Client** | Axios | 1.13.4 |
| **Python Runtime** | Skulpt | 1.2.0 (loaded via CDN in `index.html`) |
| **Icons** | Font Awesome | 6.4.0 (CDN) |
| **Styling** | Vanilla CSS | Per-page CSS files (no Tailwind, no CSS-in-JS) |
| **Linting** | ESLint | 9.39.1 + `eslint-plugin-react-hooks` |

### Backend

| Layer | Technology | Version / Notes |
|---|---|---|
| **Framework** | Flask | 3.0.0 |
| **Architecture** | Flask Blueprints | 3 blueprints: `auth`, `main`, `game` |
| **Database** | PostgreSQL (Supabase Cloud) | via `psycopg2-binary` + `supabase` Python SDK, Transaction Pooler |
| **Auth** | Session-based | `werkzeug.security` password hashing (pbkdf2:sha256) |
| **Email** | Flask-Mail | Gmail SMTP (TLS) |
| **CORS** | Flask-CORS | 4.0.0 — allows `localhost:5173`/`5174` |
| **Env Config** | python-dotenv | 1.0.0 |
| **Tunnel (dev)** | ngrok | Binary present in `backend/` |

### DevOps / Tooling

- `start.bat` — One-click launcher that starts Flask (`:5000`), Vite (`:5173`), and opens the browser.
- Vite dev proxy forwards `/api`, `/levels`, `/complete_level` to Flask.
- Production build (`dist/`) directory exists in the frontend.

---

## 3. Currently Implemented Features

### 3.1 Frontend

#### Pages & Routing (8 routes)

| Route | Page Component | Auth Required | Status |
|---|---|---|---|
| `/` | `Home` | No | ✅ Landing page with "Enter the Realm" CTA |
| `/login` | `Login` | No | ✅ Email + password, calls `POST /api/login` |
| `/register` | `Register` | No | ✅ Name + email + password, calls `POST /api/signup` |
| `/forgot-password` | `ForgotPassword` | No | ✅ Calls `POST /api/forgot-password` |
| `/reset-password/:token` | `ResetPassword` | No | ✅ Calls `POST /api/reset-password` |
| `/dashboard` | `Dashboard` | **Yes** | ✅ Region map with lock/unlock/complete states |
| `/region/:regionId` | `RegionMap` | **Yes** | ✅ Stage timeline with status per stage |
| `/region/:regionId/stage/:stageId` | `StagePage` | **Yes** | ✅ Full game IDE (see below) |

- **`ProtectedRoute`** wrapper redirects unauthenticated users to `/login`.
- Legacy route `/game/:levelId` redirects to `/dashboard`.

#### Core Game UI (`StagePage`)

- **Story Intro Phase** — NPC dialog system with typewriter effect, speaker labels, emotion tags, skip button, and an animated "Enter the Tower" transition. Currently implemented for Stage 1-1 (`Eldrin` NPC).
- **IDE Phase** — Split-panel layout:
  - **Left: Scene Panel** — Animated wizard character with three visual states (`idle`, `casting`, `success`), magic ring + orbiting runes, particle effects, RGB color swatch display, matrix/array visualization (Stage 2-1), and an objective banner.
  - **Right: Code Panel** — Python code textarea with line numbers, tab switching (`spell_cast.py` / `readme.md`), and a system console with output log and error display.
- **Bottom Bar** — `RESET` and `RUN SPELL CODE` buttons.
- **Grimoire Modal** — Multi-page book overlay with left/right pages, code examples, "Common Incantations" lists, color wheel visualization, and page navigation.
- **Level Complete Screen** — Shows chapter info, XP badge, mastery badge, skills grid with progress bars, and Replay / Continue buttons.

#### Legacy Game Page (`GamePage`)

- An older, simpler version of the game page (located at `GamePage.jsx`, 497 lines). It is **not actively routed** (the `/game/:levelId` route now redirects to `/dashboard`) but still exists in the codebase with its own inline `LEVEL_DATA`.

#### Skulpt Integration (`usePythonInterpreter` hook)

- Configures and runs Skulpt with `execLimit: 5000` (infinite-loop protection).
- Injects a custom **`hero` module** into the Skulpt runtime with the following API methods:
  - `hero.cast_color(r, g, b)` — Sets an RGB color visual.
  - `hero.move_to_x(x)` — Moves hero to index position.
  - `hero.scan_light()` — Reads light value (callback stub).
  - `hero.collect_fragment()` — Collects a fragment (callback stub).
  - `hero.avoid_shadow()` — Avoids shadow (callback stub).
  - `hero.say(msg)` — Logs a message (callback stub).
- Maps Skulpt errors to wizard-themed hints (`SyntaxError`, `NameError`, `IndentationError`, `TypeError`).

#### Game Data (`stageData.js`)

| Region | ID | Stages | Python Concepts |
|---|---|---|---|
| The Red Forest | 1 | 2 stages | `print()`, f-strings, variables, RGB `cast_color` |
| Ash Peaks | 2 | 1 stage | Lists, `.index()`, searching |
| Whispering Caverns | 3 | 1 stage | Conditionals, color mixing (White = RGB 255,255,255) |

Each stage includes: `title`, `chapter`, `location`, `objective`, `initialCode`, `hint`, `completeMessage`, `validateOutput` callback (or null for hero-callback validation), `grimoire` pages, and `skills` array.

#### State Management (`GameContext`)

- React Context providing: `user`, `loading`, `login()`, `logout()`, `updateProgress()`, `updateStageProgress()`.
- Session check on mount via `GET /api/user`.
- **Client-side only** stage progress tracking (`user.stageProgress` = `{ regionId: completedStageCount }`). Progress is **not persisted** to the backend via the new region/stage API.

#### UI Assets

- **Images:** `bg-auth.png`, `region-red-forest.png`, `region-ash-peaks.png`, `region-whispering-caverns.png`.
- **Sounds:** Directory exists but is empty (no audio files).
- **Fonts:** Directory exists for custom fonts.

---

### 3.2 Backend

#### API Endpoints (Auth Blueprint)

| Method | Route | Description | Status |
|---|---|---|---|
| `POST` | `/api/signup` | Register user (name, email, password) | ✅ Hashes password, stores in PostgreSQL (Supabase), sends verification email |
| `POST` | `/api/login` | Login (email, password) | ✅ Verifies hash, sets session (`player_id`, `username`, `email`) |
| `POST` | `/api/logout` | Clears session | ✅ |
| `GET` | `/api/user` | Returns current session user | ✅ |
| `POST` | `/api/forgot-password` | Generates reset token, sends email | ✅ |
| `POST` | `/api/reset-password` | Validates token + updates password | ✅ |
| `GET` | `/verify-email/<token>` | Verifies email via token | ✅ Renders server-side HTML result |
| `POST` | `/resend-verification` | Resends verification email | ✅ |

> **Note:** Email verification check on login is **commented out** (lines 421-428 of `auth/routes.py`), so unverified users can currently log in.

#### API Endpoints (Game Blueprint)

| Method | Route | Description | Status |
|---|---|---|---|
| `GET` | `/levels` | Renders Jinja2 level select page | ✅ (Legacy — not used by React frontend) |
| `GET` | `/game/<int:level_id>` | Returns level data as JSON | ✅ (Legacy — uses old 3-level `levels.py` data) |
| `POST` | `/complete_level` | Saves level completion to `game_progress` table | ✅ (Legacy — not called by the new React StagePage) |

#### API Endpoints (Main Blueprint)

| Method | Route | Description | Status |
|---|---|---|---|
| `GET` | `/` | API root JSON | ✅ |
| `GET` | `/dashboard` | Session-gated dashboard data | ✅ (Legacy — for Jinja2 template) |

#### Database Schema (PostgreSQL on Supabase)

**`players` table:**

| Column | Type | Usage |
|---|---|---|
| `player_id` | SERIAL PRIMARY KEY | Auto-incrementing primary key |
| `username` | VARCHAR(100) UNIQUE | Unique username |
| `email` | VARCHAR(255) UNIQUE | Unique email |
| `password` | VARCHAR(255) | Hashed password (pbkdf2:sha256) |
| `date_joined` | TIMESTAMPTZ | Account creation timestamp |
| `last_login` | TIMESTAMPTZ | Last login timestamp |
| `is_verified` | BOOLEAN | Email verification status |
| `verification_token` | VARCHAR(255) | Email verification token |
| `token_expiry` | TIMESTAMPTZ | Verification token expiry |
| `reset_token` | VARCHAR(255) | Password reset token |
| `reset_token_expiry` | TIMESTAMPTZ | Reset token expiry |

**`game_progress` table:**

| Column | Type | Usage |
|---|---|---|
| `progress_id` | SERIAL PRIMARY KEY | Auto-incrementing primary key |
| `player_id` | INT (FK → players) | Foreign key to players |
| `current_level` | INT | Highest unlocked level |
| `last_played` | TIMESTAMPTZ | Last played timestamp |

**`player_stats` table:**

| Column | Type | Usage |
|---|---|---|
| `stat_id` | SERIAL PRIMARY KEY | Auto-incrementing primary key |
| `player_id` | INT (FK → players) | Foreign key to players |
| `current_level` | INT | Current level |
| `last_played` | TIMESTAMPTZ | Last played timestamp |

> ✅ Database is hosted on **Supabase Cloud** (PostgreSQL) connected via **Transaction Pooler** for IPv4 compatibility. Tables are created via migration scripts run through `psycopg2`.

#### Email System

- **Verification emails** and **password reset emails** are fully implemented with styled HTML templates.
- Configured via Gmail SMTP with app-specific password in `.env`.

#### Server-Side Templates (Legacy Jinja2)

- `auth/`: `login.html`, `signup.html`, `forgot_password.html`, `reset_password.html`, `verification_result.html`
- `game/`: `game.html`, `levels.html`
- `main/`: `dashboard.html`

These are **legacy templates** from before the React frontend was built. They are no longer actively used for the main user flow but remain in the codebase.

---

## 4. Missing Features & Limitations

### 🔴 Critical Gaps

| # | Issue | Details |
|---|---|---|
| 1 | **No backend API for stage progress** | The React frontend tracks region/stage progress **only in client memory** (`GameContext`). There is no `POST /api/complete-stage` endpoint. Progress is lost on page refresh or logout. |
| 2 | **Legacy vs. New data mismatch** | The backend `levels.py` has 3 flat levels, while the frontend `stageData.js` uses a region→stage hierarchy. They are completely out of sync. |
| 3 | **~~No SQL schema/migration files~~** | ✅ **Resolved** — Tables (`players`, `game_progress`, `player_stats`) are now created on Supabase Cloud via automated migration scripts. |
| 4 | **`.env` file committed to Git** | Contains actual credentials (SMTP password, Supabase keys, secret key). This is a **security risk**. |
| 5 | **No `axios` base URL configured** | The `api/axios.js` module creates an Axios instance but doesn't set a `baseURL`. The `GameContext` creates a **separate** Axios instance. Two Axios instances exist with different configurations. |

### 🟡 Missing Features

| # | Feature | Details |
|---|---|---|
| 6 | **Admin Dashboard** | No admin panel, user management, or analytics interface exists. |
| 7 | **XP / Scoring system** | XP values (`+450`) are hardcoded in UI text. No actual XP calculation, storage, or leaderboard exists. |
| 8 | **Inventory system** | "Inventory" button exists in navbar but is non-functional (no route, no data). |
| 9 | **Journal / Settings pages** | "JOURNAL" and "SETTINGS" buttons in the Dashboard navbar are non-functional. |
| 10 | **Sound / Music** | `assets/sounds/` directory is empty. Volume button in game UI is non-functional. |
| 11 | **Skulpt validation for `hero` callbacks** | Stages 1-2, 2-1, and 3-1 use `validateOutput: null` and rely on hero callbacks — but validation is hardcoded by `stageKey` in `StagePage.jsx`, not generalized. |
| 12 | **Stage 1-1 output validation race condition** | `StagePage` validates output in both a `setTimeout(500ms)` and a `useEffect` on `output` — redundant logic that may cause double-completion triggers. |
| 13 | **`GamePage.jsx` is dead code** | The old `GamePage` (497 lines) is imported nowhere and has no active route. It should be removed or archived. |
| 14 | **`routes_append.py` is dead code** | Contains a duplicate `complete_level` function that references a non-existent `player_stats` table. It is not imported anywhere. |
| 15 | **`GameVisualizer.jsx` is unused** | The component exists but is never imported by any page. `StagePage` renders visuals inline. |
| 16 | **`CodeEditor.jsx` is unused** | The component exists but is never imported. `StagePage` renders its own textarea. |
| 17 | **No code syntax highlighting** | The code editor is a plain `<textarea>` with monospace font — no syntax highlighting (e.g., no CodeMirror or Monaco). |
| 18 | **Limited content** | Only 3 regions with 4 total stages (1-1, 1-2, 2-1, 3-1). The game is a prototype with minimal content breadth. |

---

## 5. Next Steps (Sprint Backlog)

### 🏆 Priority 1 — Persist Stage Progress (Critical)

**Build a `POST /api/complete-stage` endpoint** and update `GameContext` to call it on stage completion. Without this, all player progress is ephemeral.

- Create a `stage_progress` table: `(player_id, region_id, stage_id, completed_at)`.
- Add a `GET /api/progress` endpoint to load saved progress on login.
- Update `GameContext.updateStageProgress()` to POST to the backend.
- Load saved progress in the session check (`GET /api/user` or new endpoint).

---

### 🏆 Priority 2 — Database Schema & Migrations ✅ (Partially Done)

~~**Create a `schema.sql` file** (or adopt Flask-Migrate/Alembic) that codifies the full database schema.~~

- ✅ Database migrated from MySQL to **Supabase (PostgreSQL Cloud)**.
- ✅ Tables `players`, `game_progress`, `player_stats` created on Supabase.
- ⬜ Remove `.env` from version control and add it to `.gitignore`. Replace with `.env.example`.

---

### 🏆 Priority 3 — Remove Dead Code & Consolidate

Clean up legacy artifacts to reduce confusion:

- Delete or archive `GamePage.jsx`, `GameVisualizer.jsx`, `CodeEditor.jsx` (unused components).
- Delete `routes_append.py` (duplicate dead code).
- Consolidate the two Axios instances (`api/axios.js` and `GameContext`'s inline instance) into one.
- Remove legacy Jinja2 templates if the React SPA is the sole frontend.
- Sync or remove the backend `levels.py` data (it's superseded by `stageData.js`).

---

### 🏆 Priority 4 — Upgrade the Code Editor

Replace the plain `<textarea>` with a proper code editor library:

- **CodeMirror 6** or **Monaco Editor** for syntax highlighting, auto-indentation, and bracket matching.
- This is a high-impact UX improvement for an educational coding game.

---

### 🏆 Priority 5 — Expand Game Content

Add more stages and regions to deliver a meaningful learning experience:

- Region 1 needs more stages (loops, functions).
- Region 2 and 3 each have only 1 stage — add at least 2-3 per region.
- Add NPC story intros to stages beyond 1-1.
- Implement the `hero.scan_light()` / `hero.collect_fragment()` / `hero.avoid_shadow()` callbacks for new thresholding/conditional stages.

---

> *This document was auto-generated from a complete audit of every source file in the repository. No features were assumed or hallucinated — every item is backed by explicit code evidence.*
