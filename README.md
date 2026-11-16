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

The React app groups source files by feature. `frontend/src/App.jsx` owns routes;
`frontend/src/features/` contains `auth`, `world`, `gameplay`, `character`,
`stages`, and `dev`. Shared API, context, translations, and styles live under
`frontend/src/shared/`. Existing artwork stays in `frontend/src/assets/` and
`frontend/public/`. Cross-folder imports use the `@/` alias for `frontend/src/`.

The Flask API and Supabase persistence live under `backend/app/`. The playable
stage list is `frontend/src/features/stages/stageData.js`; run
`node scripts/export-game-catalog.mjs` after changing it to regenerate the
backend catalog. See `frontend/README.md` for a folder-by-folder guide.

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
| **Node.js** | 18+ LTS | [nodejs.org](https://nodejs.org/) |

> **Note:** No local database installation required — the project uses **Supabase** (Cloud PostgreSQL).

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

## API documentation

With the servers running, open [Swagger UI](http://localhost:5173/api/docs) to browse the Flask JSON endpoints, request bodies, and responses. The machine-readable OpenAPI document is at `http://localhost:5173/api/openapi.json`. Both URLs also work on the backend's port 5000. Sign in to the game in the same browser before trying endpoints that use the Flask session cookie.

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
