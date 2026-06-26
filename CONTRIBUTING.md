# Contributing to CodeX

Thank you for contributing to the CodeX Club website. This document explains how to set up a development environment, the workflow for contributing changes, and the expectations for code, tests, and documentation.

1) Getting the code

```bash
git clone https://github.com/<your-org>/codex.git
cd codex
```

2) Running locally

- Backend:

```bash
cd Backend
npm install
npm start
```

- Frontend (in a separate terminal):

```bash
cd Frontend
npm install
npm run dev
```

3) Branches and commits

- Use feature branches: `feature/short-description` or `fix/short-description`.
- Keep commits small and focused; write clear commit messages.

4) Code style

- Follow existing code conventions. The frontend uses ESLint (`npm run lint`).
- Run linters and fix issues before opening a PR.

5) Tests

- Add unit or integration tests for new features or bug fixes. Place tests and fixtures under `Testing/` where applicable.

6) Pull requests

- Open a PR against `main` (or your project's default branch) with a descriptive title and summary.
- Fill the PR template that best matches your change (feature, bugfix, docs, chore, release).
- Link related issues and include screenshots or API examples when relevant.

7) Review process

- PRs should receive at least one approving review before merging.
- Address review comments with follow-up commits; keep the PR up to date with the base branch.

8) Security

- Do not commit secrets (API keys, tokens). Use environment variables and add them to `.env` files which must not be checked in.
- Report security issues privately as described in `SECURITY.md`.

Thank you for improving CodeX — contributions make the club better for everyone.
