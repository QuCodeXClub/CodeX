# CodeX — Branching Strategy

> **CodeX | Coding the Future, Today.**

This document defines the Git branching strategy, naming conventions, Pull Request workflow, and release process used by the **CodeX** project.

The goal is to keep development organized, protect production code, and make collaboration between contributors safe and predictable.

---

## 1. Branch Structure

CodeX follows a structured Git workflow with the following branches:

```text
main
│
├── develop
│
├── feature/*
├── bugfix/*
├── hotfix/*
└── release/*
```

### Branch Overview

| Branch      | Purpose                               | Environment           |
| ----------- | ------------------------------------- | --------------------- |
| `main`      | Stable production code                | Production            |
| `develop`   | Integration of upcoming changes       | Development / Staging |
| `feature/*` | New features                          | Development           |
| `bugfix/*`  | Non-critical bug fixes                | Development           |
| `hotfix/*`  | Critical production fixes             | Production            |
| `release/*` | Release preparation and final testing | Staging               |

---

# 2. Main Branches

## `main`

The `main` branch contains **production-ready code**.

### Rules

* No direct pushes.
* Changes must be merged through a Pull Request.
* All required CI/CD checks must pass.
* Production deployments are made from this branch.
* Stable releases should be tagged.

Example:

```text
v1.0.0
v1.1.0
v1.2.0
```

### Flow

```text
develop
   ↓
release/*
   ↓
main
   ↓
Production
```

---

## `develop`

The `develop` branch is the **primary development and integration branch**.

All completed features and normal bug fixes should be merged into `develop` before being released to production.

### Rules

* Do not directly push unless explicitly permitted.
* New work should start from the latest `develop`.
* Features should be tested before merging.
* Only stable code should be promoted to `main`.

### Flow

```text
feature/*
    ↓
develop
    ↓
release/*
    ↓
main
```

---

# 3. Supporting Branches

## Feature Branches

Feature Branches are used for implementing new functionality.

### Naming Convention

```text
feature/<feature-name>
```

### Examples

```text
feature/payment-gateway
feature/cloudflare-turnstile
feature/admin-dashboard
feature/user-authentication
feature/event-registration
```

### Workflow

```bash
git checkout develop
git pull origin develop

git checkout -b feature/payment-gateway
```

After completing the feature:

```text
feature/payment-gateway
          ↓
        develop
```

Create a Pull Request targeting `develop`.

---

# 4. Bug Fix Branches

Use `bugfix/*` for fixing normal bugs that are discovered during development or testing.

### Naming Convention

```text
bugfix/<bug-name>
```

### Examples

```text
bugfix/session-expiry
bugfix/login-redirect
bugfix/mobile-navbar
bugfix/image-upload
bugfix/attendance-validation
```

### Workflow

```text
bugfix/*
    ↓
develop
```

Create a Pull Request targeting `develop`.

---

# 5. Hotfix Branches

Hotfix branches are reserved for **critical issues affecting production**.

Examples include:

* Security vulnerabilities
* Production authentication failures
* Critical API failures
* Payment failures
* Data integrity issues
* Major production crashes

### Naming Convention

```text
hotfix/<issue-name>
```

### Examples

```text
hotfix/security-patch
hotfix/payment-failure
hotfix/authentication-error
hotfix/production-crash
```

### Workflow

```text
             ┌──→ main
             │
hotfix/* ────┤
             │
             └──→ develop
```

A hotfix should be merged into both `main` and `develop` so the fix is not lost from future development.

---

# 6. Release Branches

Release branches are used when preparing a production release.

### Naming Convention

```text
release/v<version>
```

### Examples

```text
release/v1.0.0
release/v1.1.0
release/v1.2.0
```

A release branch is created from `develop`.

```text
develop
   ↓
release/v1.2.0
   ↓
Testing / QA
   ↓
main
```

Once the release is stable:

1. Merge the release branch into `main`.
2. Create a Git tag.
3. Deploy to production.
4. Merge the release branch back into `develop`.

---

# 7. Complete Branch Flow

The standard CodeX development flow is:

```text
                         ┌───────────────┐
                         │     main      │
                         │  Production   │
                         └───────▲───────┘
                                 │
                          release/vX.X.X
                                 ▲
                                 │
                         ┌───────┴───────┐
                         │    develop    │
                         │  Development  │
                         └───────▲───────┘
                                 │
                ┌────────────────┼────────────────┐
                │                │                │
          feature/*         bugfix/*         hotfix/*
                │                │                │
                └────────────────┴────────────────┘
```

---

# 8. Branch Naming Rules

Branch names should be:

* Lowercase.
* Descriptive.
* Short but meaningful.
* Written using kebab-case.
* Prefixed according to the branch type.

### Correct

```text
feature/payment-gateway
feature/cloudflare-turnstile
bugfix/session-expiry
hotfix/security-patch
release/v1.2.0
```

### Avoid

```text
Feature/NewPayment
payment
new-feature
mybranch
test
fix
changes
TusharBranch
```

---

# 9. Pull Request Rules

All changes should be reviewed through Pull Requests.

### Pull Request Requirements

Before creating a PR:

* Ensure the branch is up to date.
* Test the changes locally.
* Run linting.
* Run automated tests where available.
* Ensure the production build succeeds.
* Resolve merge conflicts.
* Write a clear PR description.

### Target Branch

Normal development:

```text
feature/* → develop
bugfix/*  → develop
```

Production release:

```text
release/* → main
```

Emergency production fix:

```text
hotfix/* → main
hotfix/* → develop
```

---

# 10. Commit Message Convention

CodeX should use clear and consistent commit messages.

Recommended format:

```text
<type>: <description>
```

### Common Types

| Type       | Usage                    |
| ---------- | ------------------------ |
| `feat`     | New feature              |
| `fix`      | Bug fix                  |
| `docs`     | Documentation            |
| `style`    | Formatting/style changes |
| `refactor` | Code refactoring         |
| `perf`     | Performance improvement  |
| `test`     | Tests                    |
| `chore`    | Maintenance              |
| `security` | Security-related changes |

### Examples

```text
feat: add payment gateway
fix: resolve session expiry issue
docs: update branching strategy
refactor: simplify authentication middleware
security: improve turnstile verification
chore: update dependencies
```

---

# 11. Keeping Branches Updated

Before starting new work, update your local `develop` branch:

```bash
git checkout develop
git pull origin develop
```

Then create your feature branch:

```bash
git checkout -b feature/<feature-name>
```

Before creating a Pull Request, update your branch with the latest changes from `develop`.

---

# 12. Production Protection

The `main` branch should be protected.

Recommended GitHub branch protection rules:

* Require Pull Request before merging.
* Require at least one reviewer.
* Require status checks to pass.
* Require branch to be up to date before merging.
* Prevent force pushes.
* Prevent branch deletion.
* Prevent direct pushes.
* Require successful production build.
* Require security checks where available.

---

# 13. Versioning

CodeX production releases should follow **Semantic Versioning**:

```text
MAJOR.MINOR.PATCH
```

Example:

```text
v1.0.0
```

### Version Types

**MAJOR**

Breaking changes:

```text
v1.0.0 → v2.0.0
```

**MINOR**

New backwards-compatible functionality:

```text
v1.0.0 → v1.1.0
```

**PATCH**

Bug or security fixes:

```text
v1.1.0 → v1.1.1
```

---

# 14. Example Development Workflow

### Step 1 — Update develop

```bash
git checkout develop
git pull origin develop
```

### Step 2 — Create a feature branch

```bash
git checkout -b feature/event-registration
```

### Step 3 — Develop and commit

```bash
git add .
git commit -m "feat: add event registration"
```

### Step 4 — Push

```bash
git push -u origin feature/event-registration
```

### Step 5 — Create Pull Request

```text
feature/event-registration
          ↓
       develop
```

### Step 6 — Release

When the release is ready:

```text
develop
   ↓
release/v1.2.0
   ↓
QA / Testing
   ↓
main
   ↓
Production
```

---

# 15. Quick Reference

```text
main
└── Production

develop
└── Development / Integration

feature/*
└── New functionality

bugfix/*
└── Normal bug fixes

hotfix/*
└── Critical production fixes

release/*
└── Production release preparation
```

### Standard CodeX Flow

```text
New Feature
    ↓
feature/*
    ↓
develop
    ↓
release/vX.X.X
    ↓
main
    ↓
Production
```

### Emergency Fix

```text
Production Issue
       ↓
   hotfix/*
       ↓
      main
       ↓
  Production

       +
       ↓

    develop
```

---

## 16. Golden Rules

> **1. Never push directly to `main`.**

> **2. Always create a branch for your work.**

> **3. Use meaningful branch names.**

> **4. Keep Pull Requests focused and reviewable.**

> **5. Test before merging.**

> **6. Keep `develop` stable.**

> **7. Use `hotfix/*` only for critical production issues.**

> **8. Tag production releases using semantic versioning.**

> **9. Delete merged feature branches.**

> **10. Never commit secrets, API keys, passwords, or `.env` files to Git.**

---

**CodeX — Coding the Future, Today.**

This branching strategy is designed to keep CodeX development clean, collaborative, secure, and production-ready.
