# Zyra — AI-Powered Personalized News Platform

Zyra is a **full-stack AI-powered news application** that delivers personalized, context-aware news experiences using **semantic search, AI summarization, and modern mobile UI**.  
It is built with **React Native (Expo)** on the frontend and **FastAPI + PostgreSQL (pgvector)** on the backend.

This project demonstrates **production-ready architecture**, **async backend design**, and **applied AI (RAG-style retrieval)**.

---

## 🚀 Features

### 📱 Mobile Application
- Cross-platform app (Android & iOS) using **React Native (Expo)**
- Modern UI with **NativeWind (Tailwind-style styling)**
- Dark / light mode (system-based)
- Tab-based navigation (Home, Topics, Saved, Profile)
- Offline-first experience with local caching
- Save / unsave articles
- Pull-to-refresh news feed


<img width="401" height="1282" alt="ChatGPT Image Jan 7, 2026, 03_04_08 AM" src="https://github.com/user-attachments/assets/cab66659-c84b-43be-9d94-7d03b72f199d" />
<img width="424" height="1336" alt="summaries ai" src="https://github.com/user-attachments/assets/934ee0f7-d39d-46ae-9565-89818a84bdc3" />



### 🧠 AI Capabilities
- **Semantic search** using vector embeddings (Sentence Transformers)
- AI-powered **context-aware summarization**
- RAG-style pipeline (retrieve → summarize)
- Supports natural-language queries over news content

### 📰 News Pipeline
- Automated **RSS ingestion** from multiple global sources
- Duplicate detection and de-duplication
- Article content extraction (HTML parsing)
- Category inference (rule-based NLP)
- Image extraction with multiple fallbacks
- Vector embedding generation at ingestion time

### 🔐 Authentication & Security
- JWT-based authentication
- Secure password hashing using bcrypt
- Protected routes with token validation
- CORS-enabled API for mobile clients

---

## 🏗️ Tech Stack

### Frontend
- **React Native (Expo)**
- **Expo Router**
- **NativeWind**
- AsyncStorage
- Axios

### Backend
- **FastAPI**
- **PostgreSQL**
- **pgvector**
- **SQLAlchemy (Async)**
- JWT Authentication
- FastAPI Security (HTTPBearer)

### AI / ML
- Sentence Transformers (`all-MiniLM-L6-v2`)
- Vector similarity search
- Extractive summarization (extensible to LLMs)

---

## 📐 System Architecture (High-Level)



---

## 🧪 API Endpoints (Overview)

| Method | Endpoint | Description |
|------|---------|------------|
| GET | `/health` | Health check |
| POST | `/auth/register` | User registration |
| POST | `/auth/login` | User login |
| GET | `/news` | Fetch latest news |
| POST | `/ai` | AI-powered question answering |
| POST | `/user/preferences` | Save user interests |

---

## ⚙️ Setup & Installation

### Backend

## Create a .env file:

DATABASE_URL=postgresql+asyncpg://user:password@host:5432/dbname
JWT_SECRET=your-secret-key
OPENAI_API_KEY=optional

 ```bash
 git clone https://github.com/mdShakil2004/Zyra-AI-powered-news-platform.git
 cd zyra/server
 python -m venv venv
 source venv/bin/activate   # Windows: venv\Scripts\activate
 pip install -r requirements.txt

```

## Run the server:
uvicorn main:app --reload

#$ News Ingestion
python scripts/ingest_news.py

## Frontend
cd app
npm install
npx expo start

## 🧠 Design Decisions

- **Async-first backend** to efficiently handle high I/O workloads  
- **Vector search over keyword search** for improved semantic relevance  
- **Embeddings generated at ingestion time** to minimize query latency  
- **Modular architecture** for better maintainability and scalability  
- **Offline-first mobile UX** to support real-world usage scenarios  

---

## 📈 Future Enhancements

- LLM-based **abstractive summarization**
- **User-specific feed ranking** based on preferences
- **Chat history persistence**
- **Background task scheduling** (Celery / worker-based jobs)
- **Push notifications**
- **Premium subscription features**

---

## 🎯 Why This Project Matters

This project demonstrates:

- Real-world **system design**
- **Applied AI** beyond basic tutorials
- Secure **authentication flows**
- **Scalable backend** architecture patterns
- **Production-grade mobile UI**
- Industry-level engineering practices used in modern **SaaS** and **AI-driven** products

---

## 👨‍💻 Author

**Md Shakil**  
Software Engineer | Backend & AI Systems  

📧 Email: **iam.shakil.dev@gmail.com**  
🔗 LinkedIn: [https://linkedin.com/in/mdshakil2004](https://linkedin.com/in/mdshakil2004)



---

### ✅ This README is:

- ATS-safe  
- Recruiter-friendly  
- Interview-ready  
- GitHub-professional  

If you want, next I can:
- Optimize this README for **GitHub stars**
- Add **screenshots section**
- Write a **case-study style README**
- Rewrite for **FAANG-style portfolio**

Just tell me 👍


