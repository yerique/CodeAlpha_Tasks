# Event Registration Backend API

A complete, high-performance Event Registration backend API built using Node.js, Express, and MongoDB. This service handles user authentication, admin-managed event creation and updates, real-time availability seat checks, user event bookings, and booking cancellation features.

---

## Key Features

* **User Authentication**: Secure register and login pipelines for both standard Users and Admins using `bcryptjs` for password hashing and JSON Web Tokens (`JWT`) for stateless session validation.
* **Event Management**: Fully-featured event CRUD endpoints (create, read, update, delete) restricted to administrator roles.
* **Capacity and Booking Availability Rules**: Automatic calculations to verify ticket seat availability and prevent bookings when events are sold out.
* **Booking Trackers**: Clean endpoints for users to manage their registered event bookings and cancel bookings at any time.
* **Admin Notifications**: Simulated real-time server-side console logging notification triggers for user registrations and booking cancellations.

---

## Technology Stack

* **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
* **Framework**: [Express.js](https://expressjs.com/)
* **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
* **Security & Tokens**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) & [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

---

## Repository Directory Structure

```text
CodeAlpha_EventRegisteration/
├── src/
│   ├── config/
│   │   └── config.js        # Application configurations & env loader
│   ├── controllers/
│   │   ├── authController.js # User registration & login handlers
│   │   ├── eventController.js # Event listing & admin CRUD handlers
│   │   └── regController.js  # User registration & booking handlers
│   ├── db/
│   │   └── db.js            # MongoDB connection settings
│   ├── middleware/
│   │   └── roleMiddleware.js # Admin role guard middleware
│   ├── models/
│   │   ├── Event.js         # Event model Mongoose Schema
│   │   ├── Registration.js  # Booking model Mongoose Schema
│   │   └── User.js          # User model Mongoose Schema
│   ├── routes/
│   │   └── api.js            # Express API endpoint router
│   └── app.js                # Core App Express setup
├── server.js                 # Entry point server execution script
├── seed.js                   # Database test-seeding script
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
MONGO_URI=mongodb://localhost:27017/event-db

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

### 2. Seed the Database
Populates the database with test accounts (User & Admin) and initial mock event listings:
```bash
npm run seed
```
* **Default Seeding Credentials**:
  * **Admin Account**: Email: `admin@example.com` | Password: `123456`
  * **User Account**: Email: `john@example.com` | Password: `123456`

### 3. Run in Development Mode
Launches the server with automatic restart capability via `nodemon`:
```bash
npm run dev
```

### 4. Run in Production Mode
Launches the standard server process using node:
```bash
npm start
```

---

## API Endpoint Reference

### Authentication Endpoints

#### 1. Register User
Create a new user account (user or admin).

* **Endpoint**: `POST /api/auth/register`
* **Body Parameters**:
  * `name` (string, required): Full name.
  * `email` (string, required): Unique email address.
  * `password` (string, required): Password.
  * `role` (string, optional): Role (`user` or `admin`, defaults to `user`).

---

#### 2. Login User
Authenticate credentials and receive a JWT authorization token.

* **Endpoint**: `POST /api/auth/login`
* **Response Body**: Returns the login status, JWT `token`, user `role`, and user `name`.

---

### Event Endpoints

#### 3. List Events
Retrieve all events sorted chronologically (nearest date first) with computed booked statistics.

* **Endpoint**: `GET /api/events`

---

#### 4. Create Event
Create a new event listing (requires authorization, Admin only).

* **Endpoint**: `POST /api/events`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

#### 5. Update Event
Update an existing event listing (requires authorization, Admin only).

* **Endpoint**: `PUT /api/events/:id`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

#### 6. Delete Event
Permanently delete an event and clear all associated bookings (requires authorization, Admin only).

* **Endpoint**: `DELETE /api/events/:id`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

### Registration Bookings Endpoints

#### 7. Book Event
Register the logged-in user for an event (requires authorization).

* **Endpoint**: `POST /api/registrations`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
* **Body Parameters**:
  * `eventId` (string, required): The ID of the targeted event.

---

#### 8. Retrieve User Bookings
Retrieve list of events booked by the logged-in user (requires authorization).

* **Endpoint**: `GET /api/my-registrations`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`

---

#### 9. Cancel Booking
Cancel an existing event registration booking (requires authorization).

* **Endpoint**: `DELETE /api/registrations/:id`
* **Headers**: `Authorization: Bearer <JWT_TOKEN>`
