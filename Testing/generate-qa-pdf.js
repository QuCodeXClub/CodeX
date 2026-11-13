import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF() {
  const { jsPDF } = await import('../Frontend/node_modules/jspdf/dist/jspdf.es.min.js');

  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  function checkPageBreak(requiredSpace = 15) {
    if (y + requiredSpace > pageHeight - margin - 10) {
      doc.addPage();
      y = margin + 12;
      drawHeaderFooter();
    }
  }

  function drawHeaderFooter() {
    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text('CODEX QA SPECIFICATION • BRANCH: bagfix-mongoDB', margin, margin + 4);
    doc.setFont('helvetica', 'normal');
    doc.text('MODULE: CERTIFICATE ISOLATION & 7-DAY TTL', pageWidth - margin, margin + 4, { align: 'right' });
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, margin + 6, pageWidth - margin, margin + 6);

    // Footer
    doc.line(margin, pageHeight - margin - 4, pageWidth - margin, pageHeight - margin - 4);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text('CodeX Platform • Automated Quality Assurance Suite', margin, pageHeight - margin);
    const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
    doc.text(pageStr, pageWidth - margin, pageHeight - margin, { align: 'right' });
  }

  // Cover / Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(margin, y, contentWidth, 38, 3, 3, 'F');

  doc.setTextColor(20, 184, 166); // teal-500
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('QUALITY ASSURANCE VERIFICATION SUITE', margin + 6, y + 8);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.text('Certificate Multi-Batch Isolation & 7-Day TTL Recovery', margin + 6, y + 17);

  doc.setTextColor(203, 213, 225); // slate-300
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text('Target Branch: bagfix-mongoDB  |  Author: CodeX Core Engineering  |  Version: 2.1.0', margin + 6, y + 25);
  doc.text('Audience: Junior Developers, QA Engineers, and System Testers', margin + 6, y + 31);

  y += 44;

  // Objective Box
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(margin, y, contentWidth, 24, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('PRIMARY TEST OBJECTIVES:', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.text('1. Verify supplementary batch edit/rejection does NOT delete main batch certificates (Regression Test).', margin + 4, y + 11);
  doc.text('2. Verify 7-day TTL soft-delete flow in MongoDB (revokes verification without permanent loss).', margin + 4, y + 16);
  doc.text('3. Verify Super Admin 1-click restore & hard purge from the 7-Day Trash Vault.', margin + 4, y + 21);

  y += 30;

  // Section 1: Summary Matrix Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('1. Test Execution Matrix', margin, y);
  y += 5;

  const testMatrix = [
    ['TC-CERT-01', 'Multi-Batch Creation (Same Event & Date)', 'Critical', 'PASS [  ]'],
    ['TC-CERT-02', 'Supplementary Batch Edit Isolation (Bug Fix)', 'Critical', 'PASS [  ]'],
    ['TC-CERT-03', 'Batch Rejection Soft-Deletes Strictly Owned Records', 'Critical', 'PASS [  ]'],
    ['TC-CERT-04', 'Public Verification Revoked on Soft-Delete', 'High', 'PASS [  ]'],
    ['TC-CERT-05', 'Super Admin 1-Click Restore from 7-Day Trash', 'High', 'PASS [  ]'],
    ['TC-CERT-06', 'Super Admin Immediate Hard-Delete & Empty Trash', 'Medium', 'PASS [  ]'],
    ['TC-CERT-07', 'Duplicate Student Email Deduplication in CSV Import', 'High', 'PASS [  ]'],
    ['TC-CERT-08', 'RBAC Security: Standard Admin Blocked from Trash', 'High', 'PASS [  ]'],
  ];

  // Table Header
  doc.setFillColor(30, 41, 59);
  doc.rect(margin, y, contentWidth, 7, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.text('ID', margin + 2, y + 4.5);
  doc.text('TEST SCENARIO', margin + 25, y + 4.5);
  doc.text('PRIORITY', margin + 125, y + 4.5);
  doc.text('RESULT', margin + 155, y + 4.5);
  y += 7;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);

  testMatrix.forEach((row, i) => {
    doc.setFillColor(i % 2 === 0 ? 255 : 248, 250, 252);
    doc.rect(margin, y, contentWidth, 6, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y + 6, margin + contentWidth, y + 6);

    doc.setTextColor(15, 23, 42);
    doc.text(row[0], margin + 2, y + 4);
    doc.text(row[1], margin + 25, y + 4);

    if (row[2] === 'Critical') {
      doc.setTextColor(225, 29, 72); // rose-600
    } else if (row[2] === 'High') {
      doc.setTextColor(217, 119, 6); // amber-600
    } else {
      doc.setTextColor(13, 148, 136); // teal-600
    }
    doc.text(row[2], margin + 125, y + 4);

    doc.setTextColor(71, 85, 105);
    doc.text(row[3], margin + 155, y + 4);
    y += 6;
  });

  y += 8;

  // Section 2: Detailed Test Cases
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(15, 23, 42);
  doc.text('2. Step-by-Step Test Specifications for Junior / QA', margin, y);
  y += 6;

  const testCases = [
    {
      id: 'TC-CERT-01',
      title: 'Multi-Batch Creation (Same Event Name & Date)',
      goal: 'Confirm multiple batches with identical event name and date can coexist.',
      steps: [
        '1. Log in as Super Admin (superadmin@codex.community).',
        '2. Go to Bulk Certificates > Direct Certificate Issuance.',
        '3. Enter Event Name: "CodeX Orientation 2026", Event Date: "2026-09-03", Coordinator: "Parul Tyagi".',
        '4. Add 3 students: Alice Green (alice@test.com), Bob White (bob@test.com), Charlie (charlie@test.com).',
        '5. Upload signature and submit. Verify Batch 1 reaches COMPLETED status with 3 certificates.',
      ],
      expected: 'Batch 1 is COMPLETED. Alice, Bob, and Charlie have valid certificates and active verification URLs.',
    },
    {
      id: 'TC-CERT-02',
      title: 'Supplementary Batch Edit Isolation (Regression Bug Fix)',
      goal: 'Verify editing a second batch with the same event name/date does NOT delete Batch 1 certificates.',
      steps: [
        '1. As Admin, create Batch 2 with SAME Event: "CodeX Orientation 2026" and SAME Date: "2026-09-03".',
        '2. Add 2 late students: David Miller (david@test.com), Emma Watson (emma@test.com). Submit for approval.',
        '3. Click Edit (pencil icon) on Batch 2. Change coordinator name and add a 6th student.',
        '4. Save changes on Batch 2.',
        '5. In MongoDB, run: db.certificates.find({ eventName: "CodeX Orientation 2026" }).count().',
      ],
      expected: 'Batch 1 certificates remain 100% active and untouched (count >= 3). Batch 2 updates independently.',
    },
    {
      id: 'TC-CERT-03',
      title: 'Batch Rejection Soft-Deletes Strictly Owned Certificates',
      goal: 'Confirm rejecting a batch moves only that batch certificates to trash.',
      steps: [
        '1. As Super Admin, click Approve on Batch 2. Wait until status becomes COMPLETED.',
        '2. Now click Reject on Batch 2 with reason: "Late roster cancelled by coordinator".',
        '3. Confirm rejection dialog in UI.',
      ],
      expected: 'Only Batch 2 certificates are moved to 7-day trash. Batch 1 certificates remain COMPLETED and active.',
    },
    {
      id: 'TC-CERT-04',
      title: 'Public Verification Revocation on Soft-Delete',
      goal: 'Confirm soft-deleted certificates cannot be verified on the public verification portal.',
      steps: [
        '1. Copy the certificateId of soft-deleted student David Miller from Batch 2.',
        '2. Open an incognito browser window: /verify-certificate/<DAVID_CERT_ID>.',
        '3. In a separate tab, open Alice Green verification URL from Batch 1: /verify-certificate/<ALICE_CERT_ID>.',
      ],
      expected: 'David certificate displays "Invalid Certificate / Revoked". Alice certificate displays verified green badge.',
    },
    {
      id: 'TC-CERT-05',
      title: 'Super Admin 1-Click Restore from 7-Day Trash Vault',
      goal: 'Confirm Super Admin can instantly restore a certificate back to active status.',
      steps: [
        '1. Log in as Super Admin. Navigate to Bulk Certificates > "7-Day Trash & Recovery" tab.',
        '2. Observe counter badge and countdown timer (e.g. 6d 23h remaining auto-purged by TTL).',
        '3. Locate David Miller row and click the green "Restore" button.',
        '4. Refresh the incognito verification URL for David Miller.',
      ],
      expected: 'David Miller vanishes from trash and his public verification URL immediately displays verified credential.',
    },
    {
      id: 'TC-CERT-06',
      title: 'Super Admin Immediate Hard-Delete & Empty Trash',
      goal: 'Verify Super Admin can bypass the 7-day TTL and permanently delete records.',
      steps: [
        '1. In "7-Day Trash & Recovery", click the red trash can icon on Emma Watson row to hard-delete.',
        '2. Click "Empty Trash" at top right to purge all remaining soft-deleted items.',
        '3. Check MongoDB: db.certificates.countDocuments({ isDeleted: true }).',
      ],
      expected: 'Items are permanently deleted immediately (countDocuments === 0). UI displays "Trash is Empty".',
    },
    {
      id: 'TC-CERT-07',
      title: 'Duplicate Student Email Deduplication in CSV Import',
      goal: 'Verify CSV uploads containing duplicate student emails are deduplicated before submission.',
      steps: [
        '1. Prepare CSV with 5 rows where 2 emails are repeated (3 unique students total).',
        '2. In Bulk Certificates, click Import CSV and select the file.',
      ],
      expected: 'Toast indicates: "Successfully imported 3 unique students (2 duplicate emails deduplicated)". Exactly 3 certificates generated.',
    },
    {
      id: 'TC-CERT-08',
      title: 'RBAC Security: Standard Admin Blocked from Trash Vault',
      goal: 'Confirm standard Admins cannot view or restore certificates in the 7-day recovery vault.',
      steps: [
        '1. Log in as standard Admin (admin@codex.community). Check tab bar in Bulk Certificates.',
        '2. Try navigating to /admin/certificates?tab=trash or calling GET /api/v1/certificates/trash.',
      ],
      expected: 'Trash tab is completely hidden. Direct URL shows "Access Restricted". API call returns 403 Forbidden.',
    },
  ];

  testCases.forEach((tc) => {
    checkPageBreak(38);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, y, contentWidth, 34, 1.5, 1.5, 'FD');

    // Header badge
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(margin + 3, y + 3, 24, 5, 1, 1, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.text(tc.id, margin + 5, y + 6.5);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.text(tc.title, margin + 30, y + 6.5);

    // Goal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text('GOAL: ' + tc.goal, margin + 4, y + 11.5);

    // Steps
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(51, 65, 85);
    let stepY = y + 15.5;
    tc.steps.slice(0, 3).forEach((s) => {
      doc.text(s, margin + 4, stepY);
      stepY += 3.8;
    });

    // Expected
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(13, 148, 136); // teal-600
    doc.text('EXPECTED: ' + tc.expected, margin + 4, y + 30.5);

    y += 37;
  });

  // Sign-Off Box
  checkPageBreak(32);
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(148, 163, 184);
  doc.roundedRect(margin, y, contentWidth, 26, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(15, 23, 42);
  doc.text('3. QA SIGN-OFF & DEPLOYMENT AUTHORIZATION', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text('Tester Name: _______________________      Signature: _______________________      Date: ______________', margin + 4, y + 13);
  doc.text('Build / Commit: bagfix-mongoDB             Environment: [  ] Staging    [  ] Pre-Prod    [  ] Production', margin + 4, y + 20);

  // Apply headers and footers to all pages
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    drawHeaderFooter();
  }

  const outputPath = path.join(__dirname, 'Codex-QA-Certificate-Isolation-TTL.pdf');
  const pdfBytes = doc.output('arraybuffer');
  fs.writeFileSync(outputPath, Buffer.from(pdfBytes));

  console.log(`✅ PDF successfully generated: ${outputPath}`);
}

generatePDF().catch(console.error);

