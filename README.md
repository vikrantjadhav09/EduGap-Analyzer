<div align="center">

# 🧠 EduGap Analyzer  
### *AI-Powered Career Roadmapper*

**Bridging the gap between learning and earning using Generative AI**

[![Live Demo](https://img.shields.io/badge/🚀_Live-Demo-green?style=for-the-badge)](https://edugap-analyzer.onrender.com/)

<br/>

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)  
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)  
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)  
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)  
![Gemini AI](https://img.shields.io/badge/Google_Gemini-8E75B2?style=flat-square&logo=google&logoColor=white)  
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)  

</div>

---

## 🚀 Live Application

👉 **Access the app here:**  
🔗 https://edugap-analyzer.onrender.com/

---

## 📌 Overview

EduGap Analyzer is an AI-powered platform that helps students and job seekers identify the gap between their current skills and industry job requirements.

It analyzes resumes against real job descriptions and generates a **personalized roadmap** to become job-ready.

---

## ❗ Problem Statement

Many students struggle to get hired despite having strong academic knowledge.

### Why?
- Lack of alignment with job descriptions  
- Missing industry-relevant skills  
- No clear learning roadmap  

---

## 💡 Solution

EduGap Analyzer solves this using AI by:

- 📄 Analyzing resumes  
- 🎯 Matching them with job descriptions  
- 🔍 Identifying missing skills  
- 🗺️ Generating a **7-day actionable roadmap**  

---

## ✨ Key Features

- 📄 **Resume Parsing (PDF Upload)**  
- 🎯 **Dynamic Job Description Analysis**  
- 🔍 **AI-Based Skill Gap Detection**  
- 🗺️ **Personalized 7-Day Learning Roadmap**  
- 🔐 **Google Authentication (Firebase)**  
- 🕒 **Progress Tracking & History Saving**  

---

## 🛠️ Tech Stack

### Frontend
- React 19  
- TypeScript  
- Vite  
- Tailwind CSS  

### Backend
- Node.js  
- Express  
- Multer  
- pdf-parse  

### AI Engine
- Google Gemini API (`@google/genai`)  

### Database & Auth
- Firebase Firestore  
- Firebase Authentication  

### UI & Utilities
- Framer Motion  
- Recharts  
- Lucide React  
- Sonner  

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd edugap-analyzer

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Setup Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

### 4️⃣ Run the Application

```bash
npm run dev
```

---

### 5️⃣ Open in Browser

```bash
http://localhost:3000
```

---

## 📜 Available Scripts

| Command           | Description               |
| ----------------- | ------------------------- |
| `npm run dev`     | Start development server  |
| `npm run build`   | Build production frontend |
| `npm run preview` | Preview production build  |
| `npm run lint`    | TypeScript checks         |
| `npm run clean`   | Remove build files        |

---

## 🏗️ Project Architecture

### 🔐 Authentication

* Firebase Google OAuth

### 📄 File Processing

* Resume → Upload → Express → pdf-parse → Extracted text

### 🤖 AI Processing

* Resume + Job Description → Gemini API → Insights + Roadmap

### 🗄️ Database

* Firestore → `users/{uid}/analyses`

---

## 📈 Future Improvements

* 📊 Skill score visualization
* 📚 Recommended courses integration
* 🧑‍💼 Multi-role comparison
* 📱 Mobile responsiveness enhancements

---

## 📄 License

Licensed under the **Apache 2.0 License**

---

## 🙌 Final Note

EduGap Analyzer is designed to **turn confusion into clarity** by giving users a precise roadmap to success in their career journey.

---

```
```
