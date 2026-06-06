# Express & MongoDB URL Shortener API

A modern, high-performance URL shortener microservice built on Node.js, Express, and MongoDB. It allows users to quickly generate short links, customize short codes, track redirect counts, and fetch access statistics.

---

## Key Features

* **URL Auto-Generation**: Automatically generates unique, compact, and URL-friendly 8-character codes using `nanoid`.
* **Custom Code Alias**: Allows users to specify their own custom alias for shortened URLs.
* **Format Validation**: Automatically validates incoming URLs to guarantee redirect integrity using `validator`.
* **Duplicate Detection**: Safely detects and reuse existing shortened routes for matching long URLs to optimize database storage.
* **Redirection Engine**: Rapid, direct `302 Found` redirection mechanism with automatic click-through tracking.
* **Analytics Tracking**: Tracks total redirection clicks per shortened code.
* **Clean Architecture**: Built on a clean, scalable MVC-inspired folder layout.

---

## Technology Stack

* **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
* **Framework**: [Express.js](https://expressjs.com/)
* **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
* **Id Generator**: [nanoid](https://github.com/ai/nanoid)
* **Validation**: [validator](https://github.com/validatorjs/validator.js)

---

## Repository Directory Structure

```text
CodeAlpha_UrlShortner/
├── src/
│   ├── config/
│   │   └── config.js        # Application configurations & env loader
│   ├── controllers/
│   │   └── urlController.js  # Main business logic handlers
│   ├── db/
│   │   └── db.js            # MongoDB connection settings
│   ├── models/
│   │   └── urlModel.js      # URL Mongoose Schema definer
│   ├── routes/
│   │   └── urlRoutes.js      # Express endpoint routers
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
MONGO_URI=mongodb://localhost:27017/url-shortener

# Base URL used for generated shortened routes
BASE_URL=http://localhost:5000
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

### 1. Shorten a URL
Generate a shortened URL representing a long address.

* **Endpoint**: `POST /shorten`
* **Body Parameters**:
  * `originalUrl` (string, required): The target URL to shorten.
  * `shortCode` (string, optional): A custom shortcut name.

**Request Payload:**
```json
{
  "originalUrl": "https://www.google.com",
  "shortCode": "ggl"
}
```

**Successful Response (201 Created):**
```json
{
  "success": true,
  "body": {
    "shortUrl": "http://localhost:5000/ggl",
    "shortCode": "ggl",
    "clicks": 0
  }
}
```

---

### 2. Redirect shortened URL
Automatically redirects to the original destination URL and increments the click counter.

* **Endpoint**: `GET /:shortCode`
* **Example**: `GET /ggl`
* **Response**: `302 Found` (Browser redirects to `https://www.google.com`)

---

### 3. Retrieve URL Statistics
Query information regarding redirect click count and target location.

* **Endpoint**: `GET /stats/:shortCode`
* **Example**: `GET /stats/ggl`

**Successful Response (200 OK):**
```json
{
  "success": true,
  "body": {
    "shortCode": "ggl",
    "originalUrl": "https://www.google.com",
    "clicks": 14
  }
}
```
