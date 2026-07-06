# Environment Variables

This document explains all environment variables required by the CodeX Club Backend.

Environment variables allow the application to be configured without changing the source code. They store sensitive information such as database credentials, API secrets, and third-party service configuration.

---

# Getting Started

Create a new `.env` file in the project root.

```text
backend/
│
├── .env
├── .env.example
├── package.json
└── src/
```

Copy the sample configuration.

```bash
cp .env.example .env
```

Then replace the placeholder values with your own configuration.

---

# Environment Variables

## Server Configuration

These variables configure the Express server.

| Variable | Required | Description | Default |
|----------|----------|-------------|---------|
| `NODE_ENV` | No | Application environment | `development` |
| `PORT` | No | Backend server port | `5000` |
| `SERVER_URL` | No | Backend server URL | `http://localhost:5000` |
| `CORS_ORIGIN` | No | Allowed frontend origin | `*` |

Example

```env
NODE_ENV=development
PORT=5000
SERVER_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:5173
```

---

## Database

MongoDB connection configuration.

| Variable | Required | Description |
|----------|----------|-------------|
| `MONGODB_URI` | Yes | MongoDB connection string |

Example

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codex
```

---

## JWT Authentication

Used for administrator authentication and session management.

| Variable | Required | Description |
|----------|----------|-------------|
| `ACCESS_TOKEN_SECRET` | Yes | Secret used to sign JWT tokens |
| `ACCESS_TOKEN_EXPIRY` | Yes | JWT expiration time |

Example

```env
ACCESS_TOKEN_SECRET=your-super-secret-key
ACCESS_TOKEN_EXPIRY=10d
```

---

## Cloudinary

Cloudinary stores uploaded images.

Used for:

- Event Cover Images
- Team Member Photos

| Variable | Required | Description |
|----------|----------|-------------|
| `CLOUDINARY_CLOUD_NAME` | Yes | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |

Example

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=xxxxxxxxxxxx
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxx
```

---

## SMTP Email Configuration

SMTP credentials are used for sending emails.

Used for:

- Login OTP
- Registration Updates
- Certificate Emails

| Variable | Required | Description |
|----------|----------|-------------|
| `SMTP_HOST` | Yes | SMTP server host |
| `SMTP_PORT` | Yes | SMTP server port |
| `SMTP_USER` | Yes | SMTP username |
| `SMTP_PASSWORD` | Yes | SMTP password |
| `FROM_EMAIL` | Yes | Sender email address |
| `FROM_NAME` | Yes | Sender display name |

Example

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_username
SMTP_PASSWORD=your_password

FROM_EMAIL=noreply@codex.com
FROM_NAME="CodeX Team"
```

---

## Default Administrator

These values are used only during the initial admin seeding process.

| Variable | Required | Description |
|----------|----------|-------------|
| `ADMIN_USERNAME` | No | Initial administrator username |
| `ADMIN_PASSWORD` | No | Initial administrator password |

Example

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

> **Note**
>
> These variables are only used when creating the first administrator account.

---

## Frontend Configuration

Used when generating links that point to the frontend application.

Examples include:

- Certificate Verification
- Email Links

| Variable | Required | Description |
|----------|----------|-------------|
| `FRONTEND_URL` | Yes | Frontend application URL |

Example

```env
FRONTEND_URL=http://localhost:5173
```

---

## Cloudflare Turnstile

Cloudflare Turnstile protects public forms from automated bots.

Currently used for:

- Student Registration

| Variable | Required | Description |
|----------|----------|-------------|
| `TURNSTILE_SECRET_KEY` | No | Cloudflare Turnstile secret key |

Example

```env
TURNSTILE_SECRET_KEY=your_turnstile_secret
```

> During local development, this value can be left empty if bot protection is disabled.

---

# Complete Example

```env
# Server
NODE_ENV=development
PORT=5000
SERVER_URL=http://localhost:5000
CORS_ORIGIN=http://localhost:5173

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codex

# JWT
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
ACCESS_TOKEN_EXPIRY=10d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
FROM_EMAIL=noreply@codex.com
FROM_NAME="CodeX Team"

# Admin
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Frontend
FRONTEND_URL=http://localhost:5173

# Turnstile
TURNSTILE_SECRET_KEY=your_turnstile_secret
```

---

# Best Practices

- Never commit the `.env` file to Git.
- Commit only the `.env.example` file.
- Use strong, randomly generated JWT secrets.
- Rotate secrets periodically.
- Store production credentials securely.
- Use different credentials for development and production.
- Keep API keys and passwords private.

---

# Production Checklist

Before deploying, verify the following:

- All required environment variables are configured.
- MongoDB connection string is correct.
- JWT secret is secure.
- Cloudinary credentials are valid.
- SMTP credentials can send emails.
- Frontend URL points to the production frontend.
- CORS origin is restricted to trusted domains.

---

# Related Documentation

| Document | Description |
|----------|-------------|
| `getting-started.md` | Local project setup |
| `authentication.md` | JWT and authentication flow |
| `deployment.md` | Production deployment guide |
| `security.md` | Security recommendations |