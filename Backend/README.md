# CodeX Club Backend

Backend REST API powering the CodeX Club platform at Quantum University.

It provides secure authentication, student registrations, event management, certificate generation, team management, and administrative features through a scalable Express.js backend.

---

## Features

- JWT + OTP Authentication
- Student Registration Management
- Event Management
- Team Member Management
- Certificate Generation & Verification
- Contact Form Management
- Cloudinary Image Uploads
- Email Notifications
- Session Management
- Secure REST APIs

---

## Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer
- Cloudinary
- Multer
- Helmet
- Express Rate Limit

---

## Project Structure

```
backend/
│
├── src/
├── docs/
├── package.json
├── README.md
└── .env.example
```

For a complete explanation of the project structure:

➡️ [Project Structure](docs/project-structure.md)

---

## Documentation

| Document | Description |
|----------|-------------|  
| [Getting Started](docs/getting-started.md) | Installation and local setup |
| [Architecture](docs/architecture.md) | Backend architecture and request lifecycle |
| [API Reference](docs/api-reference.md) | Complete REST API documentation |
| [Authentication](docs/authentication.md) | Login flow, JWT, OTP and Sessions |
| [Database](docs/database.md) | MongoDB collections and schema explanation |
| [Middleware](docs/middleware.md) | Global and route middleware |
| [Environment Variables](docs/environment.md) | Complete `.env` explanation |
| [Security](docs/security.md) | Security implementation and best practices |
| [Deployment](docs/deployment.md) | Production deployment guide |
| [Development Guide](docs/development-guide.md) | Coding standards and conventions |
| [Contributing](docs/contributing.md) | Contribution workflow |

---

## Quick Start

Clone the repository

```bash
git clone <repository-url>
cd backend
```

Install dependencies

```bash
npm install
```

Create environment file

```bash
cp .env.example .env
```

Run development server

```bash
npm run dev
```

---

## License

MIT License