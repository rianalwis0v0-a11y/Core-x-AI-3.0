
---

# Core X AI v3.0

**Core X AI v3.0** is an intelligent AI assistant powered by machine learning and deep learning. It provides a chat interface for asking questions, solving problems, or just having a conversation.  

This repository contains both the **server** (backend) and **client** (frontend) for Core X AI.

---

## **Features**

- Chat with Core X AI in real-time
- Login / Registration system
- Clear chat conversations
- Typing indicator for AI responses
- Fully responsive frontend
- Theming support (light/dark)
- Easy setup for local development

---

## **Folder Structure**

CoreX-AI/ │ ├─ server/        # Node.js/Express backend │   ├─ index.ts │   ├─ ai.ts │   ├─ routes/ │   └─ ... │ ├─ client/        # React frontend (Vite + TypeScript) │   ├─ src/ │   │   ├─ pages/chat.tsx │   │   ├─ components/ │   │   └─ lib/ │   └─ ... │ └─ README.md

---

## **Requirements**

- Node.js (v18+ recommended)
- npm
- Optional: Git (if cloning instead of downloading ZIP)

---

## **Installation / Setup**

### **Option 1: Download ZIP**
1. Go to the GitHub repo → Click **Code → Download ZIP**  
2. Extract the ZIP file on your PC

### **Option 2: Clone repo**
```bash
git clone https://github.com/YourUsername/CoreX-AI.git
cd CoreX-AI


---

Install Dependencies

Server

cd server
npm install

Client

cd ../client
npm install


---

Running Locally

Start the server

cd server
npm run dev

Server will run on http://localhost:5000


Start the frontend

cd ../client
npm run dev

Frontend will run on http://localhost:5173 (Vite default port)


> Open this URL in your browser to start chatting with Core X AI




---

Usage

1. Open frontend URL in a browser


2. Log in or create an account


3. Type a message in the chat input and press Enter or click Send


4. Core X AI will reply in real-time




---

Clear Chat

Click the trash icon in the header to clear the current conversation



---

Optional: Run Server & Client Together

You can run both in a single terminal using:

npm --prefix server run dev & npm --prefix client run dev


---

Tech Stack

Server: Node.js, Express, TypeScript

Client: React, Vite, TypeScript, React Query

AI: Custom Core X AI backend with ML/Deep Learning

UI: TailwindCSS, Lucide Icons



---

License

This project is for personal/educational use. Feel free to modify and expand!

---

You can now **copy the entire block** and save it as `README.md` in your repo.  

