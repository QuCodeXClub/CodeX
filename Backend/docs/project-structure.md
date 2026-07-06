# Project Structure

This document explains the directory layout of the CodeX Backend and the purpose of each folder and file.

Understanding the project structure makes it easier to navigate the codebase, locate specific functionality, and contribute to the project.

---

# Table of Contents

1. Project Overview
2. Directory Structure
3. Root Directory
4. Source Directory
5. Configuration
6. Controllers
7. Models
8. Routes
9. Middlewares
10. Utilities
11. Request Flow
12. Best Practices

---

# Project Overview

The CodeX Backend follows a modular architecture inspired by the **MVC (Model–View–Controller)** pattern.

Each folder has a single responsibility.

```text
Client
   │
   ▼
Routes
   │
   ▼
Controllers
   │
   ▼
Models
   │
   ▼
MongoDB
```

Supporting this architecture are:

- Middlewares
- Utilities
- Configuration
- Constants

This separation keeps the codebase organized, maintainable, and scalable.

---

# Complete Project Structure

```text
Backend/
│
├── docs/
│
├── public/
│   └── temp/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   ├── app.js
│   ├── constants.js
│   └── server.js
│
├── .env
├── .env.example
├── package.json
├── package-lock.json
└── README.md
```

---

# Root Directory

The root directory contains the project's configuration, documentation, and entry files.

| File / Folder | Purpose |
|--------------|---------|
| docs | Project documentation |
| public | Static files |
| src | Application source code |
| .env | Environment variables |
| .env.example | Example environment configuration |
| package.json | Project metadata and dependencies |
| package-lock.json | Dependency lock file |
| README.md | Project overview |

---

# Source Directory

The `src` directory contains the application's implementation.

```text
src/
│
├── config/
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
├── app.js
├── constants.js
└── server.js
```

Every major feature of the application lives inside this directory.

---

# server.js

Location

```text
src/server.js
```

This is the application's entry point.

Responsibilities:

- Load environment variables
- Register global error handlers
- Connect to MongoDB
- Seed the default administrator
- Start the HTTP server

Flow:

```text
Load Environment

↓

Connect Database

↓

Seed Admin

↓

Start Server
```

---

# app.js

Location

```text
src/app.js
```

This file configures the Express application.

Responsibilities:

- Initialize Express
- Register global middleware
- Configure CORS
- Configure rate limiting
- Register routes
- Configure Swagger
- Register error middleware

No business logic should be written inside `app.js`.

---

# constants.js

Location

```text
src/constants.js
```

Stores application-wide constants.

Examples include:

- Database names
- API constants
- Reusable configuration values

Keeping constants centralized avoids duplicated values across the project.

---

# Configuration

Directory:

```text
src/config/
```

Current structure:

```text
config/
└── db.js
```

Purpose:

Contains application configuration.

Currently responsible for:

- MongoDB connection

Future configuration files may include:

- Redis
- Logger
- Cache
- Queue
- Storage

---

# Controllers

Directory:

```text
src/controllers/
```

Current files:

```text
admin.controller.js

certificate.controller.js

contact.controller.js

event.controller.js

healthcheck.controller.js

registration.controller.js

student.controller.js

team.controller.js
```

Responsibilities:

- Receive requests from routes
- Validate input
- Execute business logic
- Query database
- Call utilities
- Return API responses

Controllers should **not**:

- Define routes
- Configure middleware
- Define schemas

Example:

```text
Route

↓

Controller

↓

Model

↓

Response
```

---

# Models

Directory:

```text
src/models/
```

Current models:

```text
admin.model.js

certificate.model.js

contact.model.js

event.model.js

session.model.js

studentRegistration.model.js

teamMember.model.js

token.model.js
```

Responsibilities:

- Define MongoDB schemas
- Validation
- Indexes
- Instance methods
- Hooks

Controllers interact with models instead of directly accessing MongoDB.

---

# Routes

Directory:

```text
src/routes/
```

Current routes:

```text
admin.routes.js

certificate.routes.js

contact.routes.js

event.routes.js

healthcheck.routes.js

registration.routes.js

student.routes.js

team.routes.js
```

Responsibilities:

- Define API endpoints
- Attach middleware
- Forward requests to controllers

Example:

```text
POST /api/v1/events

↓

event.routes.js

↓

createEvent()
```

Routes should remain small and contain no business logic.

---

# Middlewares

Directory:

```text
src/middlewares/
```

Current middleware:

```text
auth.middleware.js

error.middleware.js

multer.middleware.js
```

Purpose:

Execute logic before or after controllers.

### auth.middleware.js

- JWT verification
- Session validation
- Authentication

---

### multer.middleware.js

Handles file uploads.

Responsibilities:

- Receive uploaded file
- Save temporarily
- Forward file to controller

---

### error.middleware.js

Global error handler.

Responsibilities:

- Catch unhandled exceptions
- Return standardized error responses
- Prevent application crashes

---

# Utilities

Directory:

```text
src/utils/
```

Current utilities:

```text
ApiError.js

ApiResponse.js

asyncHandler.js

cloudinary.js

emailTemplates.js

seedAdmin.js

sendEmail.js

turnstile.js
```

Utilities provide reusable functionality shared across multiple modules.

---

## ApiError.js

Creates standardized application errors.

Used throughout controllers and middleware.

---

## ApiResponse.js

Creates consistent API success responses.

Example:

```json
{
    "success": true,
    "message": "Success",
    "data": {}
}
```

---

## asyncHandler.js

Wraps asynchronous controllers.

Instead of writing repetitive try/catch blocks:

```text
Controller

↓

asyncHandler

↓

Error Middleware
```

---

## cloudinary.js

Responsible for:

- Uploading images
- Deleting images
- Returning secure Cloudinary URLs

---

## sendEmail.js

Centralized email service.

Used for:

- Login OTP
- Registration Approval
- Registration Rejection
- Certificate Emails

---

## emailTemplates.js

Contains reusable HTML email templates.

Separating templates from business logic makes email management easier.

---

## seedAdmin.js

Executed during application startup.

Responsibilities:

- Check if an administrator exists
- Create the default administrator if required

This ensures a fresh installation is immediately usable.

---

## turnstile.js

Integrates with Cloudflare Turnstile.

Responsibilities:

- Verify CAPTCHA token
- Prevent automated registrations

---

# Public Directory

```text
public/
```

Temporary storage for uploaded files.

```text
public/

└── temp/
```

Workflow:

```text
Client Upload

↓

Multer

↓

public/temp

↓

Cloudinary

↓

Delete Temporary File
```

Files stored here are temporary and should not be considered permanent storage.

---

# Documentation Directory

```text
docs/
```

Contains all project documentation.

Examples:

```text
architecture.md

database.md

authentication.md

middleware.md

api-reference.md

security.md

deployment.md
```

Keeping documentation inside its own directory improves discoverability and maintenance.

---

# Complete Request Flow

```text
Client
   │
   ▼
Routes
   │
   ▼
Middleware
   │
   ▼
Controller
   │
   ▼
Utility (Optional)
   │
   ▼
Model
   │
   ▼
MongoDB
   │
   ▼
ApiResponse
   │
   ▼
Client
```

This flow is followed consistently across all features.

---

# Feature Organization

Each major feature follows the same architecture.

Example:

```text
Event Feature

event.routes.js

↓

event.controller.js

↓

event.model.js
```

Another example:

```text
Certificate Feature

certificate.routes.js

↓

certificate.controller.js

↓

certificate.model.js
```

This predictable structure makes the project easier to understand and extend.

---

# Best Practices

When adding new features, follow these guidelines:

- Create a dedicated route file.
- Keep business logic inside controllers.
- Store database logic inside models.
- Place reusable functions inside utilities.
- Add middleware only when required.
- Follow the existing naming conventions.
- Keep folders focused on a single responsibility.
- Update documentation whenever a new module is introduced.

---

# Summary

The CodeX Backend is organized into modular components that separate routing, business logic, database interaction, middleware, and shared utilities.

This structure provides:

- Clear separation of concerns
- Easier debugging
- Better maintainability
- Consistent feature organization
- Improved scalability
- Cleaner collaboration for multiple developers

Following this structure ensures that new features can be added with minimal impact on the existing codebase while keeping the project easy to navigate and maintain.