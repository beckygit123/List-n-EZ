# Listi'n'EZ 🛍️

Your AI assistant for reselling success! Listi'n'EZ helps with product descriptions, pricing strategies, customer service, and SEO optimization.
 
## ⚠️ Important Note on Documentation
 
This project contains two setup guides: `README.md` (this file) and `INSTALLATION_GUIDE.md`.
 
-   **`README.md` (This file):** Contains the correct and simple instructions to run the AI Chat and Workspace application. **Please follow these instructions.**
-   **`INSTALLATION_GUIDE.md`:** Describes a much larger setup for tools that are listed in the "Workspace" tab but are **not yet integrated** into the application. **You should ignore this file.**
 
---
 
## 🚀 Simplified Setup (Recommended)
 
### Step 1: First-Time Setup (Do this only once)
 
1.  **Install Ollama & Create Agent:**
    -   Install Ollama from: https://ollama.ai/download
    -   From the project's root directory (`AI-Listynz'EZ/`), run this command in your terminal:
        ```bash
        ollama create listinez -f agent/Modelfile
        ```
 
2.  **Install Project Dependencies:**
    -   From the project's root directory, run:
        ```bash
        npm install
        ```
    -   *(This single command installs all dependencies for both the backend server and the frontend app).*
 
### Step 2: Running the App (Do this every time)
 
1.  **Start Ollama:** Make sure the Ollama application is running in the background.
2.  **Start Both Servers:** From the project's root directory, run:
    ```bash
    npm run dev
    ```
    -   *(This single command starts the backend on `http://localhost:3000` and the frontend on `http://localhost:5173`)*.
 
### Step 3: Open Your Browser
 
-   Visit: **http://localhost:5173**
 
---
 
## 🛠️ Manual Setup (Alternative)
 
Use this method if you prefer to run the backend and frontend in separate terminals.
 
1.  **Start Ollama:** Make sure the Ollama application is running.
2.  **Start Backend:** Open a terminal, navigate to the `server` directory, and run `npm start`.
3.  **Start Frontend:** Open a *second* terminal, navigate to the `app` directory, and run `npm run dev`.
 
## 📁 Project Structure
 
```
AI-Listynz'EZ/
├── agent/
│   └── Modelfile          # AI configuration
├── server/
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express API server
└── app/
    ├── package.json       # Frontend dependencies
    ├── index.html         # Main HTML file
    ├── vite.config.js     # Vite configuration
    └── src/
        ├── main.jsx       # React entry point
        ├── App.jsx        # Main app component
        └── Chat.jsx       # Chat interface
```

## 💡 Example Questions to Ask

- "What's a good pricing strategy for electronics on eBay?"

## 🆘 Troubleshooting

- Make sure Ollama is running: `ollama serve` or by opening the desktop app.
- Check that the agent is created: `ollama list` (should show `listinez`).
- Ensure you are in the correct directory when running commands. The `npm run dev` command should be run from the root `AI-Listynz'EZ` folder.