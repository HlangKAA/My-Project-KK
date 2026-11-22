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
| 🗺️ **Region & Stage System** | Multi-region world map with progressive difficulty |
| 📖 **Grimoire (Spell Book)** | In-game reference guide for Python concepts |
| 🏆 **Level Completion** | Track progress and unlock new stages |
| 🔐 **Authentication** | Full user system with signup, login, email verification |
| 🔑 **Password Recovery** | Forgot password & reset via email |
| 📊 **Dashboard** | View progress, stats, and game history |
| 🎨 **Themed Regions** | Red Forest, Whispering Caverns, Ash Peaks, and more |
| 🖥️ **Code Editor** | Built-in code editor with syntax highlighting |

## 🏗️ Architecture

```text
My-Project-KK/
├── backend/                       Flask API and database persistence
│   ├── app/
│   │   ├── auth/                  Login, email, profile and account routes
│   │   ├── game/                  Progress, submissions and leaderboard
│   │   ├── main/                  API root and Swagger routes
│   │   └── templates/             Active verification and Swagger pages
│   ├── seed_game_catalog.sql      Generated stage data, not schema setup
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── App.jsx                Client routes and compatibility redirects
│   │   ├── features/
│   │   │   ├── auth/              Account screens
│   │   │   ├── world/             Dashboard, map and onboarding story
│   │   │   ├── gameplay/          Stage screen, story, puzzles and arena
│   │   │   ├── stages/            Playable catalog and lesson content
│   │   │   └── character/         Profile, XP display and sprites
│   │   ├── shared/                API client, session and translations
│   │   └── assets/                Bundled artwork
│   └── public/                    Character sprite sheets and static assets
├── scripts/export-game-catalog.mjs Frontend-to-backend catalog exporter
├── start.bat                       Starts configured local servers
└── README.md
```

The playable stage list is `REGIONS` in `frontend/src/features/stages/stageData.js`.
After changing stages, run `node scripts/export-game-catalog.mjs` from the
repository root. Saved stage keys, submissions and progress must be preserved.
The exporter does not update the live database.

See [frontend/README.md](frontend/README.md) and [backend/README.md](backend/README.md)
for feature and route maps. Old URLs remain as redirects; the old Flask pages
and level definitions are no longer part of the game.

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
| **Python** | 3.10+ | [python.org](https://www.python.org/downloads/) *(tick "Add to PATH")* |
| **Node.js** | 22.12+ or 20.19+ | [nodejs.org](https://nodejs.org/) |

> **Note:** The project uses **Supabase** (Cloud PostgreSQL). A new database needs the current schema before loading `backend/seed_game_catalog.sql`; that seed file does not create tables.

## 🚀 Getting Started

### Quick Start (One Click)
Double-click **`start.bat`** in the project root — it will start both servers and open the browser automatically.

### Manual Setup

#### 1. Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

#### 2. Frontend Setup
```powershell
cd frontend
npm install
```

#### 3. Environment Variables
Create `backend/.env` with:
```env
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
SECRET_KEY=your_secret_key
DATABASE_URL=your_supabase_connection_string
```

#### 4. Run the Application
```powershell
# Backend
cd backend && python run.py

# Frontend (new terminal)
cd frontend && npm run dev
```

## 🎮 How to Play

1. **Create an account** and verify your email
2. **Explore the world map** — choose a region to begin
3. **Select a stage** — each stage teaches a specific Python concept
4. **Read the challenge** and use the **Grimoire** for hints
5. **Write Python code** in the built-in editor
6. **Run your code** — see visual results in real-time
7. **Complete the level** and unlock the next stage!

## 📄 License

This project is for educational purposes.

---

<div align="center">

**Made with ❤️ — Learn Python, Save the Spectrum!**

</div>
