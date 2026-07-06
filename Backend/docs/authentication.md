# Authentication

This document explains how authentication works in the CodeX Club Backend, including the login process, OTP verification, JWT authentication, session management, and protected routes.

---

# Authentication Overview

The backend uses a **two-step authentication system** to securely authenticate administrators.

Authentication consists of:

1. Password Verification
2. Email OTP Verification
3. JWT Cookie Authentication
4. Session Validation

This approach adds an extra layer of security by requiring both the correct password and a one-time password (OTP).

---

# Authentication Flow

```text
                Admin Login

                     │
                     ▼

           Enter Admin Password

                     │
                     ▼

        Password Verified by Server

                     │
                     ▼

        OTP Sent to Registered Email

                     │
                     ▼

             Enter OTP Code

                     │
                     ▼

          OTP Successfully Verified

                     │
                     ▼

      JWT Generated & Stored in Cookie

                     │
                     ▼

        Session Created in Database

                     │
                     ▼

      Admin Can Access Protected APIs
```

---

# Authentication Components

| Component | Purpose |
|------------|---------|
| Password | Verifies administrator identity |
| OTP | Second verification factor |
| JWT | Authenticates future requests |
| HTTP Only Cookie | Securely stores JWT |
| Session | Tracks active logins |

---

# Login Process

Endpoint

```http
POST /api/v1/admin/login
```

### Purpose

Verifies the administrator password before sending an OTP to the registered email.

### Request

```json
{
    "password": "your_password"
}
```

### What Happens

1. Password is validated.
2. OTP is generated.
3. OTP is sent to the registered email.
4. User proceeds to OTP verification.

---

# OTP Verification

Endpoint

```http
POST /api/v1/admin/verify-otp
```

### Purpose

Verifies the OTP and completes the login process.

### Request

```json
{
    "otp": "123456"
}
```

### What Happens

After successful verification:

- JWT token is generated.
- HTTP Only cookie is created.
- Login session is stored.
- Admin becomes authenticated.

---

# JWT Authentication

After login, the backend generates a **JSON Web Token (JWT)**.

The token is automatically stored inside an **HTTP Only Cookie**.

Because the cookie is HTTP Only:

- JavaScript cannot access it.
- It is automatically included in future requests.
- It helps protect against XSS attacks.

---

# Protected Routes

Any route marked as **Protected** requires a valid authenticated session.

Examples include:

```text
PATCH  /api/v1/admin/profile
POST   /api/v1/admin/change-password
GET    /api/v1/admin/sessions
POST   /api/v1/events
PATCH  /api/v1/events/:id
DELETE /api/v1/events/:id
```

If authentication fails, the request is rejected.

---

# Session Management

Every successful login creates a new session.

Each session represents a unique logged-in device.

The backend can track:

- Device
- Browser
- Operating System
- IP Address
- Login Time

This allows administrators to view and manage active sessions.

---

# Viewing Active Sessions

Endpoint

```http
GET /api/v1/admin/sessions
```

Returns all active administrator sessions.

Example information:

- Current device
- Browser
- Operating system
- Login timestamp
- IP address

---

# Logout

Endpoint

```http
POST /api/v1/admin/logout
```

Logging out performs two actions:

- Deletes the active session
- Clears the authentication cookie

After logout, protected endpoints can no longer be accessed.

---

# Authentication Middleware

Protected routes use authentication middleware to verify every request.

The middleware performs the following checks:

1. Reads JWT from the cookie.
2. Verifies token validity.
3. Confirms the session exists.
4. Attaches authenticated admin information to the request.
5. Allows access to the requested resource.

If any check fails, access is denied.

---

# Authentication Lifecycle

```text
Login
   │
   ▼
Password Verified
   │
   ▼
OTP Verified
   │
   ▼
JWT Generated
   │
   ▼
Cookie Created
   │
   ▼
Session Stored
   │
   ▼
Protected API Access
   │
   ▼
Logout
   │
   ▼
Session Deleted
   │
   ▼
Cookie Cleared
```

---

# Security Features

The authentication system includes multiple security measures.

- Two-factor authentication using OTP
- JWT-based authentication
- HTTP Only authentication cookies
- Session management
- Password verification before login
- Protected administrative routes

---

# Authentication Errors

| HTTP Code | Description |
|-----------|-------------|
| 400 | Invalid request data |
| 401 | Authentication failed |
| 403 | Access denied |
| 404 | Resource not found |
| 429 | Too many requests |
| 500 | Internal server error |

---

# Authentication Best Practices

- Never share administrator credentials.
- Always log out after using shared devices.
- Keep JWT cookies secure.
- Verify every protected request through authentication middleware.
- Regularly review active sessions and remove unknown devices.

---

# Related Documentation

| Document | Description |
|----------|-------------|
| `api-reference.md` | Complete REST API reference |
| `database.md` | Database collections and schemas |
| `middleware.md` | Authentication middleware |
| `security.md` | Security features and protections |
| `getting-started.md` | Local development setup |