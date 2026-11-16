<div align="center">

# 🌈 The Lost Spectrum

**An educational web game teaching Python programming through a fantasy narrative**

Write real Python code to restore color to a grayscale world!

[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

---

## 📋 Overview

**The Lost Spectrum** is an ongoing educational web game that teaches **Python programming** and **computer vision concepts** through an immersive fantasy narrative. Players progress through themed **Regions** and **Stages**, writing real Python code to solve puzzles involving variables, lists, conditionals, and RGB color theory — bridging learning and creative problem-solving.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎮 **Interactive Gameplay** | Write real Python code to solve puzzles and progress |
| 🐍 **In-Browser Python** | Execute Python code directly in the browser using Skulpt |
| 🗺️ **Region & Stage System** | 25 playable stages across four chapters (7 / 8 / 5 / 5) |
| 📖 **Grimoire (Spell Book)** | In-game reference guide for Python concepts |
| 🏆 **Level Completion** | Track progress and unlock new stages |
| 🔐 **Authentication** | Full user system with signup, login, email verification |
| 🔑 **Password Recovery** | Forgot password & reset via email |
| 📊 **Dashboard** | View progress, stats, and game history |
| 🎨 **Themed Regions** | The Red Forest, The Scholar's Archive, Whispering Caverns, and Ash Peaks |
| 🖥️ **Code Editor** | Built-in code editor with syntax highlighting |
| **Language Toggle** | English and Thai UI; chapter and stage names remain in English |
| **Saved XP & Leaderboard** | Requires at least one cleared stage; top seven ranks use rainbow highlights; no repeat-stage XP |
| **Achievements** | Six achievement definitions with server-saved unlocks |
| **Guidance & Story** | Beginner walkthrough, stage spells popup, NPC scenes, and a timed final boss |

## 🏗️ Architecture

The React app groups source files by feature. `frontend/src/App.jsx` owns routes;
`frontend/src/features/` contains `auth`, `world`, `gameplay`, `character`,
`stages`. Optional local tools in `dev` are ignored by Git. Shared API, context, translations, and styles live under
`frontend/src/shared/`. Existing artwork stays in `frontend/src/assets/` and
`frontend/public/`. Cross-folder imports use the `@/` alias for `frontend/src/`.

The Flask API and Supabase persistence live under `backend/app/`. The playable
stage list is `frontend/src/features/stages/stageData.js`; run
`node scripts/export-game-catalog.mjs` after changing it to regenerate the
backend catalog and seed SQL. Apply the reviewed seed SQL separately to update the database.
See [frontend/README.md](frontend/README.md) for a folder-by-folder guide.

The browser executes Python and checks stage outcomes; Flask validates submission
payloads and saves progress, XP, and achievements. It does not independently
execute the submitted Python. Authentication uses Flask sessions and application-owned
player records, not Supabase Auth.

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Backend** | Python, Flask |
| **Frontend** | React, Vite |
| **Python in Browser** | Skulpt (in-browser Python interpreter) |
| **Database** | PostgreSQL on Supabase (Cloud) |
| **Authentication** | Flask sessions, email verification |
| **Styling** | Custom CSS with animations |
| **HTTP Client** | Axios |

## ⚙️ Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| **Python** | Tested locally with 3.13.7 | [python.org](https://www.python.org/downloads/) *(tick "Add to PATH")* |
| **Node.js** | 22.12+ (Vite also supports 20.19+) | [nodejs.org](https://nodejs.org/) |

> **Note:** No local database installation required — the project uses **Supabase** (Cloud PostgreSQL). You need a database with the current game schema, Gmail SMTP credentials, Git, and internet access for cloud services and CDN resources.

## 🚀 Getting Started

### Quick Start (One Click)
After completing dependency, environment, and database setup below, double-click **`start.bat`** in the project root — it will start both servers and open the browser automatically.

The launcher does not install dependencies or create database tables.

### Manual Setup

Clone the branch containing this version:

```powershell
git clone --branch side_0-1 https://github.com/HlangKAA/My-Project-KK.git
cd My-Project-KK
```

#### 1. Backend Setup

From the repository root:

```powershell
python -m venv backend/venv
.\backend\venv\Scripts\python.exe -m pip install -r backend/requirements.txt
```

#### 2. Frontend Setup

```powershell
cd frontend
npm.cmd ci
cd ..
```

#### 3. Environment Variables

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

#### 4. Database Setup

**The repository does not currently contain a complete schema bootstrap or full migration history for an empty database.** Obtain a current schema-only export or complete setup migrations from the maintainer before setting up your own empty database. Do not copy real player data just to create a development instance.

The backend expects tables including `players`, `levels`, `game_progress`, `player_stats`, `code_submissions`, `game_logs`, `achievements`, and `player_achievements`, with their required columns and constraints. `game_progress.level_id` and `player_stats.level_id` reference the next unfinished playable stage, or are null when all stages are complete. Old `current_level` columns are not compatible with the current progress code.

After installing the matching schema, apply `backend/seed_game_catalog.sql` to populate/update the 25 playable stages and six achievement definitions. This file changes data; it does not create tables. It preserves existing level IDs and does not delete retired stage history.

`backend/migrate_onboarding.sql` adds onboarding state to an existing schema. `backend/migrate_stage_sequence.sql` is a targeted upgrade for the original 29-stage catalog, not a fresh-install script. Check the database and each script's preconditions before applying historical migrations.

#### 5. Run the Application

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

## API documentation

With the servers running, open [Swagger UI](http://localhost:5173/api/docs) to browse the Flask JSON endpoints, request bodies, and responses. The machine-readable OpenAPI document is at `http://localhost:5173/api/openapi.json`. Both URLs also work on the backend's port 5000. Sign in to the game on the same origin before trying endpoints that use the Flask session cookie. For local testing, use port 5173 for both login and Swagger.

## 🎮 How to Play

1. **Create an account** and verify your email
2. **Explore the world map** — choose a region to begin
3. **Select a stage** — each stage teaches a specific Python concept
4. **Read the challenge** and use the **Grimoire** for hints
5. **Write Python code** in the built-in editor
6. **Run your code** — see visual results in real-time
7. **Complete the level** and unlock the next stage!

## 📄 License

This project is for educational purposes. No standalone license file is currently included in the repository.

---

<div align="center">

**Made with ❤️ — Learn Python, Save the Spectrum!**

</div>
