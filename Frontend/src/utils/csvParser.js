/**
 * Production CSV Parsing & Export Utilities for Certificate Handling
 */

const VALID_POSITIONS = [
  'Participant',
  'Winner',
  'Runner Up',
  '1st Runner-up',
  '2nd Runner-up',
  'Volunteer',
  'Organizer',
];

/**
 * Normalizes user-entered position strings to standard schema enums
 */
export const normalizePosition = (rawPosition) => {
  if (!rawPosition || typeof rawPosition !== 'string') return 'Participant';
  const clean = rawPosition.trim();

  // Exact match
  const exact = VALID_POSITIONS.find((p) => p.toLowerCase() === clean.toLowerCase());
  if (exact) return exact;

  // Fuzzy regex match
  if (/winner/i.test(clean)) return 'Winner';
  if (/1st\s*runner/i.test(clean)) return '1st Runner-up';
  if (/2nd\s*runner/i.test(clean)) return '2nd Runner-up';
  if (/runner/i.test(clean)) return 'Runner Up';
  if (/volunteer/i.test(clean)) return 'Volunteer';
  if (/organi[sz]er/i.test(clean)) return 'Organizer';

  return 'Participant';
};

/**
 * Robust RFC-4180 compliant CSV line tokenizer
 * Splits a single CSV line into columns, respecting quoted strings with embedded commas and quotes
 */
export const tokenizeCsvLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

/**
 * Parses CSV text into a structured student roster with smart header detection and validation
 */
export const parseCertificateCsv = (csvText) => {
  if (!csvText || typeof csvText !== 'string') {
    return { success: false, students: [], skippedCount: 0, error: 'Empty file' };
  }

  // Strip leading UTF-8 Byte Order Mark (\uFEFF) if present (common in Excel exports)
  const cleanText = csvText.replace(/^\uFEFF/, '').trim();
  const rawLines = cleanText.split(/\r?\n/).filter((l) => l.trim() !== '');

  if (rawLines.length === 0) {
    return { success: false, students: [], skippedCount: 0, error: 'CSV file contains no rows' };
  }

  let startIndex = 0;
  let nameCol = 0;
  let emailCol = 1;
  let posCol = 2;

  // Header detection
  const firstRowCols = tokenizeCsvLine(rawLines[0]);
  const hasHeader = firstRowCols.some((col) =>
    /name|email|position|role|award/i.test(col)
  );

  if (hasHeader) {
    startIndex = 1;
    firstRowCols.forEach((col, idx) => {
      const lower = col.toLowerCase();
      if (/name|student/i.test(lower)) nameCol = idx;
      else if (/email|mail/i.test(lower)) emailCol = idx;
      else if (/position|role|award|category|status/i.test(lower)) posCol = idx;
    });
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@([A-Za-z0-9-]+\.)+[A-Za-z]{2,}$/;
  const emailMap = new Map();
  const students = [];
  const duplicateConflicts = [];
  let skippedCount = 0;

  for (let i = startIndex; i < rawLines.length; i++) {
    const cols = tokenizeCsvLine(rawLines[i]);
    const rawName = cols[nameCol] || '';
    const rawEmail = cols[emailCol] || '';
    const rawPos = cols[posCol] || 'Participant';

    const name = rawName.trim();
    const email = rawEmail.trim().toLowerCase();
    const position = normalizePosition(rawPos);

    if (name && email && emailRegex.test(email)) {
      if (emailMap.has(email)) {
        const existing = emailMap.get(email);
        duplicateConflicts.push({
          email,
          firstRow: existing.rowNumber,
          firstName: existing.name,
          duplicateRow: i + 1,
          duplicateName: name,
          isNameConflict: existing.name.toLowerCase() !== name.toLowerCase(),
        });
      } else {
        emailMap.set(email, { name, rowNumber: i + 1 });
        students.push({ name, email, position });
      }
    } else {
      skippedCount++;
    }
  }

  // If any duplicate emails or conflicting names are detected, HALT processing and display detailed error
  if (duplicateConflicts.length > 0) {
    const errorDetails = duplicateConflicts
      .slice(0, 5)
      .map((c) =>
        c.isNameConflict
          ? `• Email "${c.email}" is assigned to conflicting names: "${c.firstName}" (Row ${c.firstRow}) and "${c.duplicateName}" (Row ${c.duplicateRow})`
          : `• Duplicate email "${c.email}" found on Row ${c.firstRow} and Row ${c.duplicateRow}`
      )
      .join('\n');

    const totalConflicts = duplicateConflicts.length;
    const moreText = totalConflicts > 5 ? `\n...and ${totalConflicts - 5} more conflict(s).` : '';

    return {
      success: false,
      students: [],
      skippedCount,
      duplicateCount: totalConflicts,
      error: `Cannot process batch due to duplicate email conflict:\n${errorDetails}${moreText}\n\nEach student must have a unique email address. Please resolve these entries in your CSV file before uploading.`,
      duplicateConflicts,
    };
  }

  if (students.length === 0) {
    return {
      success: false,
      students: [],
      skippedCount,
      duplicateCount,
      error: 'No valid student records found. Please ensure each row has a valid Name and Email.',
    };
  }

  return {
    success: true,
    students,
    skippedCount,
    duplicateCount,
    error: null,
  };
};

/**
 * Downloads a pre-formatted, production-ready sample CSV template with sample recipient rows
 */
export const downloadCertificateCsvTemplate = () => {
  const rows = [
    ['Name', 'Email', 'Position'],
    ['Aarav Sharma', 'aarav.sharma@example.com', 'Winner'],
    ['Sneha Patel', 'sneha.patel@example.com', '1st Runner-up'],
    ['Rohan Verma', 'rohan.verma@example.com', '2nd Runner-up'],
    ['Priya Singh', 'priya.singh@example.com', 'Participant'],
    ['Vikram Rao', 'vikram.rao@example.com', 'Volunteer'],
    ['Ananya Iyer', 'ananya.iyer@example.com', 'Organizer'],
  ];

  const csvContent = '\uFEFF' + rows.map((r) => r.map((c) => `"${c}"`).join(',')).join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'CodeX_Certificate_Import_Template.csv');
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
