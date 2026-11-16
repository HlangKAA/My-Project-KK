# The Lost Spectrum

An educational web game where players learn Python by restoring color to a fantasy world. A young adventurer carries a grimoire through four chapters to recover the colors stolen by Krakk, Summus Magus Monotoniae.

## Gameplay and features

- Write Python and watch the character move, cast spells, and restore color in an animated arena.
- Learn variables, types, conditionals, loops, functions, lists, and introductory image-processing concepts through RGB puzzles.
- Use stage instructions, the spells popup, the reference spellbook, and the beginner walkthrough for guidance.
- Switch between English and Thai from the world map; chapter and stage names remain in English.
- Register, verify an email address, sign in, recover a password, and manage a profile.
- Save submissions and progress, earn XP, and unlock six achievement definitions.
- View a leaderboard ranked by saved XP. Players must clear at least one playable stage; the first seven ranks receive rainbow highlights. Replaying a completed stage does not award leaderboard XP again.
- Complete the final boss stage against a time limit.

The current catalog contains **25 playable stages**:

| Chapter | Region | Stages |
| --- | --- | --- |
| 1 | The Red Forest | 7 |
| 2 | The Scholar's Archive | 8 |
| 3 | Whispering Caverns | 5 |
| 4 | Ash Peaks | 5 |

`REGIONS` in `frontend/src/features/stages/stageData.js` defines the playable stages. Internal stage keys can have gaps to preserve saved progress; displayed numbers follow the playable order.

## Architecture

| Layer | Implementation |
| --- | --- |
| Interface | React 19, Vite 7, React Router, custom CSS |
| Python execution | Skulpt 1.2 in the browser |
| API | Flask with session cookies; Axios uses the Vite `/api` proxy during development |
| Persistence | PostgreSQL on Supabase, accessed by the backend through psycopg2 |
| Authentication | Application-owned player records and Flask sessions, not Supabase Auth |
| Email | Flask-Mail using Gmail SMTP with TLS |
| API reference | Swagger UI and an OpenAPI document |

The browser executes Python and checks the stage outcome. It submits the code, result, and attempt information to Flask. The backend validates the submission payload and updates progress, XP, and achievements; it does not independently execute the Python to prove the submitted result.

```text
frontend/
  src/App.jsx              Application routes
  src/features/            Auth, world, gameplay, character, and stage content
  src/shared/              API client, context, translations, and styles
  src/assets/              Bundled artwork
  public/                  Static assets and character sprites
backend/
  app/auth/                Accounts, verification, and password recovery
  app/game/                Progress, submissions, leaderboard, and catalog
  app/main/                API root and documentation routes
  app/api_docs.py          OpenAPI definitions
  app/db.py                Database connections
  run.py                   Local Flask development entry point
  seed_game_catalog.sql    Generated stage and achievement data
scripts/
  export-game-catalog.mjs  Generates the backend catalog and seed SQL
start.bat                  Windows launcher after setup
```

See [frontend/README.md](frontend/README.md) for the frontend layout. Optional local tools under `frontend/src/features/dev/` are ignored by Git and absent from fresh clones.

## Local setup (Windows PowerShell)

### 1. Prerequisites and source

- Git.
- Python. The current local backend has been checked with Python 3.13.7.
- Node.js 22.12 or newer. The installed Vite package supports `^20.19.0 || >=22.12.0`; Node 18 is not supported.
- A PostgreSQL/Supabase database with the game's current schema (see below).
- A Gmail account configured to send verification and password-reset emails.
- Internet access for the database, email, and CDN-hosted Skulpt, icons, and Swagger UI resources.

Clone the branch containing these changes:

```powershell
git clone --branch side_0-1 https://github.com/HlangKAA/My-Project-KK.git
cd My-Project-KK
```

### 2. Install dependencies

From the repository root (virtual environment activation is unnecessary):

```powershell
python -m venv backend/venv
.\backend\venv\Scripts\python.exe -m pip install -r backend/requirements.txt
cd frontend
npm.cmd ci
cd ..
```

### 3. Configure the backend

Create `backend/.env` locally with your own values:

```dotenv
SECRET_KEY=replace-with-a-long-random-secret
DATABASE_URL=postgresql://YOUR_DB_USER:YOUR_URL_ENCODED_PASSWORD@YOUR_DB_HOST:5432/postgres?sslmode=require
FRONTEND_URL=http://localhost:5173
MAIL_USERNAME=your-sender@gmail.com
MAIL_PASSWORD=your-google-app-password
MAIL_DEFAULT_SENDER=your-sender@gmail.com
```

Generate a session secret with `python -c "import secrets; print(secrets.token_hex(32))"` and put the output in `SECRET_KEY`.

Get the PostgreSQL connection string from your Supabase project's **Connect** dialog. Choose a connection suitable for your network; the session pooler supports IPv4 when direct connections are unavailable. Replace the password placeholder and URL-encode special characters in credentials. See [Supabase's connection guide](https://supabase.com/docs/guides/database/connecting-to-postgres).

The current game routes use `DATABASE_URL` directly. `SUPABASE_DB_URL` is accepted as a fallback. `SUPABASE_URL` and `SUPABASE_KEY` initialize an optional SDK client in `app/db.py`, but are not required for normal game routes when `DATABASE_URL` is configured. No Supabase key belongs in the frontend.

Email uses `smtp.gmail.com`, port 587, and TLS. Use a Google app password rather than your normal password. App passwords require 2-Step Verification and may be unavailable on some organization accounts. See [Google's instructions](https://support.google.com/accounts/answer/185833).

Keep `.env` private. It is excluded by `.gitignore`; never copy real credentials into source or documentation.

### 4. Prepare the database

**The repository does not currently contain a complete schema bootstrap or full migration history for an empty database.** Obtain a current schema-only export or complete setup migrations from the maintainer before setting up your own empty database. Do not copy real player data just to create a development instance.

The backend expects tables including `players`, `levels`, `game_progress`, `player_stats`, `code_submissions`, `game_logs`, `achievements`, and `player_achievements`, with their required columns and constraints. `game_progress.level_id` and `player_stats.level_id` reference the next unfinished playable stage, or are null when all stages are complete. Old `current_level` columns are not compatible with the current progress code.

After installing the matching schema, apply `backend/seed_game_catalog.sql` to populate/update the 25 playable stages and six achievement definitions. This file changes data; it does not create tables. It preserves existing level IDs and does not delete retired stage history.

`backend/migrate_onboarding.sql` adds onboarding state to an existing schema. `backend/migrate_stage_sequence.sql` is a targeted upgrade for the original 29-stage catalog, not a fresh-install script. Check the database and each script's preconditions before applying historical migrations.

### 5. Start the game

Backend terminal, from the repository root:

```powershell
cd backend
.\venv\Scripts\python.exe run.py
```

Frontend terminal, from the repository root:

```powershell
cd frontend
npm.cmd run dev
```

Open **http://localhost:5173**. The backend runs at **http://localhost:5000**.

After installing dependencies, configuring the environment, and preparing the database, you can instead double-click `start.bat`. It launches the servers and browser; it does not install dependencies or initialize the database. Close the two server windows to stop them.

Keep `FRONTEND_URL` aligned with the frontend address: password-reset links and verification-page return links use it. Verification email links use the backend request host. Links containing `localhost` work only on the computer running the servers.

These are development instructions. `run.py` enables Flask debug mode, and the Vite proxy is for development. Production hosting requires a production server, HTTPS, session configuration, and routing `/api` to Flask.

## Playing and checking the API

1. Register and open the verification email. Check Spam/Junk if it is missing; login offers resend for an unverified account.
2. Sign in and follow the story introduction and map walkthrough.
3. Select a chapter and stage, read the spells popup, and inspect the starter code.
4. Edit and run the Python. Consult the spellbook when needed.
5. Complete the objective and let the result save before continuing. Revisit completed stages to practice.

Open [Swagger UI](http://localhost:5173/api/docs) with both servers running. The OpenAPI JSON is at [api/openapi.json](http://localhost:5173/api/openapi.json). Both paths also work on backend port 5000. Sign in on the same origin before trying endpoints that require a session; for local testing, use the frontend port for both login and Swagger.

Key endpoints include `GET /api/progress`, `POST /api/submissions`, `GET /api/leaderboard`, and `GET /api/profile/history`. Progress includes `level_id`, completed stages/regions, saved XP, unlocked achievements, and an achievement catalog with completion counts.

## Maintaining and verifying the game

After changing playable stages, run from the repository root:

```powershell
node scripts/export-game-catalog.mjs
```

This regenerates `backend/app/game/catalog.json` and `backend/seed_game_catalog.sql`; do not edit them by hand. It does not update the live database. Apply the reviewed seed SQL separately to the intended database, preserving player submissions and stable level IDs.

Verification commands, starting from the repository root:

```powershell
.\backend\venv\Scripts\python.exe -m compileall -q backend/app
cd frontend
npm.cmd run lint
npm.cmd run build
cd ..
git diff --check
```

`.gitignore` excludes credentials, virtual environments, Node dependencies, builds, caches, local agent/triage files, diagrams/documents, and optional development tools. It does not remove already tracked files; review `git status` and `git diff --cached` before committing.

## Project use

This is an educational project. No standalone license file is currently included in the repository.
