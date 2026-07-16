# CodeX

CodeX Website is the official web platform for the CodeX coding club. It provides member registration, event listings, team management, and administrative tools for club organizers.

Live site

The production site for CodeX Club is available at: https://codex.club (replace with the actual URL when deployed).

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Development Notes](#development-notes)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

## Features

- Member registration and authentication
- Event creation, listing, and registration management
- Team and role management for club organizers
- Admin dashboard (create/manage events, view registrations)

## Project Structure

- [`Backend/`](./Backend/README.md) — Node.js (Express) backend with API routes, models, and services.
- [`Frontend/`](./Frontend/README.md) — React + Vite frontend for public pages and the member/admin portal.
- [`Database/`](./Database/README.md) — Database-related scripts, schemas, and snapshots.
- [`Testing/`](./Testing/README.md) — Test-related helpers and test data.
- [`UI/`](./UI/README.md) — Design mockups, assets, and other UI materials.
- [`docs/`](./docs/README.md) — Comprehensive project documentation (architecture, API, database).

## Prerequisites

- Node.js >= 18
- npm or yarn
- Docker & Docker Compose (optional, but recommended for full-stack runs)
- MongoDB Atlas account (or use the provided local Docker MongoDB)
- Cloudinary account (for image uploads)

## Quick Start

### Method 1: Using Docker (Recommended)

The easiest way to run the entire stack (Frontend, Backend, and MongoDB) is with Docker Compose.

1. Clone the repository:
```bash
git clone https://github.com/QuCodeXClub/CodeX.git
cd CodeX
```

2. Configure environment variables:
Copy `Backend/.env.sample` to `Backend/.env` and fill in your Cloudinary credentials (the `MONGODB_URI` will automatically be overridden by Docker).

3. Start the application:
```bash
docker-compose up --build
```
- Frontend will be at `http://localhost:5173`
- Backend API will be at `http://localhost:5000`
- MongoDB will run locally on port `27017`

---

### Method 2: Running Locally (Native npm)

1. **Backend Setup**:
```bash
cd Backend
cp .env.sample .env  # Fill in your MONGODB_URI and Cloudinary keys
npm install
npm run dev
```

2. **Frontend Setup**:
Open a new terminal:
```bash
cd Frontend
npm install
npm run dev
```

## Development Notes

- The Frontend uses Vite and serves on `5173`. The Backend runs via `nodemon` on `5000`.
- Environment variables: Must be set in `Backend/.env` (MongoDB, Cloudinary, CORS).
- For a more detailed backend setup, please refer to the [Backend README](./Backend/README.md).

## Contributing

See `CONTRIBUTING.md` for development setup, branch naming, and PR process. Please follow the `CODE_OF_CONDUCT.md` and report security issues as described in `SECURITY.md`.

## Security

If you discover a security vulnerability, please follow the instructions in `SECURITY.md` to report it privately.

## License

This project is distributed under the terms listed in the `LICENSE` file.

