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
 * Splits a single CSV line into columns, respecting quoted strings with embedded delimiters and quotes
 */
export const tokenizeCsvLine = (line, delimiter = ',') => {
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
    } else if (char === delimiter && !inQuotes) {
      let val = current.trim();
      if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
        val = val.slice(1, -1).trim();
      }
      result.push(val);
      current = '';
    } else {
      current += char;
    }
  }

  let val = current.trim();
  if (val.startsWith('"') && val.endsWith('"') && val.length >= 2) {
    val = val.slice(1, -1).trim();
  }
  result.push(val);
  return result;
};

/**
 * Detect delimiter by analyzing header row (comma, semicolon, or tab)
 */
const detectDelimiter = (firstLine) => {
  if (!firstLine) return ',';
  const semicolons = (firstLine.match(/;/g) || []).length;
  const commas = (firstLine.match(/,/g) || []).length;
  const tabs = (firstLine.match(/\t/g) || []).length;

  if (tabs > commas && tabs > semicolons) return '\t';
  if (semicolons > commas) return ';';
  return ',';
};

/**
 * Produces user-friendly diagnostics explaining why an email is invalid
 */
export const explainEmailError = (rawEmail) => {
  if (!rawEmail || !rawEmail.trim()) return 'Missing email address';
  const clean = rawEmail.trim();
  if (!clean.includes('@')) return `Email "${clean}" is missing "@" symbol`;
  const parts = clean.split('@');
  if (parts.length > 2) return `Email "${clean}" has multiple "@" symbols`;
  if (!parts[0].trim()) return `Email "${clean}" is missing username before "@"`;
  if (!parts[1].trim()) return `Email "${clean}" is missing domain after "@"`;
  if (!parts[1].includes('.')) return `Email "${clean}" is missing domain extension (e.g. .com, .edu)`;
  return `Invalid email format "${clean}"`;
};

/**
 * Parses CSV text into a structured student roster with smart header detection,
 * detailed error diagnostics, and duplicate detection
 */
export const parseCertificateCsv = (csvText) => {
  if (!csvText || typeof csvText !== 'string') {
    return {
      success: false,
      students: [],
      skippedCount: 0,
      skippedRows: [],
      skippedDetails: '',
      duplicateCount: 0,
      error: 'Empty file',
    };
  }

  // Strip leading UTF-8 Byte Order Mark (\uFEFF) and zero-width spaces
  const cleanText = csvText.replace(/^[\uFEFF\u200B\u200C\u200D\uFFFD]+/, '').trim();
  const rawLines = cleanText.split(/\r\n|\r|\n/).map((l) => l.trim()).filter((l) => l !== '');

  if (rawLines.length === 0) {
    return {
      success: false,
      students: [],
      skippedCount: 0,
      skippedRows: [],
      skippedDetails: '',
      duplicateCount: 0,
      error: 'CSV file contains no rows',
    };
  }

  const delimiter = detectDelimiter(rawLines[0]);

  let startIndex = 0;
  let nameCol = 0;
  let emailCol = 1;
  let posCol = 2;

  // Header detection
  const firstRowCols = tokenizeCsvLine(rawLines[0], delimiter);
  const hasHeader = firstRowCols.some((col) =>
    /name|student|candidate|recipient|person|email|mail|position|role|award|category|status|rank/i.test(col)
  );

  if (hasHeader) {
    startIndex = 1;
    let foundName = false;
    let foundEmail = false;
    let foundPos = false;

    firstRowCols.forEach((col, idx) => {
      const lower = col.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (!foundName && /name|student|candidate|recipient|person/.test(lower)) {
        nameCol = idx;
        foundName = true;
      } else if (!foundEmail && /email|mail/.test(lower)) {
        emailCol = idx;
        foundEmail = true;
      } else if (!foundPos && /position|role|award|category|status|rank|designation/.test(lower)) {
        posCol = idx;
        foundPos = true;
      }
    });

    if (!foundEmail) {
      firstRowCols.forEach((col, idx) => {
        if (/mail/i.test(col)) emailCol = idx;
      });
    }
  }

  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  const emailMap = new Map();
  const students = [];
  const duplicateConflicts = [];
  const skippedRows = [];

  for (let i = startIndex; i < rawLines.length; i++) {
    const rowNumber = i + 1; // 1-based row index in CSV file
    const cols = tokenizeCsvLine(rawLines[i], delimiter);

    // If row is completely empty, skip cleanly without counting as skipped recipient
    if (cols.every((c) => !c || c.trim() === '')) {
      continue;
    }

    const rawName = cols[nameCol] || '';
    const rawEmail = cols[emailCol] || '';
    const rawPos = cols[posCol] || 'Participant';

    const name = rawName.trim().replace(/^['"“‘]+|['"”’]+$/g, '');
    // Clean angle brackets, wrapping quotes, and accidental trailing punctuation in emails
    const email = rawEmail
      .trim()
      .replace(/^<|>$/g, '')
      .replace(/^['"“‘]+|['"”’]+$/g, '')
      .replace(/[.,;]+$/, '')
      .toLowerCase();
    const position = normalizePosition(rawPos);

    // Validation checks with granular diagnostics
    if (!name && !email) {
      skippedRows.push({
        rowNumber,
        name: '(empty name)',
        email: '(empty email)',
        reason: 'Both student Name and Email are empty',
      });
      continue;
    }

    if (!name) {
      skippedRows.push({
        rowNumber,
        name: '(missing name)',
        email: rawEmail.trim(),
        reason: `Missing student Name for email "${rawEmail.trim()}"`,
      });
      continue;
    }

    if (!email) {
      skippedRows.push({
        rowNumber,
        name,
        email: '(missing email)',
        reason: `Missing Email address for student "${name}"`,
      });
      continue;
    }

    if (!emailRegex.test(email)) {
      skippedRows.push({
        rowNumber,
        name,
        email: rawEmail.trim(),
        reason: `${explainEmailError(rawEmail)} for student "${name}"`,
      });
      continue;
    }

    // Check duplicate within the CSV
    if (emailMap.has(email)) {
      const existing = emailMap.get(email);
      duplicateConflicts.push({
        email,
        firstRow: existing.rowNumber,
        firstName: existing.name,
        duplicateRow: rowNumber,
        duplicateName: name,
        isNameConflict: existing.name.toLowerCase() !== name.toLowerCase(),
      });
    } else {
      emailMap.set(email, { name, rowNumber });
      students.push({ name, email, position });
    }
  }

  const duplicateCount = duplicateConflicts.length;
  const skippedCount = skippedRows.length;
  const skippedDetails = skippedCount > 0
    ? skippedRows.slice(0, 10).map((s) => `• Row ${s.rowNumber}: ${s.reason}`).join('\n')
      + (skippedCount > 10 ? `\n...and ${skippedCount - 10} more invalid row(s).` : '')
    : '';

  // If duplicate emails or conflicting names are detected, HALT processing and display detailed error
  if (duplicateConflicts.length > 0) {
    const errorDetails = duplicateConflicts
      .slice(0, 5)
      .map((c) =>
        c.isNameConflict
          ? `• Email "${c.email}" is assigned to conflicting names: "${c.firstName}" (Row ${c.firstRow}) and "${c.duplicateName}" (Row ${c.duplicateRow})`
          : `• Duplicate email "${c.email}" found on Row ${c.firstRow} and Row ${c.duplicateRow}`
      )
      .join('\n');

    const moreText = duplicateCount > 5 ? `\n...and ${duplicateCount - 5} more conflict(s).` : '';

    return {
      success: false,
      students: [],
      skippedCount,
      skippedRows,
      skippedDetails,
      duplicateCount,
      error: `Cannot process batch due to duplicate email conflict:\n${errorDetails}${moreText}\n\nEach student must have a unique email address. Please resolve these entries in your CSV file before uploading.`,
      duplicateConflicts,
    };
  }

  if (students.length === 0) {
    return {
      success: false,
      students: [],
      skippedCount,
      skippedRows,
      skippedDetails,
      duplicateCount: 0,
      error: skippedCount > 0
        ? `No valid student records could be imported from the CSV.\n\nErrors encountered:\n${skippedDetails}\n\nPlease correct these entries in your CSV file.`
        : 'No valid student records found. Please ensure each row has a valid Name and Email.',
    };
  }

  return {
    success: true,
    students,
    skippedCount,
    skippedRows,
    skippedDetails,
    duplicateCount: 0,
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
