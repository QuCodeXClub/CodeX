# CodeX

CodeX Website is the official web platform for the CodeX coding club. It provides member registration, event listings, team management, and administrative tools for club organizers.

Live site

The production site for CodeX Club is available at: https://codex.club (replace with the actual URL when deployed).

Table of contents

- [Features](#features)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Quick start](#quick-start)
- [Development notes](#development-notes)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

Features

- Member registration and authentication
- Event creation, listing, and registration management
- Team and role management for club organizers
- Admin dashboard (create/manage events, view registrations)

Project structure

- `Backend/` — Node.js (Express) backend with API routes, models, and services.
- `Frontend/` — React + Vite frontend for public pages and the member/admin portal.
- `Database/` — database-related scripts or snapshots (if present)
- `Testing/` — test-related helpers and test data

Prerequisites

- Node.js >= 18
- npm or yarn

Quick start

1. Clone the repository:

```bash
git clone https://github.com/<your-org>/codex.git
cd codex
```

2. Run the backend:

```bash
cd Backend
npm install
npm start
```

3. Run the frontend in a separate terminal:

```bash
cd Frontend
npm install
npm run dev
```

Development notes

- The Frontend uses Vite and serves on the default Vite port (usually `5173`). The Backend runs via `node src/server.js` by default — update `Backend/src/server.js` to configure ports or environment variables.
- Environment variables: set `DATABASE_URL`, `PORT` (for backend), and any OAuth/JWT secrets as needed in `.env` files (not checked into source).

Contributing

See `CONTRIBUTING.md` for development setup, branch naming, and PR process. Please follow the `CODE_OF_CONDUCT.md` and report security issues as described in `SECURITY.md`.

Security

If you discover a security vulnerability, please follow the instructions in `SECURITY.md` to report it privately.

License

This project is distributed under the terms listed in the `LICENSE` file.

