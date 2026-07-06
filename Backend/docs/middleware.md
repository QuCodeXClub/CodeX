# Middleware

This document explains the middleware used in the CodeX Club Backend. Middleware is responsible for processing requests before they reach the controllers and handling responses after the controllers finish execution.

---

# What is Middleware?

Middleware is a function that executes during the request-response lifecycle.

It can:

- Authenticate users
- Validate requests
- Handle file uploads
- Add security headers
- Parse request data
- Log requests
- Handle errors
- Compress responses

Every incoming request passes through multiple middleware before reaching the API route.

---

# Request Lifecycle

```text
Client Request
      │
      ▼
Helmet
      │
      ▼
Morgan Logger
      │
      ▼
Rate Limiter
      │
      ▼
Compression
      │
      ▼
CORS
      │
      ▼
JSON / URL Parser
      │
      ▼
Cookie Parser
      │
      ▼
Mongo Sanitization
      │
      ▼
Authentication (Protected Routes)
      │
      ▼
Controller
      │
      ▼
Error Handler
      │
      ▼
Client Response
```

---

# Global Middleware

The following middleware is applied to every request.

| Middleware | Purpose |
|------------|---------|
| Helmet | Adds security-related HTTP headers |
| Morgan | Logs incoming HTTP requests |
| Rate Limiter | Prevents excessive requests |
| Compression | Compresses responses for better performance |
| CORS | Allows requests from approved origins |
| Express JSON | Parses JSON request bodies |
| Express URL Encoded | Parses form data |
| Cookie Parser | Reads cookies from incoming requests |
| Express Static | Serves static files |
| Mongo Sanitize | Prevents NoSQL Injection attacks |
| Error Handler | Handles all application errors |

---

# Helmet

Helmet helps secure the application by automatically setting several HTTP security headers.

### Purpose

- Protect against common web vulnerabilities
- Improve browser security
- Hide unnecessary server information

Applied globally before all routes.

---

# Morgan

Morgan logs every incoming HTTP request.

### Purpose

- Request debugging
- Development logging
- API monitoring

Example log:

```text
GET /api/v1/events 200 15ms
```

---

# Rate Limiter

The backend limits repeated requests to reduce abuse.

### Configuration

| Property | Value |
|----------|-------|
| Window | 15 Minutes |
| Maximum Requests | 100 |
| Applied To | `/api/*` |

When the limit is exceeded:

```http
429 Too Many Requests
```

Response:

```json
{
    "message": "Too many requests from this IP, please try again after 15 minutes"
}
```

---

# Compression

Compression reduces the size of API responses before sending them to clients.

### Benefits

- Faster responses
- Reduced bandwidth usage
- Improved performance

---

# CORS

Cross-Origin Resource Sharing controls which frontend applications can access the backend.

### Configuration

- Allowed Origin comes from `.env`
- Credentials are enabled
- Supports HTTP Only Cookies

Example

```javascript
origin: process.env.CORS_ORIGIN
credentials: true
```

---

# Request Body Parsers

The backend automatically parses incoming request data.

### JSON Parser

Supports JSON payloads up to:

```text
16 KB
```

---

### URL Encoded Parser

Supports HTML form submissions.

Maximum payload:

```text
16 KB
```

---

# Cookie Parser

Reads cookies sent by the browser.

Used for:

- JWT Authentication
- Session validation

Example

```javascript
req.cookies.accessToken
```

---

# Static File Middleware

Serves public files from:

```text
public/
```

Examples include:

- Uploaded images
- Temporary files
- Static assets

---

# Mongo Sanitize

Protects the application against NoSQL Injection attacks.

Incoming data is sanitized from:

- Request Body
- URL Parameters
- Query Parameters
- Request Headers

This prevents malicious MongoDB operators such as:

```text
$gt
$ne
$where
```

from being injected into queries.

---

# Authentication Middleware

Middleware Name

```text
verifyJWT
```

This middleware protects administrator-only routes.

---

## Authentication Process

For every protected request:

```text
Request
   │
   ▼
Read JWT Cookie
   │
   ▼
Verify JWT Signature
   │
   ▼
Validate Session ID
   │
   ▼
Check User Role
   │
   ▼
Find Session
   │
   ▼
Find Admin
   │
   ▼
Attach Admin to Request
   │
   ▼
Continue Request
```

---

## Authentication Steps

The middleware performs the following checks:

### 1. Read Token

Looks for a JWT in:

- HTTP Only Cookie
- Authorization Header

---

### 2. Verify JWT

The token is verified using the application secret.

If verification fails:

```http
401 Unauthorized
```

---

### 3. Validate Session

The middleware checks whether:

- Session exists
- Session token matches

If not:

```http
401 Session expired or invalid
```

---

### 4. Verify Admin Role

Only administrators can access protected routes.

If another role attempts access:

```http
403 Access Denied
```

---

### 5. Load Admin

The authenticated administrator is loaded from the database.

The password field is excluded.

---

### 6. Attach Request Data

After successful authentication:

```javascript
req.admin
req.sessionId
```

become available for controllers.

---

# File Upload Middleware

The backend uses **Multer** for handling file uploads.

### Storage

Files are temporarily stored inside:

```text
public/temp/
```

The directory is automatically created if it does not exist.

---

## File Naming

Uploaded files receive a unique filename.

Example

```text
coverImage-1720953876123.png
```

This prevents filename collisions.

---

## Used By

- Event Cover Images
- Team Member Photos
- Certificate Signatures

---

# Error Handling Middleware

The error handler is registered after all routes.

```text
app.use(errorHandler)
```

This ensures every application error is handled consistently.

---

## Responsibilities

The middleware:

- Handles custom API errors
- Handles Mongoose validation errors
- Converts unknown errors into API errors
- Sends consistent JSON responses

---

## Development Mode

During development:

- Error stack traces are included

Example

```json
{
    "success": false,
    "message": "Validation failed",
    "stack": "..."
}
```

---

## Production Mode

In production:

- Stack traces are hidden
- Only safe error information is returned

---

# Server Startup

Before the application starts serving requests:

1. Environment variables are loaded.
2. MongoDB connection is established.
3. Default administrator is seeded.
4. Express server starts listening.
5. Global error handlers are registered.

---

# Global Error Handling

The application listens for unexpected runtime errors.

## Uncaught Exceptions

Handles synchronous application crashes.

Example

```text
ReferenceError
SyntaxError
```

---

## Unhandled Rejections

Handles rejected Promises that were not caught.

Example

```text
Database Connection Failure
API Failure
```

When detected, the server shuts down gracefully.

---

# Middleware Execution Order

```text
Helmet
    │
Morgan
    │
Rate Limiter
    │
Compression
    │
CORS
    │
Body Parser
    │
Cookie Parser
    │
Static Files
    │
Mongo Sanitize
    │
API Routes
    │
verifyJWT (Protected Routes Only)
    │
Controller
    │
Error Handler
    │
Response
```

---

# Related Documentation

| Document | Description |
|----------|-------------|
| `authentication.md` | Authentication and session flow |
| `api-reference.md` | Complete API documentation |
| `security.md` | Security features and protections |
| `database.md` | Database collections and models |
| `development-guide.md` | Backend development guidelines |