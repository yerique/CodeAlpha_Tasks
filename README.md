# CodeAlpha Backend Development Projects

This repository contains the backend development tasks completed for the CodeAlpha internship. Each directory represents a standalone backend API built using Node.js, Express, and MongoDB, conforming to modern coding standards and ES Modules architecture.

---

## Projects Overview

### 1. URL Shortener API (`CodeAlpha_UrlShortner`)
A high-performance URL shortener microservice that allows users to generate compact links, choose custom aliases, and track redirection clicks and statistics.
* **Core Technologies**: Node.js, Express, MongoDB, Mongoose, nanoid, validator.
* **Primary Endpoints**: `/shorten`, `/:shortCode`, `/stats/:shortCode`.

### 2. Job Board Backend (`CodeAlpha_JobBoard`)
A secure REST API supporting job board operations. It includes role-based access for Employers (to publish postings and review applicants) and Candidates (to search listings and upload PDF resumes).
* **Core Technologies**: Node.js, Express, MongoDB, Mongoose, jsonwebtoken, bcryptjs, multer.
* **Primary Endpoints**: `/api/auth/`, `/api/jobs/`, `/api/apply/`, `/api/my-applications/`.

### 3. Event Registration System (`CodeAlpha_EventRegisteration`)
A scalable backend system for hosting and booking events. It supports admin controls for managing events and seat capacity constraints for standard users.
* **Core Technologies**: Node.js, Express, MongoDB, Mongoose, jsonwebtoken, bcryptjs.
* **Primary Endpoints**: `/api/auth/`, `/api/events/`, `/api/registrations/`.

---

## Getting Started

To run any of the backend tasks locally, navigate into the respective project directory and follow these steps:

### 1. Configure Environment Variables
Copy the `.env.example` file in the project root to `.env` and fill in the parameters:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/database-name
JWT_SECRET=your_jwt_secret_key
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the Project
* **Development Mode** (with automatic nodemon reloads):
  ```bash
  npm run dev
  ```
* **Production Mode**:
  ```bash
  npm start
  ```
