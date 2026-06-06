# Job Board Backend API

A robust, secure Job Board backend API built using Node.js, Express, and MongoDB. This backend provides complete functionality for candidate authentication, job posting management, vacancy searching and filtering, and resume PDF applications.

---

## Key Features

* **User Authentication**: Secure registration and login for both Employers and Candidates, utilizing `bcryptjs` for password hashing and JSON Web Tokens (`JWT`) for state-free request authorization.
* **Job Management**: Complete CRUD operations for posting job vacancies, restricted to verified Employer accounts.
* **Advanced Job Search**: Seamless query parameters to search and filter jobs by keywords/title and category.
* **Resume PDF Application Submission**: Allows candidate job seekers to apply to jobs by uploading their resume as a PDF using `multer`.
* **Application Status Updates**: Allows employers to manage application reviews by changing candidates' application status (e.g. accepted, interview, rejected).
* **Employer Notifications**: Built-in notification logger that dynamically alerts the respective job owner/employer when a candidate submits an application.

---

## Technology Stack

* **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
* **Framework**: [Express.js](https://expressjs.com/)
* **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
* **Security & Tokens**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
* **File Upload**: [multer](https://github.com/expressjs/multer)

---

## Repository Directory Structure

```text
CodeAlpha_JobBoard/
├── src/
│   ├── config/
│   │   └── config.js        # Application configurations & env loader
│   ├── controllers/
│   │   ├── appController.js  # Job application request handlers
│   │   ├── authController.js # User registration & login handlers
│   │   └── jobController.js  # Job vacancy CRUD handlers
│   ├── db/
│   │   └── db.js            # MongoDB connection settings
│   ├── models/
│   │   ├── Application.js    # Job application Mongoose Schema
│   │   ├── Job.js            # Job posting Mongoose Schema
│   │   └── User.js           # User profile Mongoose Schema
│   ├── routes/
│   │   └── api.js            # Express API endpoint router
│   └── app.js                # Core App Express setup
├── server.js                 # Entry point server execution script
├── package.json              # Dependencies and scripts definitions
└── readme.md                 # Documentation
```

---

## Environment Configuration

Create a `.env` file in the root folder of the project:

```env
# Server running port
PORT=5000

# MongoDB Connection String (Atlas or Local URI)
MONGO_URI=mongodb://localhost:27017/job-board-db

# Secret key used for signing JWT tokens
JWT_SECRET=your_jwt_secret_key
```

---

## Getting Started

### 1. Install Dependencies
Run the installation command in the root folder to set up packages:
```bash
npm install
```

### 2. Run in Development Mode
Launches the server with automatic restart capability via `nodemon`:
```bash
npm run dev
```

### 3. Run in Production Mode
Launches the standard server process using node:
```bash
npm start
```

---

## API Endpoint Reference

### Authentication Endpoints

#### 1. Register User
Create a new user account (employer or candidate).

* **Endpoint**: `POST /api/auth/register`
* **Body Parameters**:
  * `name` (string, required): Full name.
  * `email` (string, required): Unique email address.
  * `password` (string, required): Password.
  * `role` (string, optional): Role (`employer` or `candidate`, defaults to `candidate`).
  * `companyName` (string, optional): Company name (required/recommended for employers).

---

#### 2. Login User
Authenticate credentials and receive a JWT authorization token.

* **Endpoint**: `POST /api/auth/login`
* **Response Body**: Returns the login status, `token`, user `role`, and user `name`.

---

### Job Endpoints

#### 3. List and Search Jobs
Retrieve job vacancy lists with support for filter criteria.

* **Endpoint**: `GET /api/jobs`
* **Query Parameters**:
  * `search` (string, optional): Case-insensitive keyword title search.
  * `category` (string, optional): Category matching (e.g. IT, Marketing).

---

#### 4. Create Job Posting
Create a new vacancy posting (requires authorization, Employer only).

* **Endpoint**: `POST /api/jobs`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

#### 5. List Posted Jobs
Retrieve jobs posted by the logged-in employer (requires authorization, Employer only).

* **Endpoint**: `GET /api/my-posted-jobs`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

### Application Endpoints

#### 6. Apply for Job
Submit a job application with a PDF resume (requires authorization, Candidate only).

* **Endpoint**: `POST /api/apply`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Body (Multipart/Form-Data)**:
  * `jobId` (string, required): The ID of the targeted job.
  * `resume` (file, required): The PDF resume document.

---

#### 7. Retrieve Candidate Applications
Retrieve list of applications submitted by the logged-in candidate (requires authorization, Candidate only).

* **Endpoint**: `GET /api/my-applications`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

#### 8. Retrieve Job Applications
Retrieve all candidates who applied for a specific job (requires authorization, Employer only).

* **Endpoint**: `GET /api/jobs/:jobId/applications`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

#### 9. Update Application Status
Update the status of an application (requires authorization, Employer only).

* **Endpoint**: `PUT /api/applications/:id/status`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Body Parameters**:
  * `status` (string, required): New status value (`pending`, `interview`, `accepted`, `rejected`).
