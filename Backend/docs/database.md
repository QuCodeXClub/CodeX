# Database

This document describes the database architecture of the CodeX Backend. It explains how data is organized, how collections relate to each other, how MongoDB features such as TTL indexes are used, and the design decisions behind every collection.

The backend uses **MongoDB** as its primary database with **Mongoose** as the Object Data Modeling (ODM) library.

---

# Table of Contents

1. Database Overview
2. Why MongoDB?
3. Database Architecture
4. Collection Overview
5. Entity Relationship Diagram
6. Collection Relationships
7. Data Flow
8. Database Design Principles

---

# Database Overview

The CodeX Backend stores all application data inside MongoDB collections.

Each collection represents a specific business entity within the application.

Examples include:

- Administrator accounts
- Student registrations
- Events
- Team members
- Certificates
- Contact messages
- Authentication sessions
- OTP tokens

MongoDB was selected because it provides:

- Flexible schema design
- High performance
- Excellent integration with Node.js
- Native JSON document storage
- Rich indexing capabilities
- Automatic document expiration using TTL indexes

The application communicates with MongoDB exclusively through **Mongoose models**.

```
Express Controller
        │
        ▼
Mongoose Model
        │
        ▼
MongoDB Collection
```

No controller communicates directly with MongoDB.

This abstraction provides:

- Validation
- Hooks
- Middleware
- Schema consistency
- Cleaner business logic

---

# Why MongoDB?

CodeX primarily stores document-based data rather than highly relational data.

Examples include:

- Student registrations
- Contact forms
- Event information
- Team members

These entities fit naturally into MongoDB documents.

Compared with a relational database, MongoDB offers several advantages for this project.

| Feature | MongoDB |
|----------|----------|
| JSON Documents | ✅ |
| Flexible Schema | ✅ |
| Horizontal Scaling | ✅ |
| Native Node.js Support | ✅ |
| TTL Indexes | ✅ |
| Fast Development | ✅ |

MongoDB also integrates seamlessly with Mongoose, making schema validation and querying straightforward.

---

# Database Architecture

The application consists of eight primary collections.

```
                    MongoDB
                       │
      ┌────────────────┼────────────────┐
      │                │                │
      ▼                ▼                ▼
    Admin          Student        Certificate
      │
      ▼
   Session
      │
      ▼
    Token

      ▼
    Event

      ▼
 TeamMember

      ▼
   Contact
```

Each collection has a single responsibility.

This keeps the database organized and prevents unnecessary coupling between unrelated data.

---

# Collection Overview

The backend currently contains the following collections.

| Collection | Purpose |
|------------|---------|
| Admin | Stores administrator accounts |
| Session | Stores active administrator sessions |
| Token | Stores OTP and verification tokens |
| StudentRegistration | Stores student membership requests |
| Event | Stores club events |
| TeamMember | Stores official team members |
| Certificate | Stores generated certificates |
| Contact | Stores contact form submissions |

Each collection is represented by a dedicated Mongoose model inside:

```text
src/models/
```

---

# Database Organization

The database can be grouped into logical domains.

## Authentication

Responsible for administrator authentication.

```
Admin
   │
Session
   │
Token
```

These collections work together during login and authorization.

---

## Student Management

```
StudentRegistration
```

Responsible for storing membership applications submitted by students.

Administrators review these registrations before approving or rejecting them.

---

## Content Management

```
Event

TeamMember
```

These collections power the public website by storing event information and club team details.

---

## Certificate Management

```
Certificate
```

Stores every generated certificate together with its verification identifier.

Certificates can later be verified publicly without requiring authentication.

---

## Communication

```
Contact
```

Stores messages submitted through the website's contact form.

---

# Entity Relationship Diagram

Unlike a traditional SQL database, MongoDB does not require foreign keys.

Instead, relationships are created only where necessary.

The CodeX Backend intentionally minimizes relationships to keep collections independent.

```
                     ┌──────────────┐
                     │    Admin     │
                     └──────┬───────┘
                            │
                       One-to-Many
                            │
                            ▼
                    ┌──────────────┐
                    │   Session    │
                    └──────┬───────┘
                            │
                       Uses Session
                            │
                            ▼
                    ┌──────────────┐
                    │    Token     │
                    └──────────────┘


     StudentRegistration

             Event

         TeamMember

        Certificate

           Contact
```

Notice that most collections are intentionally independent.

This reduces complexity and avoids expensive joins.

---

# Collection Relationships

Only a few collections are directly related.

## Admin → Session

Relationship:

```
One Admin
        │
        ▼
Many Sessions
```

An administrator can log in from multiple devices.

Examples:

- Laptop
- Desktop
- Mobile Phone

Each login creates a separate session document.

---

## Token → Admin

Authentication tokens reference administrators.

```
Admin
   │
   ▼
Token
```

The Token collection stores temporary authentication information such as OTPs.

Unlike Session documents, Tokens are short-lived.

---

## Token Polymorphic References

One interesting design decision is the use of a **polymorphic reference**.

Instead of permanently referencing only one collection, the Token model uses:

```javascript
refPath: "userType"
```

This allows one schema to reference multiple models.

Current supported values:

```
Admin

Student
```

Future models could also be added without changing the schema.

Example:

```
Faculty

Judge

Volunteer
```

This makes the Token collection highly reusable.

---

## Independent Collections

The remaining collections are intentionally independent.

```
Event

Certificate

Contact

StudentRegistration

TeamMember
```

None of these require complex joins to function.

This improves query performance and simplifies the application logic.

---

# Data Flow

The following diagram illustrates how data moves through the backend.

```
               HTTP Request
                     │
                     ▼
              Express Controller
                     │
                     ▼
             Mongoose Model
                     │
                     ▼
              MongoDB Collection
                     │
                     ▼
            Mongoose Document
                     │
                     ▼
              API Response
```

Every database interaction follows this workflow.

Controllers never bypass Mongoose.

---

# Collection Independence

One of the design goals of this backend is to keep collections loosely coupled.

For example, generated certificates do **not** reference student registration documents.

Instead, the certificate stores the information required for verification.

```
Certificate

Student Name

Student Email

Event Name

Certificate ID

Issued Date
```

Advantages:

- Historical records remain unchanged.
- Certificates continue to work even if registrations are removed.
- Verification is faster.
- No unnecessary database lookups.

---

# Database Design Principles

Several principles guided the database design.

## Single Responsibility

Every collection stores one type of information.

Examples:

- Sessions only manage authentication sessions.
- Events only manage events.
- Contact only stores messages.

This keeps the schema simple and maintainable.

---

## Minimal Relationships

Relationships are created only when necessary.

Benefits include:

- Simpler queries
- Faster reads
- Lower complexity
- Easier maintenance

---

## Validation at Schema Level

Validation rules are defined directly inside Mongoose schemas.

Examples include:

- Required fields
- Email validation
- Phone validation
- Enum restrictions
- Unique constraints

This ensures invalid data cannot be stored in the database.

---

## Automatic Expiration

Instead of manually deleting temporary data, MongoDB automatically removes expired documents using TTL indexes.

This is used for:

- Authentication Tokens
- Login Sessions

TTL indexes will be covered in detail later in this document.

---

## Scalability

The database structure has been designed so that future collections can be added without affecting existing ones.

Examples:

- Announcements
- Blogs
- Gallery
- Sponsors
- Achievements

Each new feature can be implemented as an independent collection following the same architecture.

---

**Next:** Part 2 explains the Authentication collections (`Admin`, `Session`, `Token`, and `StudentRegistration`) in detail, including schemas, validation rules, instance methods, hooks, indexes, and authentication workflow.

Perfect. We'll continue with **Part 2**, covering the authentication-related collections and the student registration model.

---


# Admin Collection

The **Admin** collection stores administrator accounts responsible for managing the CodeX platform.

Unlike student registrations, administrator accounts are created manually (or automatically during the initial application startup using the `seedAdmin()` utility).

Collection Name:

```text
admins
```

Model:

```javascript
Admin
```

---

## Schema Structure

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| name | String | ✅ | Administrator name |
| email | String | ✅ | Unique email address |
| password | String | ✅ | Hashed password |
| mobileNumber | String | ❌ | Contact number |
| profilePhoto | String | ❌ | Cloudinary image URL |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

---

## Schema Diagram

```text
Admin
│
├── name
├── email
├── password
├── mobileNumber
├── profilePhoto
├── createdAt
└── updatedAt
```

---

## Password Storage

Passwords are **never stored in plain text**.

Before saving an administrator document, Mongoose executes a pre-save middleware.

```javascript
adminSchema.pre("save")
```

Flow:

```text
Plain Password
       │
       ▼
bcrypt.hash()
       │
       ▼
Hashed Password
       │
       ▼
MongoDB
```

The application currently uses:

```
bcrypt
Salt Rounds = 10
```

This prevents passwords from being recovered even if the database is compromised.

---

## Instance Methods

The Admin model defines reusable instance methods.

### isPasswordCorrect()

Purpose:

Compare a plain password with the stored bcrypt hash.

```
Input Password
        │
        ▼
bcrypt.compare()
        │
        ▼
true / false
```

This method is used during administrator login.

---

### generateAuthToken()

Purpose:

Generate a JWT access token.

Payload:

```json
{
    "_id": "...",
    "email": "...",
    "sessionId": "...",
    "role": "Admin"
}
```

The token is signed using

```
ACCESS_TOKEN_SECRET
```

and expires according to

```
ACCESS_TOKEN_EXPIRY
```

---

## Why Store Session ID Inside JWT?

The JWT contains the Session ID.

```
JWT

↓

sessionId

↓

Session Collection

↓

Session Validation
```

This allows the backend to verify that the login session still exists.

Without it, logout would not invalidate existing JWTs.

---

# Session Collection

The Session collection stores every active administrator session.

Each successful login creates a new document.

Collection:

```text
sessions
```

Model:

```javascript
Session
```

---

## Why Sessions?

One administrator may log in from multiple devices.

Example:

```text
Admin

├── Laptop

├── Mobile

├── Desktop
```

Each login creates a separate session.

This allows:

- Multi-device login
- Individual session removal
- Device tracking
- Better security

---

## Schema Structure

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| adminId | ObjectId | ✅ | Reference to Admin |
| token | String | ✅ | JWT Token |
| userAgent | String | ✅ | Browser user-agent |
| os | String | ✅ | Operating system |
| browser | String | ✅ | Browser |
| device | String | ✅ | Device type |
| ipAddress | String | ✅ | Client IP |
| expiresAt | Date | ✅ | Session expiry |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

## Relationship

```
Admin

1

│

│

N

Session
```

One administrator can own multiple sessions.

---

## Session Creation Flow

```text
Admin Login
       │
       ▼
OTP Verified
       │
       ▼
Create Session
       │
       ▼
Generate JWT
       │
       ▼
Update Session Token
       │
       ▼
Return Cookie
```

---

## Device Tracking

Each session stores:

- Browser
- Operating System
- Device
- IP Address

Example:

```text
Chrome

Windows

Desktop

192.168.1.20
```

This enables administrators to view all active login sessions.

---

# TTL Index

The Session model uses a TTL (Time-To-Live) index.

```javascript
sessionSchema.index(
    { expiresAt: 1 },
    { expireAfterSeconds: 0 }
)
```

MongoDB automatically deletes expired sessions.

```
Session

↓

expiresAt

↓

TTL Monitor

↓

Deleted
```

This prevents the Session collection from growing indefinitely.

---

# Token Collection

The Token collection stores temporary authentication tokens.

Collection:

```text
tokens
```

Model:

```javascript
Token
```

---

## Purpose

Used for:

- Login OTP
- Password Reset
- Email Verification

Instead of storing tokens inside the Admin collection, they are stored separately.

Advantages:

- Better organization
- Automatic expiration
- Reusable authentication system

---

## Schema Structure

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| userId | ObjectId | ✅ | User reference |
| userType | String | ✅ | Admin or Student |
| token | String | ✅ | Hashed token |
| type | String | ✅ | Token type |
| description | String | ❌ | Optional description |
| expiresAt | Date | ✅ | Expiration time |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

## Token Types

Supported values:

```text
AUTH_OTP

RESET_PASSWORD

VERIFY_EMAIL
```

This makes the Token model reusable.

Instead of creating multiple collections,

```
otpTokens

passwordTokens

emailTokens
```

everything is stored in one place.

---

## Polymorphic Relationship

One interesting feature is:

```javascript
refPath: "userType"
```

Instead of referencing one collection,

```
ref: "Admin"
```

the model dynamically chooses the referenced collection.

Current values:

```
Admin

Student
```

Future models can also use the same Token collection.

---

## Token Security

Tokens are hashed before storage.

Flow:

```text
Generated OTP

↓

bcrypt.hash()

↓

MongoDB
```

Verification:

```text
User Input

↓

bcrypt.compare()

↓

Stored Hash
```

This is similar to password verification.

Even if the database leaks, attackers cannot recover OTP values.

---

## Token Lifecycle

```text
Generate OTP

↓

Hash OTP

↓

Store

↓

Email OTP

↓

User Verifies

↓

Delete Token
```

If the user never verifies,

MongoDB automatically deletes the token using the TTL index.

---

# Student Registration Collection

This collection stores applications submitted by students who want to join the CodeX Club.

Collection:

```text
studentregistrations
```

Model:

```javascript
StudentRegistration
```

---

## Schema Structure

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| name | String | ✅ | Student name |
| fatherName | String | ✅ | Father's name |
| course | String | ✅ | Course |
| year | String | ✅ | Academic year |
| semester | String | ✅ | Semester |
| section | String | ✅ | Section |
| set | String | ✅ | Group |
| studentId | String | ✅ | University ID |
| email | String | ✅ | Student email |
| phone | String | ✅ | Phone number |
| transactionId | String | ✅ | Fee payment reference |
| status | String | ✅ | Registration status |
| createdAt | Date | Auto | Timestamp |
| updatedAt | Date | Auto | Timestamp |

---

## Registration Workflow

```text
Student

↓

Fill Registration Form

↓

Turnstile Verification

↓

Validation

↓

MongoDB

↓

PENDING
```

Administrators later review the request.

```
PENDING

├── APPROVED

└── REJECTED
```

---

## Status Lifecycle

```text
PENDING

↓

Admin Review

↓

APPROVED

or

REJECTED
```

The default status is:

```
PENDING
```

---

## Validation Rules

The schema validates several fields automatically.

### Email

Uses a regular expression to ensure valid email formatting.

---

### Phone Number

Must contain exactly:

```
10 digits
```

---

### Course

Allowed values:

```
B.Tech

M.Tech

BCA

MCA

BBA

MBA

B.Sc

M.Sc
```

---

### Academic Year

Allowed values:

```
1st Year

2nd Year

3rd Year

4th Year
```

---

### Semester

Allowed values:

```
1st

2nd

3rd

4th

5th

6th

7th

8th
```

---

### Transaction ID

Marked as:

```
unique
```

This prevents duplicate payment references.

---

## Why Keep Registrations Separate?

Approved registrations are not converted into user accounts.

Instead, the registration record itself becomes the permanent record.

Advantages:

- Simple workflow
- No unnecessary authentication system
- Easy approval process
- Historical registration records remain available

---

## Authentication Collections Summary

```text
                 Admin
                    │
                    │
             One-to-Many
                    │
                    ▼
                Session
                    │
                    ▼
                 JWT Token
                    │
                    ▼
                 Token
              (OTP Storage)
```

These four collections work together to provide secure administrator authentication and student registration management while keeping authentication data isolated from the rest of the application.

---

**Next:** Part 3 covers the remaining collections (`Event`, `Certificate`, `TeamMember`, and `Contact`), followed by indexes, hooks, schema validation, TTL behavior, common queries, and database best practices.

---

# Event Collection

The **Event** collection stores all club events displayed on the CodeX website.

Each document represents a single event and contains all information required for public display.

Collection:

```text
events
```

Model:

```javascript
Event
```

---

## Schema Structure

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| eventName | String | ✅ | Event title |
| date | Date | ✅ | Event date |
| description | String | ✅ | HTML description |
| coverImage | String | ✅ | Cloudinary image URL |
| registrationLink | String | ❌ | External registration URL |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

---

## Schema Diagram

```text
Event
│
├── eventName
├── date
├── description
├── coverImage
├── registrationLink
├── createdAt
└── updatedAt
```

---

## Description Field

Unlike plain text, the description field stores **HTML**.

Example:

```html
<h2>Hackathon</h2>

<p>Join the biggest coding competition.</p>
```

This allows rich formatting on the frontend.

Possible formatting includes:

- Headings
- Lists
- Images
- Tables
- Links

> **Note**
>
> Since HTML is stored directly in the database, the frontend should sanitize the content before rendering to prevent Cross-Site Scripting (XSS) attacks.

---

## Image Storage

The backend never stores image files inside MongoDB.

Instead, the upload workflow is:

```text
Upload Image

↓

Multer

↓

Cloudinary

↓

Cloudinary URL

↓

MongoDB
```

Only the secure Cloudinary URL is stored in the `coverImage` field.

---

# Certificate Collection

The Certificate collection stores every certificate generated by the system.

Each certificate receives a unique verification identifier.

Collection:

```text
certificates
```

Model:

```javascript
Certificate
```

---

## Schema Structure

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| studentName | String | ✅ | Recipient name |
| studentEmail | String | ✅ | Recipient email |
| eventName | String | ✅ | Event title |
| eventDate | Date | ✅ | Event date |
| coordinatorName | String | ✅ | Certificate signer |
| signatureImage | String | ✅ | Signature image URL |
| certificateId | String | ✅ | Unique verification ID |
| position | String | ✅ | Achievement category |
| issuedAt | Date | Auto | Issue date |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

---

## Certificate Verification

Every generated certificate receives a unique identifier.

```
certificateId

↓

Public Verification API

↓

Certificate Details
```

This allows anyone to verify the authenticity of a certificate without requiring administrator access.

---

## Supported Positions

The schema supports the following values:

```
Participant

Winner

1st Runner-up

2nd Runner-up

Volunteer

Organizer

Other
```

This allows the same certificate template to be reused across different events.

---

## Why Doesn't Certificate Reference StudentRegistration?

The Certificate collection intentionally stores student information directly instead of referencing the StudentRegistration collection.

```
Certificate

↓

Student Name

Student Email

↓

Independent Record
```

Advantages:

- Certificates remain valid even if registrations are deleted.
- No additional database lookups are required.
- Historical records remain immutable.
- Faster verification requests.

This is an example of **data denormalization**, which is a common practice in MongoDB for read-heavy workloads.

---

# TeamMember Collection

The TeamMember collection stores information about the official CodeX team.

Collection:

```text
teammembers
```

Model:

```javascript
TeamMember
```

---

## Schema Structure

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| academicYear | String | ✅ | Academic session |
| subTeam | String | ✅ | Team category |
| name | String | ✅ | Member name |
| post | String | ✅ | Designation |
| photo | String | ✅ | Cloudinary image URL |
| createdAt | Date | Auto | Creation timestamp |
| updatedAt | Date | Auto | Last update timestamp |

---

## Supported Teams

```text
Core Team

Tech Team

Graphic Team
```

Each member belongs to exactly one sub-team.

---

## Academic Year

The application stores team members by academic session.

Example:

```
2024-2025

2025-2026

2026-2027
```

This allows previous executive teams to remain visible without modifying existing documents.

---

# Contact Collection

The Contact collection stores messages submitted through the website's contact form.

Collection:

```text
contacts
```

Model:

```javascript
Contact
```

---

## Schema Structure

| Field | Type | Required | Description |
|--------|------|----------|-------------|
| name | String | ✅ | Sender name |
| email | String | ✅ | Sender email |
| subject | String | ✅ | Message subject |
| message | String | ✅ | Message body |
| isRead | Boolean | Auto | Read status |
| createdAt | Date | Auto | Submission time |
| updatedAt | Date | Auto | Last update time |

---

## Message Workflow

```text
Visitor

↓

Submit Contact Form

↓

MongoDB

↓

Unread

↓

Admin Opens

↓

Read
```

The `isRead` field helps administrators distinguish between new and processed messages.

---

# Database Indexes

Indexes improve query performance by allowing MongoDB to locate documents efficiently.

The CodeX Backend currently uses three important indexes.

---

## Unique Indexes

### Admin Email

```
email

↓

unique
```

Ensures that only one administrator can use a specific email address.

---

### Transaction ID

```
transactionId

↓

unique
```

Prevents duplicate payment references during student registration.

---

### Certificate ID

```
certificateId

↓

unique
```

Ensures every certificate has a globally unique verification identifier.

---

# TTL (Time-To-Live) Indexes

The backend uses MongoDB TTL indexes for automatic cleanup of temporary authentication data.

Current TTL-enabled collections:

- Session
- Token

---

## Session TTL

```
expiresAt

↓

TTL Index

↓

Automatic Deletion
```

Expired sessions are automatically removed by MongoDB.

---

## Token TTL

```
Generate OTP

↓

Store Token

↓

Wait for Expiration

↓

MongoDB Deletes Token
```

This prevents expired OTPs from accumulating over time.

---

## Important Note About TTL

MongoDB does **not** delete expired documents immediately.

A background cleanup process runs approximately every **60 seconds**.

This means an expired document may exist briefly after its expiration time.

Because of this, the application also checks expiration manually during authentication rather than relying solely on the TTL index.

---

# Mongoose Middleware (Hooks)

Hooks execute automatically before or after specific database operations.

The CodeX Backend currently uses **pre-save hooks**.

---

## Admin Hook

Before saving an administrator:

```text
Save Admin

↓

Password Modified?

↓

Yes

↓

Hash Password

↓

Save
```

This guarantees that passwords are never stored in plain text.

---

## Token Hook

Before storing an authentication token:

```text
Generate OTP

↓

Hash OTP

↓

Save
```

This provides the same level of protection as password hashing.

---

# Instance Methods

Some models expose reusable instance methods.

---

## Admin Methods

### isPasswordCorrect()

Compares a plain password with the stored bcrypt hash.

### generateAuthToken()

Creates a signed JWT containing:

- Administrator ID
- Email
- Session ID
- Role

---

## Token Methods

### isTokenCorrect()

Compares a user-provided OTP with the hashed value stored in MongoDB.

---

# Schema Validation

Every schema contains built-in validation rules.

Examples include:

## Required Fields

```javascript
required: true
```

Prevents incomplete documents from being saved.

---

## Email Validation

Uses regular expressions to verify valid email formatting.

Applied to:

- Admin
- Certificate
- Contact
- StudentRegistration

---

## Phone Validation

The StudentRegistration model validates that phone numbers contain exactly ten digits.

---

## Enum Validation

Several fields only allow predefined values.

Examples include:

- Course
- Year
- Semester
- Team
- Certificate Position
- Registration Status
- Token Type

This prevents invalid or inconsistent data from being stored.

---

## Unique Constraints

MongoDB enforces uniqueness for:

- Administrator Email
- Certificate ID
- Transaction ID

Duplicate values result in database errors.

---

# Database Best Practices

The CodeX Backend follows several database design principles.

- Keep collections focused on a single responsibility.
- Store only metadata in MongoDB and keep files in Cloudinary.
- Use schema validation instead of relying solely on frontend validation.
- Automatically remove temporary authentication data using TTL indexes.
- Store passwords and OTPs as bcrypt hashes.
- Minimize relationships between collections.
- Keep frequently accessed documents independent to improve read performance.

---

# Future Improvements

The current schema design is suitable for the existing project, but future enhancements could include:

- Add compound indexes for frequently filtered queries.
- Store Cloudinary `public_id` alongside image URLs to simplify deletion.
- Add soft-delete support for important collections.
- Introduce audit logs for administrator actions.
- Add optimistic concurrency control where required.
- Use MongoDB transactions for complex multi-document operations.
- Add full-text indexes for searching events and contact messages.
- Introduce pagination indexes for large datasets.

---

# Database Summary

The CodeX Backend currently consists of **eight Mongoose models**, each responsible for a specific domain of the application.

Key characteristics of the database architecture include:

- Document-oriented design using MongoDB
- Clear separation of business entities
- Minimal inter-collection dependencies
- Secure password and OTP storage using bcrypt
- Automatic cleanup of temporary data using TTL indexes
- Rich schema validation through Mongoose
- Cloudinary-based media storage
- Scalable, modular, and maintainable collection design

This architecture provides a strong foundation for future growth while keeping the database simple, performant, and easy to maintain.