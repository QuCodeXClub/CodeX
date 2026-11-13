# CodeX QA Test Cases: Certificate Multi-Batch Isolation & 7-Day TTL Recovery

**Target Release / Branch:** `bagfix-mongoDB`  
**Module:** Bulk Certificate Issuance, Batch Lifecycle, & 7-Day TTL Recovery Vault  
**Author:** CodeX Core Engineering  
**Audience:** Junior Developers, QA Engineers, and System Testers  

---

## 1. Test Objectives
1. Verify that creating, updating, approving, or rejecting a certificate batch with the **exact same event name and event date** has **zero effect** on any other approved batch or its active certificates.
2. Verify that deleting a certificate, rejecting a batch, or editing a batch triggers a **Soft Delete with 7-Day MongoDB TTL** instead of immediate data loss.
3. Verify that only **Super Admins** can view, restore, or permanently purge certificates in the **7-Day Trash & Recovery** vault.
4. Verify that public verification (`/verify-certificate/:id`) immediately revokes access for soft-deleted certificates.
5. Verify that duplicate emails in CSV uploads or manual student rosters are cleanly deduplicated with no job crashes or counter drift.

---

## 2. Test Environment & Prerequisites
- **Frontend URL:** `http://localhost:5173` (or staging URL)
- **Backend API:** `http://localhost:8000/api/v1` (or staging API)
- **Database:** MongoDB 5.0+ with replica set / local instance
- **Test Accounts Needed:**
  - `admin@codex.community` (Role: **Admin**)
  - `superadmin@codex.community` (Role: **SuperAdmin**)

---

## 3. Test Cases Summary Matrix

| Case ID | Title | Priority | Target Area |
|---|---|---|---|
| **TC-CERT-01** | Multi-Batch Creation (Same Event Name & Date) | Critical | Isolation |
| **TC-CERT-02** | Supplementary Batch Edit Does NOT Affect Main Batch | Critical (Regression) | Bug Fix Verification |
| **TC-CERT-03** | Batch Rejection Soft-Deletes Strictly Owned Certificates | Critical | Soft-Delete Scope |
| **TC-CERT-04** | Public Verification Revocation on Soft Delete | High | Security / Integrity |
| **TC-CERT-05** | Super Admin 1-Click Restore from 7-Day Trash | High | Recovery Vault |
| **TC-CERT-06** | Super Admin Immediate Hard-Delete & Empty Trash | Medium | TTL Bypass |
| **TC-CERT-07** | Duplicate Student Email Deduplication in CSV Import | High | Concurrency / Queue |
| **TC-CERT-08** | Unauthorized Admin Access Blocked on Trash Vault | High | RBAC Security |

---

## 4. Detailed Test Cases

### TC-CERT-01: Multi-Batch Creation (Same Event Name & Date)
* **Goal:** Confirm that multiple batches can be created with identical event names and dates without collision.
* **Steps:**
  1. Log in as Super Admin (`superadmin@codex.community`).
  2. Go to **Bulk Certificates** > **Direct Certificate Issuance**.
  3. Fill in:
     - **Event Name:** `CodeX Orientation 2026`
     - **Event Date:** `2026-09-03`
     - **Coordinator:** `Parul Tyagi`
     - **Students:** Add 3 students:
       - Student 1: `Alice Green` (`alice.test@codex.community`)
       - Student 2: `Bob White` (`bob.test@codex.community`)
       - Student 3: `Charlie Brown` (`charlie.test@codex.community`)
     - Upload a sample signature image PNG.
  4. Click **Issue Certificates**.
  5. Go to **Approval Requests & Batches** tab.
* **Expected Result:**
  - Batch 1 is created with status `COMPLETED` (or `PROCESSING` -> `COMPLETED`).
  - Total 3 certificates generated.
  - Verification links work for Alice, Bob, and Charlie.

---

### TC-CERT-02: Supplementary Batch Edit Does NOT Affect Main Batch (REGRESSION FIX)
* **Goal:** Verify that editing a second batch with the same event name and date does **NOT** delete or alter Batch 1's certificates.
* **Pre-condition:** `TC-CERT-01` is completed and Batch 1 has 3 active certificates.
* **Steps:**
  1. While logged in as Admin (`admin@codex.community`):
  2. Create Batch 2 with the **EXACT SAME** details:
     - **Event Name:** `CodeX Orientation 2026`
     - **Event Date:** `2026-09-03`
     - **Coordinator:** `Parul Tyagi`
     - **Students:** Add 2 late students:
       - Student 4: `David Miller` (`david.test@codex.community`)
       - Student 5: `Emma Watson` (`emma.test@codex.community`)
  3. Submit Batch 2. Its status will be `PENDING_APPROVAL`.
  4. Now, click **Edit** (pencil icon) on Batch 2.
  5. In the Edit modal:
     - Change coordinator name to `Parul Tyagi (Updated)`.
     - Add a 6th student: `Frank Ocean` (`frank.test@codex.community`).
  6. Click **Save Changes**.
  7. Check MongoDB or refresh the dashboard:
     - Query: `db.certificates.find({ eventName: "CodeX Orientation 2026" })`
* **Expected Result:**
  - **Batch 1 certificates for Alice, Bob, and Charlie REMAIN 100% ACTIVE and VERIFIABLE.**
  - Batch 1 `generatedCount` remains `3`.
  - Batch 2 resets to `PENDING_APPROVAL` with 3 students (David, Emma, Frank).
  - ZERO certificates from Batch 1 were deleted or moved to trash.

---

### TC-CERT-03: Batch Rejection Soft-Deletes Strictly Owned Certificates
* **Goal:** Confirm that rejecting a batch only affects certificates belonging to that specific batch ID.
* **Steps:**
  1. Log in as Super Admin.
  2. Go to **Approval Requests & Batches**.
  3. Locate Batch 2 (`PENDING_APPROVAL`).
  4. First click **Approve** on Batch 2. Wait until status becomes `COMPLETED` (3 certificates generated for David, Emma, Frank).
  5. Now click **Reject** on Batch 2 with reason: `"Late roster cancelled by coordinator"`.
  6. Confirm the rejection dialog.
* **Expected Result:**
  - Batch 2 status changes to `REJECTED`.
  - Only David, Emma, and Frank's certificates are soft-deleted into the 7-day trash vault.
  - **Batch 1 (Alice, Bob, Charlie) remains completely COMPLETED and untouched.**

---

### TC-CERT-04: Public Verification Revocation on Soft Delete
* **Goal:** Confirm that a soft-deleted certificate cannot be verified by students or third parties.
* **Steps:**
  1. Copy the `certificateId` of David Miller (soft-deleted in `TC-CERT-03`).
  2. Open an incognito browser tab without logging into Admin.
  3. Navigate to: `http://localhost:5173/verify-certificate/<DAVID_CERT_ID>`.
  4. In a separate tab, open Alice Green's verification URL: `http://localhost:5173/verify-certificate/<ALICE_CERT_ID>`.
* **Expected Result:**
  - David's link displays: **"Invalid Certificate"** or `"Certificate not found or has been revoked"`.
  - Alice's link renders the authentic SVG certificate with green **"Verified Credential"** badge.

---

### TC-CERT-05: Super Admin 1-Click Restore from 7-Day Trash Vault
* **Goal:** Confirm that a Super Admin can restore a soft-deleted certificate back to active status with 1 click.
* **Steps:**
  1. Log in as Super Admin.
  2. Go to **Bulk Certificates** > **"7-Day Trash & Recovery"** tab.
  3. Observe the counter badge showing `3` items in trash.
  4. Verify the row for `David Miller`:
     - Displays `Event: CodeX Orientation 2026`
     - Displays `Reason: Batch #... rejected: Late roster cancelled by coordinator`
     - Displays TTL Countdown badge: `⏳ 6d 23h remaining auto-purged by TTL`
  5. Click the green **"Restore"** button on David Miller's row.
  6. Refresh the incognito tab for David Miller's verification URL.
* **Expected Result:**
  - David Miller's certificate disappears from the Trash vault.
  - David Miller's verification URL immediately starts working again and displays the verified certificate.

---

### TC-CERT-06: Super Admin Immediate Hard-Delete & Empty Trash
* **Goal:** Verify that a Super Admin can bypass the 7-day TTL and permanently erase documents immediately.
* **Steps:**
  1. In the **"7-Day Trash & Recovery"** tab, locate Emma Watson's row.
  2. Click the red **Trash Can** icon (Permanent Delete).
  3. Confirm the browser prompt warning: `"⚠️ PERMANENT DELETE WARNING: This will bypass the 7-day TTL and CANNOT be undone."`
  4. Click **"Empty Trash"** at the top right of the section to purge all remaining items.
  5. Confirm the bulk purge prompt.
  6. Check MongoDB: `db.certificates.countDocuments({ isDeleted: true })`.
* **Expected Result:**
  - All trash items are permanently deleted from MongoDB (`countDocuments === 0`).
  - Section displays empty state: `"Trash is Empty"`.

---

### TC-CERT-07: Duplicate Student Email Deduplication in CSV Import
* **Goal:** Verify that CSVs with duplicate student rows are deduplicated to prevent queue race conditions and counter mismatches.
* **Steps:**
  1. Create a test CSV named `duplicate_test.csv`:
     ```csv
     Name,Email,Position
     John Doe,john@test.com,Participant
     Jane Smith,jane@test.com,Winner
     John Doe Duplicate,john@test.com,Participant
     Alex Brown,alex@test.com,Runner Up
     Jane Smith Duplicate,jane@test.com,Winner
     ```
  2. Go to **Bulk Certificates** > **Direct Certificate Issuance**.
  3. Click **Import CSV** and select `duplicate_test.csv`.
* **Expected Result:**
  - Success toast displays: `"Successfully imported 3 unique student(s) from CSV (2 duplicate email(s) deduplicated)."`
  - Only 3 student rows are added to the form (John Doe, Jane Smith, Alex Brown).
  - Generating this batch creates exactly 3 certificates (`studentCount: 3, generatedCount: 3, failedCount: 0`).

---

### TC-CERT-08: RBAC Security — Standard Admin Cannot Access Trash Vault
* **Goal:** Confirm that standard Admins cannot see or manipulate soft-deleted certificates.
* **Steps:**
  1. Log in as a standard Admin (`admin@codex.community`).
  2. Go to **Bulk Certificates**.
  3. Check the tab bar.
  4. Try manually navigating to `http://localhost:5173/admin/certificates?tab=trash`.
  5. Attempt an API call using Postman/curl:
     ```bash
     curl -X GET http://localhost:8000/api/v1/certificates/trash \
       -H "Authorization: Bearer <STANDARD_ADMIN_TOKEN>"
     ```
* **Expected Result:**
  - The **"7-Day Trash & Recovery"** tab is completely hidden in the UI.
  - Navigating to `?tab=trash` shows an **"Access Restricted - Super Admin Only"** screen.
  - The API responds with `403 Forbidden` (`"Super Admin privilege required"`).

---

## 5. Sign-Off Checklist for QA / Junior Developer

- [ ] TC-CERT-01 Passed: Multi-batch creation succeeded.
- [ ] TC-CERT-02 Passed: Editing Batch 2 caused ZERO side-effects on Batch 1.
- [ ] TC-CERT-03 Passed: Rejecting Batch 2 only moved Batch 2 certificates to trash.
- [ ] TC-CERT-04 Passed: Soft-deleted certificates cannot be publicly verified.
- [ ] TC-CERT-05 Passed: Restoring a certificate from trash restores verification instantly.
- [ ] TC-CERT-06 Passed: Hard-delete permanently removes document from MongoDB.
- [ ] TC-CERT-07 Passed: Duplicate emails in CSV are deduplicated prior to generation.
- [ ] TC-CERT-08 Passed: Standard Admins are blocked from accessing the trash vault.

**Tester Signature:** ____________________  
**Date:** ____________________  
**Build / Git Commit:** `bagfix-mongoDB`  

