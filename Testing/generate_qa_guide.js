import { jsPDF } from "../Frontend/node_modules/jspdf/dist/jspdf.es.min.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize document: A4 portrait (210 x 297 mm)
const doc = new jsPDF({
  orientation: "portrait",
  unit: "mm",
  format: "a4",
});

const pageWidth = 210;
const pageHeight = 297;
const margin = 14;
const contentWidth = pageWidth - margin * 2; // 182mm

let currentPage = 1;
const totalPages = 5;

// Color Palette
const COLORS = {
  primary: [15, 23, 42],       // #0f172a Deep Slate / Navy
  accent: [2, 132, 199],       // #0284c7 Sky Blue
  accentCyan: [6, 182, 212],   // #06b6d4 CodeX Cyan
  textDark: [30, 41, 59],      // #1e293b Charcoal
  textMuted: [100, 116, 139],  // #64748b Slate Muted
  bgLight: [248, 250, 252],    // #f8fafc Light Gray
  border: [226, 232, 240],     // #e2e8f0 Border Gray
  success: [22, 163, 74],      // #16a34a Green
  warning: [217, 119, 6],      // #d97706 Amber
  danger: [220, 38, 38],       // #dc2626 Red
  white: [255, 255, 255],
};

// Helper: Draw Header & Footer on each page
function drawHeaderFooter(doc, pageNum, pageTitle) {
  // Top Header Banner
  doc.setFillColor(...COLORS.primary);
  doc.rect(0, 0, pageWidth, 16, "F");

  // Accent Line
  doc.setFillColor(...COLORS.accentCyan);
  doc.rect(0, 16, pageWidth, 1.2, "F");

  // Header Text
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...COLORS.white);
  doc.text("CODEX TECHNICAL CLUB  |  QA TEST VERIFICATION GUIDE", margin, 10.5);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...COLORS.accentCyan);
  doc.text("RELEASE: v2.4.0-PROD", pageWidth - margin, 10.5, { align: "right" });

  // Bottom Footer
  doc.setFillColor(...COLORS.bgLight);
  doc.rect(0, pageHeight - 12, pageWidth, 12, "F");
  doc.setDrawColor(...COLORS.border);
  doc.line(0, pageHeight - 12, pageWidth, pageHeight - 12);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.textMuted);
  doc.text("Branch: feat/super-admin-and-production-certificates | CodeX Quality Assurance Manual", margin, pageHeight - 5);
  doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth - margin, pageHeight - 5, { align: "right" });
}

// Helper: Section Title
function drawSectionTitle(doc, y, title, subtitle) {
  doc.setFillColor(...COLORS.accent);
  doc.rect(margin, y, 3, 9, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...COLORS.primary);
  doc.text(title, margin + 6, y + 6.5);

  if (subtitle) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...COLORS.textMuted);
    doc.text(subtitle, margin + 6, y + 11.5);
    return y + 15;
  }
  return y + 11;
}

// Helper: Draw Test Case Card
function drawTestCaseCard(doc, y, tc) {
  const cardHeight = tc.height || 36;

  // Background box
  doc.setFillColor(...COLORS.bgLight);
  doc.setDrawColor(...COLORS.border);
  doc.roundedRect(margin, y, contentWidth, cardHeight, 1.5, 1.5, "FD");

  // Left indicator pill
  doc.setFillColor(...(tc.badgeColor || COLORS.accent));
  doc.roundedRect(margin + 2, y + 2.5, 24, 5.5, 1, 1, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.white);
  doc.text(tc.id, margin + 14, y + 6.2, { align: "center" });

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.8);
  doc.setTextColor(...COLORS.primary);
  doc.text(tc.title, margin + 29, y + 6.5);

  // Checkbox box
  doc.setDrawColor(...COLORS.border);
  doc.setFillColor(...COLORS.white);
  doc.rect(pageWidth - margin - 22, y + 2.5, 20, 6, "FD");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(6.5);
  doc.setTextColor(...COLORS.textMuted);
  doc.text("[ ] PASS  [ ] FAIL", pageWidth - margin - 12, y + 6.6, { align: "center" });

  let curY = y + 11;

  // Prerequisites / Target
  if (tc.target) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(...COLORS.textDark);
    doc.text("Route / Target:", margin + 4, curY);
    doc.setFont("courier", "bold");
    doc.setTextColor(...COLORS.accent);
    doc.text(tc.target, margin + 26, curY);
    curY += 4.5;
  }

  // Steps
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.textDark);
  doc.text("Execution Steps:", margin + 4, curY);
  curY += 3.8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(...COLORS.textDark);
  for (const step of tc.steps) {
    doc.text(`• ${step}`, margin + 6, curY);
    curY += 3.5;
  }

  // Expected Result
  curY += 0.5;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(...COLORS.success);
  doc.text("Expected Result:", margin + 4, curY);
  curY += 3.5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.2);
  doc.setTextColor(...COLORS.textDark);
  doc.text(tc.expected, margin + 6, curY, { maxWidth: contentWidth - 12 });

  return y + cardHeight + 3.5;
}

// ==========================================
// PAGE 1: COVER & OVERVIEW + AUTH TEST CASES
// ==========================================
drawHeaderFooter(doc, 1);

// Title Box
doc.setFillColor(...COLORS.bgLight);
doc.setDrawColor(...COLORS.accentCyan);
doc.roundedRect(margin, 22, contentWidth, 32, 2, 2, "FD");

doc.setFont("helvetica", "bold");
doc.setFontSize(16);
doc.setTextColor(...COLORS.primary);
doc.text("CodeX Quality Assurance Test Plan", margin + 6, 31);

doc.setFont("helvetica", "bold");
doc.setFontSize(9.5);
doc.setTextColor(...COLORS.accent);
doc.text("Release v2.4.0 — Super Admin Security, Rate Limiting, Certificate Engine & SEO", margin + 6, 37.5);

doc.setFont("helvetica", "normal");
doc.setFontSize(7.8);
doc.setTextColor(...COLORS.textMuted);
doc.text(
  "This document serves as the formal test verification guide for the QA testing team. It details test scenarios, step-by-step reproduction instructions, expected outcomes, and acceptance criteria for all features in branch 'feat/super-admin-and-production-certificates'.",
  margin + 6,
  43,
  { maxWidth: contentWidth - 12 }
);

// Metadata Grid Table
const metaY = 58;
doc.setFillColor(...COLORS.primary);
doc.rect(margin, metaY, contentWidth, 6, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(7.5);
doc.setTextColor(...COLORS.white);
doc.text("TEST ENVIRONMENT & EXECUTION METADATA", margin + 4, metaY + 4.2);

const metaRows = [
  ["Target Branch:", "feat/super-admin-and-production-certificates", "Target OS / Platform:", "Windows / Linux / Docker Node v24"],
  ["Frontend URL:", "http://localhost:5173", "Backend API URL:", "http://localhost:5000 /api/v1"],
  ["Default Admin Role:", "Super Administrator (Root Console)", "Rate Limit Baseline:", "Tiered Token Bucket (HTTP 429)"],
  ["Brand Tagline:", "Coding the Future, Today.", "QA Lead / Tester:", "Assigned QA Engineer (Sign-off on P.5)"],
];

let rowY = metaY + 6;
doc.setFontSize(7.2);
for (let i = 0; i < metaRows.length; i++) {
  doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
  doc.rect(margin, rowY, contentWidth, 5.5, "F");
  doc.setDrawColor(...COLORS.border);
  doc.line(margin, rowY + 5.5, margin + contentWidth, rowY + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.textDark);
  doc.text(metaRows[i][0], margin + 3, rowY + 3.8);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.accent);
  doc.text(metaRows[i][1], margin + 28, rowY + 3.8);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.textDark);
  doc.text(metaRows[i][2], margin + 105, rowY + 3.8);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textMuted);
  doc.text(metaRows[i][3], margin + 138, rowY + 3.8);

  rowY += 5.5;
}

// SECTION 1: HARDENED ADMIN MFA & AUTHENTICATION
let curY = drawSectionTitle(
  doc,
  rowY + 5,
  "1. Hardened Two-Step Admin Authentication & MFA Telemetry",
  "Verifies timing-attack mitigation, single-input OTP UX, live attempts telemetry, and lockout rules."
);

curY = drawTestCaseCard(doc, curY, {
  id: "TC-AUTH-01",
  title: "Step 1: Admin Credentials Validation & Timing Attack Defense",
  target: "/admin/login (Step 1 Form)",
  badgeColor: COLORS.accent,
  height: 38,
  steps: [
    "Navigate to http://localhost:5173/admin/login in an incognito window.",
    "Submit an un-registered email address (e.g., non-existent@codex.com) with an arbitrary password.",
    "Submit an invalid password for a registered administrator account.",
  ],
  expected:
    "System returns uniform response times without leaking whether the account exists (via pre-computed dummy bcrypt hash). UI displays clear, non-revealing error message. Password field remains masked.",
});

curY = drawTestCaseCard(doc, curY, {
  id: "TC-AUTH-02",
  title: "Step 2: Clean 6-Digit MFA Input, Typing & Clipboard Auto-Paste",
  target: "/admin/login (Step 2 OTP Transition)",
  badgeColor: COLORS.accent,
  height: 42,
  steps: [
    "Log in with valid admin credentials. Verify smooth transition to Step 2 OTP card.",
    "Confirm the screen displays a single centered input field: [ KeyRound | •••••• ].",
    "Type a 6-digit OTP code directly using numeric keyboard. Confirm digits advance cleanly.",
    "Clear field, copy an OTP (e.g. '123456') from clipboard and paste with Ctrl+V.",
  ],
  expected:
    "Pasted text is auto-trimmed, formatted, and triggers automatic form verification without manual enter/click. Clunky 6-box input and duplicate card stacking are completely gone.",
});

curY = drawTestCaseCard(doc, curY, {
  id: "TC-AUTH-03",
  title: "Live Remaining Attempt Telemetry & Inline Change Email Flow",
  target: "/admin/login (Step 2 OTP Card)",
  badgeColor: COLORS.warning,
  height: 38,
  steps: [
    "Enter an incorrect 6-digit code on Step 2 and submit.",
    "Inspect the dynamic counter beside the label and the banner: 'X of 5 attempts remaining'.",
    "Click the inline '← Change email' button.",
  ],
  expected:
    "System smoothly transitions back to Step 1 email/password card without page reload or stale session tokens. Counter persists remaining quota accurately.",
});

// ==========================================
// PAGE 2: AUTH LOCKOUT + RATE LIMITING + CERT DELETION
// ==========================================
doc.addPage();
drawHeaderFooter(doc, 2);

curY = 24;

curY = drawTestCaseCard(doc, curY, {
  id: "TC-AUTH-04",
  title: "Brute-Force Lockout Defense (5 Consecutive Failed Attempts)",
  target: "/admin/login (Step 2 OTP Security Threshold)",
  badgeColor: COLORS.danger,
  height: 40,
  steps: [
    "Enter 5 consecutive invalid OTP codes on the active admin session.",
    "Observe error state on the 5th failed submission.",
    "Attempt to submit another OTP code immediately.",
  ],
  expected:
    "Account/session is placed in a 15-minute brute-force lockout. System blocks further submissions, surfaces a high-severity red lockout banner, and invalidates the pending OTP secret.",
});

// SECTION 2: RATE LIMITING & COOLDOWN
curY = drawSectionTitle(
  doc,
  curY + 2,
  "2. Enterprise Rate Limiting & HTTP 429 Cooldown Banners",
  "Verifies structured HTTP 429 telemetry, CORS exposed headers, and live frontend countdown timers."
);

curY = drawTestCaseCard(doc, curY, {
  id: "TC-RATE-01",
  title: "Rapid Request Throttling & HTTP 429 Payload Compliance",
  target: "Backend Endpoints (Auth / Contact / Verify API)",
  badgeColor: COLORS.warning,
  height: 42,
  steps: [
    "Simulate rapid requests to an endpoint (e.g., repeatedly submit contact form or invalid logins).",
    "Inspect the Network tab in Chrome DevTools upon receiving HTTP 429 (Too Many Requests).",
    "Verify response body contains: { success: false, retryAfter: <sec>, resetTime: <ISO>, remaining: 0 }.",
    "Check Response Headers for: RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset, Retry-After.",
  ],
  expected:
    "All headers are cleanly exposed via CORS (configured in app.js). Payload is strictly structured JSON; no raw text or broken crash dumps.",
});

curY = drawTestCaseCard(doc, curY, {
  id: "TC-RATE-02",
  title: "Frontend Live Countdown Toast / Cooldown Alert in GlobalMessage",
  target: "Frontend UI GlobalMessage Component",
  badgeColor: COLORS.accentCyan,
  height: 38,
  steps: [
    "Trigger an HTTP 429 rate limit error through the UI.",
    "Observe the top-right / screen-top notification alert.",
    "Watch the countdown timer tick down second-by-second (e.g., 'Please wait 59s, 58s...').",
  ],
  expected:
    "Axios interceptor catches the 429 status code and displays a live ticking cooldown banner. Submit button is disabled until cooldown timer reaches 0s.",
});

curY = drawTestCaseCard(doc, curY, {
  id: "TC-RATE-03",
  title: "Admin Settings Security Policies & Rate Limits Overview",
  target: "/admin/settings (Security Policies Card)",
  badgeColor: COLORS.accent,
  height: 38,
  steps: [
    "Log in as Administrator and navigate to http://localhost:5173/admin/settings.",
    "Locate the 'Security Policies & Rate Limits' status card.",
    "Verify policy tiers are displayed: Auth Limiter (5 req/15m), API Limiter (100 req/15m).",
  ],
  expected:
    "Security card renders active policies, window duration, max thresholds, and current enforcement status clearly.",
});

// SECTION 3: CERTIFICATE MANAGEMENT & REJECTION
curY = drawSectionTitle(
  doc,
  curY + 2,
  "3. Certificate Lifecycle, Rejection Deletion & Edit Synchronization",
  "Verifies certificate generation, dispatch statuses, and cascading deletion on rejection or edits."
);

curY = drawTestCaseCard(doc, curY, {
  id: "TC-CERT-01",
  title: "Automatic Certificate Deletion on Registration/Certificate Rejection",
  target: "/admin/certificates & /admin/registrations",
  badgeColor: COLORS.danger,
  height: 40,
  steps: [
    "Locate an issued certificate in /admin/certificates with an assigned Certificate ID.",
    "Click 'Delete' or navigate to registrations and reject the participant's certificate.",
    "Confirm the deletion prompt.",
    "Open the verification URL: http://localhost:5173/verify-certificate/<certificateId> in browser.",
  ],
  expected:
    "Certificate is deleted from database and Cloudinary storage. Verification URL immediately returns 'Certificate Not Found / Revoked' with a red warning badge.",
});

// ==========================================
// PAGE 3: CERTIFICATES + CSV IMPORT & EXPORT
// ==========================================
doc.addPage();
drawHeaderFooter(doc, 3);

curY = 24;

curY = drawTestCaseCard(doc, curY, {
  id: "TC-CERT-02",
  title: "Edit Synchronization & Cryptographic Re-generation",
  target: "/admin/certificates (Edit Modal)",
  badgeColor: COLORS.accent,
  height: 40,
  steps: [
    "Select an existing issued certificate and click 'Edit'.",
    "Change the Student Name (e.g. correct a typo) and Position (e.g. from 'Participant' to 'Winner').",
    "Save changes and wait for batch synchronization.",
    "Reload the public verification link and inspect the rendered certificate canvas.",
  ],
  expected:
    "Metadata updates instantly. The rendered canvas immediately displays updated name and position. Old cache is invalidated and previous batch counters update cleanly.",
});

curY = drawTestCaseCard(doc, curY, {
  id: "TC-CERT-03",
  title: "Delivery Status Tracking (Pending Dispatch, Dispatched, Delivered, Failed)",
  target: "/admin/certificates (Certificate Table)",
  badgeColor: COLORS.warning,
  height: 38,
  steps: [
    "Inspect the 'Delivery Status' column for newly issued certificates.",
    "Verify initial status displays as 'Pending Dispatch' with an amber pill.",
    "Trigger 'Resend' or batch dispatch job.",
    "Verify state transitions to 'Dispatched' or 'Delivered' upon email confirmation.",
  ],
  expected:
    "Delivery statuses update reactively without requiring full page refresh. Actions menu allows targeted Resend or Delete for any specific recipient.",
});

// SECTION 4: BULK CSV IMPORT & EXPORT
curY = drawSectionTitle(
  doc,
  curY + 2,
  "4. Bulk CSV Import & Export Handling",
  "Verifies validation rules, duplicate email filtering, batch creation, and single-click CSV export."
);

curY = drawTestCaseCard(doc, curY, {
  id: "TC-CSV-01",
  title: "Valid CSV Upload & Batch Certificate Creation",
  target: "/admin/certificates (Bulk CSV Import)",
  badgeColor: COLORS.success,
  height: 42,
  steps: [
    "Prepare a test CSV file containing 10 rows: Student Name, Email, Event Name, Position.",
    "Use test file: Testing/sample_certificates_50.csv.",
    "Click 'Import CSV' button in Admin Certificates and select the file.",
    "Select the target Event from the dropdown and submit.",
  ],
  expected:
    "System parses all rows, validates headers, displays a pre-import preview modal, and issues certificates. Batch record is created with total count, dispatched count, and timestamp.",
});

curY = drawTestCaseCard(doc, curY, {
  id: "TC-CSV-02",
  title: "Malformed CSV & Duplicate Record Resilience",
  target: "/admin/certificates (Bulk CSV Import Validation)",
  badgeColor: COLORS.danger,
  height: 40,
  steps: [
    "Create a test CSV with missing headers, invalid email formats, and duplicate emails for the same event.",
    "Upload the invalid CSV file.",
    "Inspect error modal and validation breakdown.",
  ],
  expected:
    "System rejects invalid rows with row numbers and exact column error reasons. Valid rows are optionally isolated or transaction is rolled back safely without corrupting database.",
});

curY = drawTestCaseCard(doc, curY, {
  id: "TC-CSV-03",
  title: "One-Click CSV Export of Issued Certificates with Verification URLs",
  target: "/admin/certificates (Export CSV Action)",
  badgeColor: COLORS.accent,
  height: 38,
  steps: [
    "In /admin/certificates, apply a filter (e.g., by Event or Delivery Status).",
    "Click the 'Export CSV' button.",
    "Open the downloaded CSV file in Excel or Notepad.",
  ],
  expected:
    "CSV downloads instantly containing columns: Student Name, Email, Event, Position, Certificate ID, Verification URL (qucodex.com/verify-certificate/:id), Delivery Status, Issued Timestamp.",
});

// SECTION 5: PUBLIC VERIFICATION PORTAL
curY = drawSectionTitle(
  doc,
  curY + 2,
  "5. Public Certificate Verification Portal & Dynamic Exports",
  "Verifies public accessibility, cryptographic checksum, QR code scanning, and SVG/PDF downloads."
);

curY = drawTestCaseCard(doc, curY, {
  id: "TC-VERIFY-01",
  title: "Public Authenticity Verification & Tamper Check",
  target: "http://localhost:5173/verify-certificate/:certificateId",
  badgeColor: COLORS.success,
  height: 38,
  steps: [
    "Open an incognito browser window (logged out).",
    "Navigate to a valid verification URL: /verify-certificate/<certificateId>.",
    "Verify the page loads without requiring any authentication.",
  ],
  expected:
    "Shows green 'Verified Authentic' badge with CodeX seal, Student Name, Position, Event Name, Issue Date, and unique cryptographic credential ID.",
});

// ==========================================
// PAGE 4: EXPORT + SEO TITLES + VERIFICATION
// ==========================================
doc.addPage();
drawHeaderFooter(doc, 4);

curY = 24;

curY = drawTestCaseCard(doc, curY, {
  id: "TC-VERIFY-02",
  title: "Live High-Resolution SVG & PDF Download from Verification Page",
  target: "/verify-certificate/:certificateId (Download Actions)",
  badgeColor: COLORS.accent,
  height: 40,
  steps: [
    "On the verification page, click 'Download High-Res PDF'.",
    "Verify PDF generation progress indicator.",
    "Open downloaded PDF and inspect typography, QR code resolution, and alignment.",
    "Click 'Download SVG' and verify vector graphic opens in browser.",
  ],
  expected:
    "PDF and SVG files download cleanly with accurate recipient details, embedded QR code, and official signatures without visual distortion.",
});

// SECTION 6: SEO TITLE & METADATA TAGS
curY = drawSectionTitle(
  doc,
  curY + 2,
  "6. Brand SEO & Dynamic Meta Title Synchronization",
  "Verifies that all page titles strictly use the official indexed tagline: 'Coding the Future, Today.'"
);

curY = drawTestCaseCard(doc, curY, {
  id: "TC-SEO-01",
  title: "Root Page & Main Navigation SEO Tagline Verification",
  target: "Frontend Index & Public Pages",
  badgeColor: COLORS.accentCyan,
  height: 42,
  steps: [
    "Navigate to http://localhost:5173/ and check browser tab title.",
    "Inspect HTML source in DevTools (<title>, meta[name='title'], og:title, twitter:title).",
    "Navigate to /register, /about, /events, /team.",
    "Check browser tab title on each navigation.",
  ],
  expected:
    "Titles strictly match: Home -> 'CodeX | Coding the Future, Today.', Register -> 'Join The Club - CodeX | Coding the Future, Today.', About -> 'Coding the Future, Today. - CodeX'. No generic club titles.",
});

curY = drawTestCaseCard(doc, curY, {
  id: "TC-SEO-02",
  title: "Dynamic Meta Hook (usePageMeta) Verification on Admin & Sub-routes",
  target: "Admin Pages & Dynamic Entity Routes",
  badgeColor: COLORS.accent,
  height: 38,
  steps: [
    "Navigate to /admin/login, /admin/dashboard, /admin/certificates.",
    "Inspect the browser tab title as routes change without page reload.",
    "Open /verify-certificate/:id and wait for certificate data to resolve.",
  ],
  expected:
    "usePageMeta hook dynamically synchronizes document.title and meta tags to '<Page> - CodeX | Coding the Future, Today.'. Certificate verification dynamically displays recipient name and position.",
});

// SECTION 7: DATABASE INDEX OPTIMIZATION
curY = drawSectionTitle(
  doc,
  curY + 2,
  "7. Database Performance & Safe Index Management",
  "Verifies compound indexes in Mongoose models and cleanup of redundant migration scripts."
);

curY = drawTestCaseCard(doc, curY, {
  id: "TC-DB-01",
  title: "Mongoose Schema Compound Indexes & Query Execution Speed",
  target: "Backend MongoDB Certificate & CertificateBatch Models",
  badgeColor: COLORS.success,
  height: 40,
  steps: [
    "In MongoDB Compass or mongosh shell, connect to the CodeX database.",
    "Run db.certificates.getIndexes() and db.certificatebatches.getIndexes().",
    "Verify compound indexes exist for: { event: 1, email: 1 } and { certificateId: 1 }.",
    "Confirm redundant script Backend/src/utils/optimizeDbIndexes.js has been safely eliminated.",
  ],
  expected:
    "Queries on certificateId and event+email execute with ColScan: false (using B-tree index scan), ensuring sub-50ms lookup times under production loads.",
});

// ==========================================
// PAGE 5: TEST EXECUTION SUMMARY & SIGN-OFF
// ==========================================
doc.addPage();
drawHeaderFooter(doc, 5);

curY = 24;

curY = drawSectionTitle(
  doc,
  curY,
  "8. Test Execution Summary & Quality Sign-Off Matrix",
  "Official sign-off sheet for QA Engineer, Tech Lead, and Release Manager prior to production merge."
);

// Summary Checklist Table
const tableY = curY + 2;
doc.setFillColor(...COLORS.primary);
doc.rect(margin, tableY, contentWidth, 6, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(7.5);
doc.setTextColor(...COLORS.white);
doc.text("TEST SUITE SUMMARY & STATUS TRACKER", margin + 4, tableY + 4.2);

const testSuites = [
  ["TS-01: Admin Authentication & Timing Attack Defense", "TC-AUTH-01 to TC-AUTH-04", "4 Cases", "[ ] PASS  [ ] FAIL"],
  ["TS-02: Rate Limiting & HTTP 429 Cooldown Telemetry", "TC-RATE-01 to TC-RATE-03", "3 Cases", "[ ] PASS  [ ] FAIL"],
  ["TS-03: Certificate Rejection Deletion & Edit Sync", "TC-CERT-01 to TC-CERT-03", "3 Cases", "[ ] PASS  [ ] FAIL"],
  ["TS-04: Bulk CSV Import, Validation & Export Flow", "TC-CSV-01 to TC-CSV-03", "3 Cases", "[ ] PASS  [ ] FAIL"],
  ["TS-05: Public Certificate Verification Portal & Downloads", "TC-VERIFY-01 to TC-VERIFY-02", "2 Cases", "[ ] PASS  [ ] FAIL"],
  ["TS-06: Brand SEO & Tagline Metadata Synchronization", "TC-SEO-01 to TC-SEO-02", "2 Cases", "[ ] PASS  [ ] FAIL"],
  ["TS-07: Database Schema Indexes & Safe Script Cleanup", "TC-DB-01", "1 Case", "[ ] PASS  [ ] FAIL"],
];

let sY = tableY + 6;
doc.setFontSize(7.2);
for (let i = 0; i < testSuites.length; i++) {
  doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
  doc.rect(margin, sY, contentWidth, 5.5, "F");
  doc.setDrawColor(...COLORS.border);
  doc.line(margin, sY + 5.5, margin + contentWidth, sY + 5.5);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.textDark);
  doc.text(testSuites[i][0], margin + 3, sY + 3.8);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textMuted);
  doc.text(testSuites[i][1], margin + 95, sY + 3.8);
  doc.text(testSuites[i][2], margin + 140, sY + 3.8);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.accent);
  doc.text(testSuites[i][3], pageWidth - margin - 4, sY + 3.8, { align: "right" });

  sY += 5.5;
}

// Defect Reporting Procedure Box
const defectY = sY + 6;
doc.setFillColor(...COLORS.bgLight);
doc.setDrawColor(...COLORS.border);
doc.roundedRect(margin, defectY, contentWidth, 28, 1.5, 1.5, "FD");

doc.setFont("helvetica", "bold");
doc.setFontSize(8.5);
doc.setTextColor(...COLORS.danger);
doc.text("DEFECT REPORTING & SEVERITY TRIAGE GUIDELINES", margin + 4, defectY + 6);

doc.setFont("helvetica", "normal");
doc.setFontSize(7.2);
doc.setTextColor(...COLORS.textDark);
const defectNotes = [
  "• Blocker (P0): Authentication failure, bypass of MFA lockout, or data corruption in certificates/DB.",
  "• Critical (P1): Rate limiter fails to trigger 429, CSV upload crashes server, or certificate fails to delete on rejection.",
  "• Major (P2): Cooldown banner timer mismatch, CSV export missing columns, or PDF download visual misalignment.",
  "• Minor (P3): Title tag typo, minor padding/margin inconsistency, or non-blocking console warnings.",
  "Report all defects on GitHub Issues under branch 'feat/super-admin-and-production-certificates' with reproduction steps.",
];
let dY = defectY + 10;
for (const note of defectNotes) {
  doc.text(note, margin + 4, dY);
  dY += 3.5;
}

// Official Sign-off Table
const signY = defectY + 34;
doc.setFillColor(...COLORS.primary);
doc.rect(margin, signY, contentWidth, 6, "F");
doc.setFont("helvetica", "bold");
doc.setFontSize(7.5);
doc.setTextColor(...COLORS.white);
doc.text("OFFICIAL STAKEHOLDER SIGN-OFF MATRIX", margin + 4, signY + 4.2);

const signRows = [
  ["Lead QA Test Engineer:", "___________________________", "Date:", "____ / ____ / 2026", "Verdict: [ ] APPROVED  [ ] REJECTED"],
  ["Technical Lead / Super Admin:", "___________________________", "Date:", "____ / ____ / 2026", "Verdict: [ ] APPROVED  [ ] REJECTED"],
  ["Release Management:", "___________________________", "Date:", "____ / ____ / 2026", "Verdict: [ ] MERGE READY"],
];

let sigRowY = signY + 6;
doc.setFontSize(7.2);
for (let i = 0; i < signRows.length; i++) {
  doc.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 252);
  doc.rect(margin, sigRowY, contentWidth, 8, "F");
  doc.setDrawColor(...COLORS.border);
  doc.line(margin, sigRowY + 8, margin + contentWidth, sigRowY + 8);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.textDark);
  doc.text(signRows[i][0], margin + 3, sigRowY + 5.2);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textMuted);
  doc.text(signRows[i][1], margin + 46, sigRowY + 5.2);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.textDark);
  doc.text(signRows[i][2], margin + 98, sigRowY + 5.2);

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...COLORS.textMuted);
  doc.text(signRows[i][3], margin + 108, sigRowY + 5.2);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...COLORS.accent);
  doc.text(signRows[i][4], pageWidth - margin - 4, sigRowY + 5.2, { align: "right" });

  sigRowY += 8;
}

// Output destinations: save directly to Testing folder and Project root
const outputPath1 = path.resolve(__dirname, "CodeX_QA_New_Features_Verification_Guide.pdf");
const outputPath2 = path.resolve(__dirname, "..", "CodeX_QA_New_Features_Verification_Guide.pdf");

const pdfBuffer = Buffer.from(doc.output("arraybuffer"));
fs.writeFileSync(outputPath1, pdfBuffer);
fs.writeFileSync(outputPath2, pdfBuffer);

console.log(`[SUCCESS] QA Verification Guide generated at:`);
console.log(`- ${outputPath1}`);
console.log(`- ${outputPath2}`);
