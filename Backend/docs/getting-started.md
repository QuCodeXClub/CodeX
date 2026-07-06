# Getting Started

This guide explains how to set up and run the **CodeX Backend** on your local machine for development or in a production environment.

---

# Prerequisites

Before setting up the project, make sure the following software is installed on your system.

| Software | Recommended Version | Required |
|-----------|---------------------|----------|
| Node.js | 22.x LTS or later | ✅ |
| npm | 10.x or later | ✅ |
| MongoDB | 8.x or MongoDB Atlas | ✅ |
| Git | Latest | ✅ |

Check your installed versions:

```bash
node -v
npm -v
git --version
```

---

# System Requirements

Minimum recommended specifications:

- Windows 10/11, Linux, or macOS
- 4 GB RAM (8 GB recommended)
- Internet connection
- MongoDB database (Local or Atlas)

---

# Clone the Repository

Clone the backend repository using Git.

```bash
git clone <repository-url>
```

Move into the project directory.

```bash
cd backend
```

---

# Install Dependencies

Install all required project dependencies.

```bash
npm install
```

This installs all packages listed in `package.json`.

### Main Runtime Dependencies

- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcryptjs
- Nodemailer
- Cloudinary
- Helmet
- Multer
- Morgan
- Compression
- Rate Limiter

Development dependencies include:

- Nodemon
- ESLint
- Prettier

---

# Project Structure

After installation the project structure should look similar to:

```text
backend/
│
├── docs/
├── src/
├── package.json
├── package-lock.json
├── .env
├── .env.example
└── README.md
```

---

# Environment Setup

Create a new environment file.

```bash
cp .env.example .env
```

If you're using Windows PowerShell:

```powershell
copy .env.example .env
```

Or create the `.env` file manually.

Populate it using your project configuration.

Example:

```env
PORT=5000

NODE_ENV=development

MONGODB_URI=

ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=1d

CORS_ORIGIN=http://localhost:5173

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=

FROM_NAME=CodeX Club
FROM_EMAIL=

ADMIN_EMAIL=
ADMIN_PASSWORD=

TURNSTILE_SECRET_KEY=

FRONTEND_URL=http://localhost:5173
SERVER_URL=http://localhost:5000
```

> **Important**
>
> Never commit the `.env` file to Git.
>
> Only commit `.env.example`.

---

# MongoDB Setup

The backend supports both:

- Local MongoDB
- MongoDB Atlas

---

## Option 1 — Local MongoDB

Install MongoDB Community Edition.

Start MongoDB.

Windows

```bash
net start MongoDB
```

Linux

```bash
sudo systemctl start mongod
```

Use the connection string:

```text
mongodb://127.0.0.1:27017/codex
```

---

## Option 2 — MongoDB Atlas

1. Create a MongoDB Atlas Cluster.
2. Create a Database User.
3. Whitelist your IP Address.
4. Copy the connection string.

Example:

```text
mongodb+srv://username:password@cluster.mongodb.net/codex
```

Paste it into:

```env
MONGODB_URI=<your-mongodb-uri>
```

---

# Running the Development Server

Start the development server using Nodemon.

```bash
npm run dev
```

This command runs:

```bash
nodemon src/server.js
```

Nodemon automatically restarts the server whenever files are modified.

If everything is configured correctly, you should see output similar to:

```text
MongoDB Connected Successfully

Server running on port 5000
```

---

# Running the Production Server

To start the application without Nodemon:

```bash
npm start
```

This runs:

```bash
node src/server.js
```

---

# Available Scripts

| Command | Description |
|----------|-------------|
| `npm install` | Install project dependencies |
| `npm run dev` | Start development server with Nodemon |
| `npm start` | Start production server |
| `npm run format` | Format project using Prettier |
| `npm test` | Placeholder test script |

---

# Verify Installation

Once the server starts successfully, open your browser or API client.

Health Check Endpoint

```http
GET /api/v1/healthcheck
```

Example:

```
http://localhost:5000/api/v1/healthcheck
```

A successful response confirms that:

- Express server is running
- MongoDB connection is established
- Routes are loaded correctly

---

# Development Workflow

Typical development workflow:

1. Pull the latest changes.
2. Install dependencies if required.
3. Update your `.env` file.
4. Start MongoDB.
5. Run the development server.
6. Test APIs using Postman or another API client.
7. Commit your changes.
8. Push to the repository.

---

# Production Build

The backend does not require a build step because it is a Node.js application.

Production deployment generally consists of:

1. Clone the repository.

```bash
git clone <repository-url>
```

2. Install dependencies.

```bash
npm install
```

3. Configure environment variables.

4. Start the server.

```bash
npm start
```

For production environments, it is recommended to:

- Use **PM2** as the process manager.
- Place the application behind **Nginx** or another reverse proxy.
- Enable **HTTPS** using SSL/TLS certificates.
- Store secrets securely.
- Enable regular database backups.
- Configure application logging and monitoring.

Detailed deployment instructions are available in the **deployment.md** documentation.

---

# Common Issues

## MongoDB Connection Failed

Check:

- MongoDB is running.
- `MONGODB_URI` is correct.
- Network access is allowed (Atlas).
- Database credentials are valid.

---

## Port Already in Use

Change the application port in `.env`.

```env
PORT=5001
```

or terminate the process using the current port.

---

## Cloudinary Upload Errors

Verify:

- Cloud Name
- API Key
- API Secret

All Cloudinary credentials must be valid.

---

## Email Not Sending

Verify:

- SMTP Host
- SMTP Port
- SMTP Username
- SMTP Password

If using Gmail, use an **App Password** instead of your account password.

---

## JWT Authentication Fails

Verify:

- `ACCESS_TOKEN_SECRET` exists.
- Cookies are enabled.
- The token has not expired.
- The session still exists in the database.

---

# Next Steps

After successfully setting up the backend, continue with the following documentation:

- **project-structure.md** – Understand the folder organization.
- **architecture.md** – Learn how the backend is structured internally.
- **authentication.md** – Understand the authentication and authorization flow.
- **database.md** – Explore database models and relationships.
- **api-reference.md** – Complete REST API documentation.