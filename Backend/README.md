# CodeX Backend Setup Documentation

This repository contains the backend for the CodeX Coding Club platform. It's built with Node.js, Express, and MongoDB, providing a REST API for student registrations, event management, team coordination, certificates, and an administrative dashboard.

## Prerequisites

- **Node.js** (v20.6+ recommended due to native dotenv integration)
- **MongoDB** database (local or MongoDB Atlas)
- **Cloudinary** account (for image uploads like team photos and signatures)
- **SMTP provider** (e.g., Gmail, Mailtrap, AWS SES) for email and OTP delivery

## Local Development Setup

### 1. Install Dependencies
Navigate into the Backend folder and install all necessary NPM packages:
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root of the backend folder. You can use the provided `.env.sample` as a template:
```bash
cp .env.sample .env
```

**Crucial Variables to Fill Out in `.env`:**
- `MONGODB_URI`: Your MongoDB connection string.
- `ACCESS_TOKEN_SECRET`: A strong random string for signing JWT tokens securely.
- **Cloudinary**: `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` for storing assets in the cloud.
- **SMTP/Email**: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD` to send OTPs and approval notifications.

*Note: The first time the server successfully connects to the database, it will automatically create a default Admin account using the `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in your `.env`.*

### 3. Start the Server
To start the server with auto-reloading (via nodemon) for development:
```bash
npm run dev
```
*(Or use `npm start` for standard node execution in production).*

By default, the server runs on `http://localhost:5000`.

## API Documentation
When the server is running in development mode, the interactive Swagger OpenAPI documentation is automatically served at:
**[http://localhost:5000/api-docs](http://localhost:5000/api-docs)**

You can use this interface to test endpoints directly.

## Important Scripts
- `npm run dev` - Starts server in watch mode
- `npm start` - Starts server normally
- `npm run format` - Runs Prettier to format the codebase

## Tech Stack
- **Core Framework:** Node.js, Express.js (ES Modules)
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JSON Web Tokens (JWT) & Database Sessions, Bcrypt
- **Security:** Helmet, CORS, Express-Rate-Limit, Express-Mongo-Sanitize
- **File Uploads:** Multer + Cloudinary
- **Emails:** Nodemailer
