# CodeQuest

This project has been refactored into a **Modern Architecture**:
- **Backend**: Python (Flask) - Handles logic, database, and saving progress.
- **Frontend**: React (Vite) - Handles the UI, animations, and user interaction.

## 🚀 How to Run (Requires 2 Terminals)

### 1. Start the Backend (First)
This powers the game logic.
1. Open a terminal.
2. Navigate to the `backend` folder:
   ```powershell
   cd backend
   ```
3. Run the server:
   ```powershell
   python run.py
   ```
   *It runs on http://localhost:5000*

### 2. Start the Frontend
This handles the graphics.
1. Open a **new** terminal (keep the first one running).
2. Navigate to the `frontend` folder:
   ```powershell
   cd frontend
   ```
3. Run the development server:
   ```powershell
   npm run dev
   ```
   *It runs on http://localhost:5173*

## 🎮 How to Play
Open **http://localhost:5173** in your browser.

## 📂 Project Structure
- `backend/` - All Python code (`app.py`, `routes.py`, database).
- `frontend/` - All React code (`src/pages`, `src/components`).
