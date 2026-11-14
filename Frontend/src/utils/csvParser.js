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
 * Parses CSV text into a structured student roster with smart header detection and validation
 */
export const parseCertificateCsv = (csvText) => {
  if (!csvText || typeof csvText !== 'string') {
    return { success: false, students: [], skippedCount: 0, duplicateCount: 0, error: 'Empty file' };
  }

  // Strip leading UTF-8 Byte Order Mark (\uFEFF) and zero-width spaces
  const cleanText = csvText.replace(/^[\uFEFF\u200B\u200C\u200D\uFFFD]+/, '').trim();
  const rawLines = cleanText.split(/\r\n|\r|\n/).map((l) => l.trim()).filter((l) => l !== '');

  if (rawLines.length === 0) {
    return { success: false, students: [], skippedCount: 0, duplicateCount: 0, error: 'CSV file contains no rows' };
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
  let skippedCount = 0;

  for (let i = startIndex; i < rawLines.length; i++) {
    const cols = tokenizeCsvLine(rawLines[i], delimiter);
    // If row is empty, skip cleanly
    if (cols.every((c) => !c || c.trim() === '')) {
      continue;
    }

    const rawName = cols[nameCol] || '';
    const rawEmail = cols[emailCol] || '';
    const rawPos = cols[posCol] || 'Participant';

    const name = rawName.trim();
    // Clean potential angle brackets or spaces in emails
    const email = rawEmail.trim().replace(/^<|>$/g, '').toLowerCase();
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

  const duplicateCount = duplicateConflicts.length;

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

    const moreText = duplicateCount > 5 ? `\n...and ${duplicateCount - 5} more conflict(s).` : '';

    return {
      success: false,
      students: [],
      skippedCount,
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
      duplicateCount: 0,
      error: 'No valid student records found. Please ensure each row has a valid Name and Email.',
    };
  }

  return {
    success: true,
    students,
    skippedCount,
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
