# Project Status

## 🌟 Project Overview & Tech Stack
This project, formerly referenced as "CodeQuest" and connecting to a database named "lost_spectrum", is an educational coding game with a modern web architecture. It separates the backend logic and the frontend presentation.

**Backend Tech Stack:**
- **Language/Framework:** Python 3 with Flask (3.0.0)
- **Database Connector:** mysql-connector-python (8.2.0) for MySQL
- **Other Libraries:** Flask-CORS (Cross-Origin Resource Sharing), Flask-Mail (Email setup via SMTP), python-dotenv (Environment variables), Werkzeug

**Frontend Tech Stack:**
- **Framework/Build Tool:** React (19.2.0) with Vite (7.2.4)
- **Routing:** react-router-dom (7.13.0)
- **HTTP Client:** Axios (1.13.4)
- **Styling:** Vanilla CSS (App.css, index.css, and component-specific CSS)

---

## 🛠️ Current Progress (Backend)
The backend uses a modular **Blueprint architecture** with organized routes:
- **`auth` Blueprint:** Handles user authentication, login, and registration.
- **`game` Blueprint:** Contains logic for validating user code against specific game levels (`levels.py`, `routes.py`).
- **`main` Blueprint:** General purpose or index routes.

**Configurations & Connections:**
- **Database:** Fully set up in `app/db.py` to connect to a MySQL database named `lost_spectrum`.
- **CORS:** Enabled globally in `__init__.py` to accept requests from `http://localhost:5173` and `http://localhost:5174`.
- **Email:** `Flask-Mail` configured to use Gmail SMTP, credentials loaded from `.env`.
- **Ngrok:** `ngrok.exe` is present in the `backend/` folder, indicating support for exposing the local Flask server to the public internet.

---

## 🎨 Current Progress (Frontend)
The frontend is a robust Single Page Application (SPA) structured with React.

**Routing & State Management:**
- **Routing (`App.jsx`):** Defined routes include Home (`/`), Login (`/login`), Register (`/register`), Dashboard (`/dashboard`), and Game (`/game/:levelId`).
- **Protected Routes:** A `ProtectedRoute` wrapper is implemented to prevent unauthorized access to the Dashboard and Game pages.
- **State Management:** Uses React Context API (`GameContext.jsx`) to provide global states like `user` and `loading` status across the app.

**Key Components & Pages:**
- **Pages (`src/pages/`):** Dashboard, GamePage, Home, Login, and Register are built with their respective CSS files.
- **Components (`src/components/`):** Dedicated UI pieces include `CodeEditor.jsx`, `GameVisualizer.jsx`, `Grimoire.jsx`, and `LevelComplete.jsx`.

---

## 📝 TODOs / Next Steps
Based on an analysis of the codebase, here are the outstanding items and next features to tackle:

**Backend & Game Logic:**
- **Level Design Completion (`backend/app/game/levels.py`):**
  - Implement the fix for color intensity: `# TODO: Set red_intensity to 255 to restore the color`
  - Implement array index validation: `# TODO: Access the value at Index 2`
  - Implement conditional validation: `# TODO: Write an if-statement`
- **Template Security (`backend/app/templates/game/game.html`):**
  - Address the comment at line 362: `<!-- TODO: Escape properly for textarea -->` to prevent XSS or layout breaking.

**General Next Steps:**
- Finish defining the level challenges in the backend and ensure the `CodeEditor` successfully validates them.
- Thoroughly test the protected routes and context logic on the frontend to ensure smooth user sessions.
