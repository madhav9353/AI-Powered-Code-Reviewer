# AI-Powered Code Reviewer

Full-stack app that sends source code to Google's Gemini API and returns a structured review: bugs, optimizations, best practices, an improved version, and a quality score. Every submission and its review is stored in MySQL so you can revisit it.

**Tech stack:** React.js (Vite), Java 17, Spring Boot 3, Spring Data JPA, MySQL, Gemini API

## Features
- Paste code in 8 languages and get an AI review rendered as Markdown
- REST API for submitting code and managing review history
- Persistent history in MySQL (open or delete past reviews)
- API key kept in an environment variable, never in the repo

## Project structure
```
backend/   Spring Boot REST API (controller, service, repository, model, dto)
frontend/  React + Vite UI
```

## Prerequisites
- Java 17+, Maven 3.8+
- Node.js 18+
- MySQL 8 running locally
- A Gemini API key from https://aistudio.google.com/apikey

## Run locally
### 1. Backend
```bash
cd backend
export GEMINI_API_KEY=your_key_here          # PowerShell: $env:GEMINI_API_KEY="your_key_here"
export DB_USERNAME=root DB_PASSWORD=your_mysql_password
mvn spring-boot:run
```
The `code_reviewer` database and tables are created automatically. API runs on http://localhost:8080.

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```
Open http://localhost:5173.

## API
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/reviews` | Submit `{ "language", "code" }`, returns the saved review |
| GET | `/api/reviews` | List review history (newest first) |
| GET | `/api/reviews/{id}` | Get one review |
| DELETE | `/api/reviews/{id}` | Delete a review |

## Configuration
| Variable | Default | Purpose |
|----------|---------|---------|
| `GEMINI_API_KEY` | none (required) | Gemini API key |
| `GEMINI_MODEL` | `gemini-2.5-flash` | Gemini model name |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | local MySQL, root/root | Database connection |
| `CORS_ORIGIN` | `http://localhost:5173` | Allowed frontend origin |
