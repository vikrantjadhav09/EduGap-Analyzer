<div align="center">
  <img src="https://img.shields.io/badge/EduGap-Analyzer-blue?style=for-the-badge&logo=google" alt="EduGap Analyzer" />
  <h1>🧠 EduGap Analyzer: AI-Powered Career Roadmapper</h1>
  <p><strong>Bridging the gap between learning and earning with Generative AI.</strong></p>
  
  <p>
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" />
    <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=google&logoColor=white" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black" alt="Firebase" />
  </p>
</div>

<br />

## 🚀 Project Description — Problem It Solves

> Many students possess strong foundational skills but struggle to understand why they aren't getting hired for specific roles. This is due to a "Skill Gap" between traditional academic learning and rapidly evolving industry job descriptions. EduGap Analyzer solves this by using AI to perform a deep-text analysis of a student's resume against live job requirements. It identifies missing technical keywords, suggests relevant projects, and generates a personalized, time-bound learning roadmap. By transforming a generic resume into a targeted career plan, it empowers students to bridge their skill gaps and achieve "Job-Ready" status with precision.

## ✨ Key Features

- **📄 Secure Resume Parsing:** Upload your existing resume (PDF) for immediate processing.
- **🎯 Dynamic Job Analysis:** Paste a target Job Description manually, or fetch one instantly by searching for a specific Role and Company using the integrated AI.
- **🔍 AI-Powered Gap Analysis:** Leverages the Gemini API to pinpoint missing core skills, qualifications, and experience.
- **🗺️ Actionable 7-Day Roadmap:** Generates a strategically structured, day-by-day learning sprint to bridge your technical gaps.
- **🔐 Firebase Auth & Data:** Secure Google Authentication with persistent history across sessions, seamlessly integrated with Firestore.
- **🕒 Progress Tracking:** Save your generated roadmaps, view past records, and continuously tailor your profile to evolving job market demands.

## 🛠️ Technology Stack

| Category         | Technology / Library |
| :---             | :---                 |
| **Frontend**     | [React 19](https://react.dev/), TypeScript, [Vite](https://vitejs.dev/), [Tailwind CSS v4](https://tailwindcss.com/) |
| **Backend**      | Node.js, Express, `multer` (in-memory file handling), `pdf-parse` |
| **AI Engine**    | `@google/genai` (Google Gemini-3-Flash API) |
| **Database**     | Firebase Firestore |
| **Auth**         | Firebase Authentication (Google Provider) |
| **UI Utilities** | Framer Motion, Recharts, Lucide React, Sonner |

## ⚙️ Prerequisites

Before running the application locally, ensure you have the following installed:

- **[Node.js](https://nodejs.org/)** (v18 or higher recommended)
- **`npm`** (Node Package Manager)
- A **Google Gemini API Key** (Obtain one from [Google AI Studio](https://aistudio.google.com/))
- A **Firebase Project** for Authentication and Firestore.

## 🚀 Getting Started

Follow these steps to run the application locally on your machine.

### 1. Install Dependencies
Clone the repository and install all required Node modules.

```bash
npm install
```

### 2. Set up Environment Variables
Create a `.env` (or `.env.local`) file in the root directory. Add your Gemini API key:

```env
GEMINI_API_KEY="your_gemini_api_key_here"
```

*(Note: If available, you can copy the `.env.example` directly for a reference of all variables).*

### 3. Run the Development Server
This single command runs both the Express backend API and the Vite React frontend using `tsx` and Vite's proxy middleware.

```bash
npm run dev
```

### 4. Visit the Application
Once both servers are running, open your web browser and navigate to:

```text
http://localhost:3000
```

## 📜 Available NPM Scripts

- `npm run dev` — Starts the combined development server (`tsx server.ts`).
- `npm run build` — Compiles and bundles the production-ready frontend via Vite.
- `npm run preview` — Previews the built production site locally.
- `npm run lint` — Runs TypeScript validation checks (`tsc --noEmit`).
- `npm run clean` — Removes the `dist/` directory.

## 🗄️ Project Architecture

1. **Authentication:** managed entirely via Firebase OAuth (Google).
2. **File Processing:** Frontend uploads PDF to `/api/parse-pdf` -> Express backend holds it with Multer -> parses text using `pdf-parse` -> responds with pure text.
3. **AI Generation:** The frontend orchestrates the extracted Resume content and the JD via `@google/genai` to generate parsed matches, gap maps, and the complete 7-day roadmap.
4. **Data Persistence:** Roadmaps and insights are stored inside Firebase Firestore `users/{uid}/analyses`.

## 📄 License

This project is open source and available under the **Apache 2.0 License**.
