# 🌈 The Lost Spectrum

An educational web game that teaches **Python programming** through a fantasy narrative. Players progress through themed Regions and Stages, writing real Python code to solve puzzles involving variables, lists, conditionals, and RGB color theory.

## 🏗️ Architecture

- **Backend**: Python (Flask) — API, authentication, game logic
- **Frontend**: React (Vite) — UI, animations, in-browser Python execution (Skulpt)
- **Database**: PostgreSQL on **Supabase** (Cloud) — via Transaction Pooler

## ⚙️ Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| **Python** | 3.10+ | [python.org](https://www.python.org/downloads/) *(tick "Add to PATH")* |
| **Node.js** | 18+ LTS | [nodejs.org](https://nodejs.org/) |

> **Note:** No local database installation required — the project uses Supabase (Cloud PostgreSQL).

## 🚀 Quick Start (One Click)

Double-click **`start.bat`** in the project root.  
It will start both servers and open the browser automatically.

## 🛠️ Manual Setup

### 1. Backend Setup (First Time)
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Frontend Setup (First Time)
```powershell
cd frontend
npm install
```

### 3. Environment Variables
Create or update `backend/.env` with:
```env
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_DEFAULT_SENDER=your_email@gmail.com
SECRET_KEY=your_secret_key

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your_supabase_anon_key
DATABASE_URL=postgresql://postgres.your-project:your-password@aws-0-region.pooler.supabase.com:6543/postgres
```

### 4. Run Servers

**Terminal 1 — Backend:**
```powershell
cd backend
.\venv\Scripts\activate
python run.py
```
→ Runs on **http://localhost:5000**

**Terminal 2 — Frontend:**
```powershell
cd frontend
npm run dev
```
→ Runs on **http://localhost:5173**

## 🎮 How to Play
Open **http://localhost:5173** in your browser.

## 📂 Project Structure
```
├── backend/                # Flask API server
│   ├── app/
│   │   ├── auth/           # Authentication routes (signup, login, password reset)
│   │   ├── game/           # Game routes (levels, progress)
│   │   ├── main/           # Main routes (root, dashboard)
│   │   ├── db.py           # PostgreSQL/Supabase database connection
│   │   └── __init__.py     # Flask app factory & blueprint registration
│   ├── .env                # Environment variables (not committed)
│   ├── requirements.txt    # Python dependencies
│   └── run.py              # Entry point
├── frontend/               # React SPA (Vite)
│   ├── src/
│   │   ├── pages/          # Page components
│   │   ├── components/     # Reusable UI components
│   │   └── context/        # React Context (auth, game state)
│   └── package.json        # Node.js dependencies
└── start.bat               # One-click launcher (Windows)
```
