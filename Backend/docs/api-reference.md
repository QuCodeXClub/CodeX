# API Reference

This document contains the complete API reference for the CodeX Club Backend.

---

## Base URL

```
Development
http://localhost:5000/api/v1

Production
https://your-domain.com/api/v1
```

---

## Authentication

The backend uses **JWT Authentication** stored in **HTTP Only Cookies**.

Protected endpoints require:

- Valid JWT Cookie
- Active session
- Admin authentication

| Symbol | Meaning |
|---------|----------|
| 🌐 Public | No authentication required |
| 🔒 Protected | Requires authenticated admin |

---

# API Overview

| Module | Base Route |
|----------|------------|
| Healthcheck | `/healthcheck` |
| Admin | `/admin` |
| Students | `/students` |
| Registrations | `/registrations` |
| Events | `/events` |
| Teams | `/teams` |
| Certificates | `/certificates` |
| Contact | `/contact` |

---

# 🩺 Healthcheck

Base Route

```
/api/v1/healthcheck
```

---

## Check Server Status

### Endpoint

```
GET /api/v1/healthcheck
```

### Authentication

🌐 Public

### Purpose

Checks whether the backend server is running correctly.

### Success Response

```json
{
    "success": true,
    "message": "Server is running"
}
```

---

# 🔐 Admin APIs

Base Route

```
/api/v1/admin
```

---

## Login

### Endpoint

```
POST /login
```

### Authentication

🌐 Public

### Purpose

Verifies admin password and sends OTP to the registered email.

### Request Body

```json
{
    "password": "your_password"
}
```

---

## Verify OTP

### Endpoint

```
POST /verify-otp
```

### Authentication

🌐 Public

### Purpose

Verifies OTP, creates login session and returns JWT cookie.

### Request Body

```json
{
    "otp": "123456"
}
```

---

## Logout

### Endpoint

```
POST /logout
```

### Authentication

🔒 JWT Required

### Purpose

Deletes current session and clears authentication cookie.

---

## Update Profile

### Endpoint

```
PATCH /profile
```

### Authentication

🔒 JWT Required

### Purpose

Updates admin profile information.

### Request Body

```json
{
    "name": "John Doe",
    "mobile": "9876543210"
}
```

---

## Change Password

### Endpoint

```
POST /change-password
```

### Authentication

🔒 JWT Required

### Purpose

Changes admin password after verifying the current password.

### Request Body

```json
{
    "oldPassword": "current_password",
    "newPassword": "new_password"
}
```

---

## Get Active Sessions

### Endpoint

```
GET /sessions
```

### Authentication

🔒 JWT Required

### Purpose

Returns all active login sessions including:

- Device
- Browser
- Operating System
- IP Address
- Login Time

---

## Delete Session

### Endpoint

```
DELETE /sessions/:id
```

### Authentication

🔒 JWT Required

### Purpose

Terminates a specific session.

> **Note**
>
> Current session cannot be deleted.

---

# 🎓 Student APIs

Base Route

```
/api/v1/students
```

---

## Register Student

### Endpoint

```
POST /register
```

### Authentication

🌐 Public

### Purpose

Registers a student for club membership.

### Features

- Cloudflare Turnstile verification
- Duplicate registration prevention
- Email notification (if enabled)

---

# 📋 Registration APIs

Base Route

```
/api/v1/registrations
```

---

## Get Registrations

### Endpoint

```
GET /
```

### Authentication

🔒 JWT Required

### Purpose

Returns paginated student registrations.

### Query Parameters

| Parameter | Description |
|------------|-------------|
| status | Filter by status |
| search | Search by name |
| page | Page number |
| limit | Items per page |

### Example

```
GET /?status=PENDING&page=1&limit=10
```

---

## Update Registration Status

### Endpoint

```
PATCH /:id/status
```

### Authentication

🔒 JWT Required

### Purpose

Approves or rejects a registration.

### Request Body

```json
{
    "status": "APPROVED"
}
```

### Additional Actions

- Updates database
- Sends email notification

---

# 📅 Event APIs

Base Route

```
/api/v1/events
```

---

## Get Events

### Endpoint

```
GET /
```

### Authentication

🌐 Public

### Purpose

Returns all events sorted by latest date.

---

## Create Event

### Endpoint

```
POST /
```

### Authentication

🔒 JWT Required

### Content Type

```
multipart/form-data
```

### Purpose

Creates a new event with cover image upload.

### Form Fields

| Field | Type |
|--------|------|
| title | Text |
| description | Text |
| date | Date |
| coverImage | File |

---

## Update Event

### Endpoint

```
PATCH /:id
```

### Authentication

🔒 JWT Required

### Purpose

Updates event information.

Supports optional cover image replacement.

---

## Delete Event

### Endpoint

```
DELETE /:id
```

### Authentication

🔒 JWT Required

### Purpose

Deletes:

- Event
- Cloudinary image

---

# 👥 Team APIs

Base Route

```
/api/v1/teams
```

---

## Get Team Members

### Endpoint

```
GET /
```

### Authentication

🌐 Public

### Purpose

Returns team members.

### Query Parameters

| Parameter | Description |
|------------|-------------|
| academicYear | Filter members |

Example

```
GET /?academicYear=2024-2025
```

---

## Add Team Member

### Endpoint

```
POST /
```

### Authentication

🔒 JWT Required

### Content Type

```
multipart/form-data
```

### Purpose

Adds a team member and uploads photo to Cloudinary.

---

## Update Team Member

### Endpoint

```
PATCH /:id
```

### Authentication

🔒 JWT Required

### Purpose

Updates member information and optionally replaces photo.

---

## Delete Team Member

### Endpoint

```
DELETE /:id
```

### Authentication

🔒 JWT Required

### Purpose

Deletes:

- Team member
- Cloudinary image

---

# 🏆 Certificate APIs

Base Route

```
/api/v1/certificates
```

---

## Generate Certificates

### Endpoint

```
POST /generate-bulk
```

### Authentication

🔒 JWT Required

### Content Type

```
multipart/form-data
```

### Purpose

Bulk generates certificates.

### Features

- Upload signature once
- Generate certificates
- Email certificates automatically
- Stores verification IDs

---

## Verify Certificate

### Endpoint

```
GET /verify/:id
```

### Authentication

🌐 Public

### Purpose

Verifies certificate authenticity using its unique verification ID.

---

# 📨 Contact APIs

Base Route

```
/api/v1/contact
```

---

## Submit Contact Form

### Endpoint

```
POST /
```

### Authentication

🌐 Public

### Purpose

Submits a contact message.

---

## Get Messages

### Endpoint

```
GET /
```

### Authentication

🔒 JWT Required

### Purpose

Returns all contact messages sorted by newest first.

---

## Mark Message as Read

### Endpoint

```
PATCH /:id/read
```

### Authentication

🔒 JWT Required

### Purpose

Marks a contact message as read.

---

## Delete Message

### Endpoint

```
DELETE /:id
```

### Authentication

🔒 JWT Required

### Purpose

Deletes a contact message.

---

# HTTP Status Codes

| Code | Meaning |
|------|----------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Resource Not Found |
| 409 | Conflict |
| 422 | Validation Error |
| 429 | Too Many Requests |
| 500 | Internal Server Error |

---

# Common Response Format

## Success

```json
{
    "success": true,
    "message": "Operation completed successfully",
    "data": {}
}
```

---

## Error

```json
{
    "success": false,
    "message": "Error description"
}
```