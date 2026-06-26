# Frontend — CodeX Website

This folder contains the React + Vite frontend for the CodeX Club website. It provides the public landing pages, event listings, and the member/admin portal UI.

Getting started

Requirements:
- Node.js >= 18
- npm (or yarn)

Install dependencies and run the development server:

```bash
cd Frontend
npm install
npm run dev
```

Available scripts (see `package.json`):
- `dev` — start Vite development server with HMR
- `build` — build production assets
- `preview` — preview the production build
- `lint` — run ESLint on the codebase

Environment variables

- Use `.env` or `.env.local` to set any frontend-specific variables (API base URL, analytics keys, etc.). Typical variables:
	- `VITE_API_BASE_URL` — Backend API base URL (e.g., `http://localhost:3000/api`)

Build & deploy

```bash
npm run build
npm run preview
```

Testing & linting

- Lint: `npm run lint`
- There are no automated tests included by default; please add unit or integration tests under `Testing/` and update CI accordingly.

Contributing

See the root `CONTRIBUTING.md` for guidance on running the full stack locally and contributing changes.

