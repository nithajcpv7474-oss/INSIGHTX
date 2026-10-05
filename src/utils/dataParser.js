import * as XLSX from 'xlsx';

/**
 * Common column name keywords indicating identity/keys rather than quantitative measures
 */
const IDENTIFIER_KEYWORDS = [
  'id', 'uuid', 'guid', 'key', 'code', 'isbn', 'ssn', 'hash', 'index',
  'serial', 'student_id', 'user_id', 'employee_id', 'patient_id',
  'customer_id', 'order_id', 'product_id', 'transaction_id', 'item_id'
];

/**
 * Checks if a column name represents an identifier/code rather than a quantitative measure
 */
export function isIdentifierColumn(columnName) {
  if (!columnName || typeof columnName !== 'string') return false;
  const clean = columnName.trim().toLowerCase();
  
  // Exact match with identifier keywords
  if (IDENTIFIER_KEYWORDS.includes(clean)) return true;

  // Ends with _id, -id, or id at word boundary (e.g. customer_id, user_code, account_no)
  if (/(?:^|[_\-\s])(id|uuid|guid|code|key|no|num|number)(?:$|[_\-\s])/i.test(clean)) {
    return true;
  }

  // Starts with # or id
  if (clean.startsWith('#') || clean.startsWith('id_') || clean.endsWith('_id')) {
    return true;
  }

  return false;
}

/**
 * Checks if a value is considered missing
 */
export function isValueMissing(val) {
  if (val === null || val === undefined) return true;
  if (typeof val === 'number') {
    return isNaN(val);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (trimmed === '') return true;
    const lower = trimmed.toLowerCase();
    if (lower === 'na' || lower === 'n/a' || lower === 'nan' || lower === 'null' || lower === 'none' || lower === 'nil') {
      return true;
    }
  }
  return false;
}

/**
 * Formats file size in readable format (KB, MB)
 */
export function formatBytes(bytes) {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

/**
 * Sanitizes and dedupes header names
 */
export function sanitizeHeaders(rawHeaders) {
  const seen = new Map();
  const headers = [];

  rawHeaders.forEach((h, index) => {
    let name = h !== null && h !== undefined ? String(h).trim() : '';
    if (!name) {
      name = `Unnamed_${index + 1}`;
    }

    if (seen.has(name)) {
      const count = seen.get(name) + 1;
      seen.set(name, count);
      headers.push(`${name} (${count})`);
    } else {
      seen.set(name, 1);
      headers.push(name);
    }
  });

  return headers;
}

/**
 * Checks if a value represents a date or timestamp
 */
export function isDateValue(val) {
  if (val === null || val === undefined) return false;
  if (val instanceof Date && !isNaN(val.getTime())) return true;
  if (typeof val !== 'string') return false;
  const trimmed = val.trim();
  if (!trimmed) return false;

  // Numerical values and pure numbers like "450" or "3.14" are NOT dates
  if (!isNaN(Number(trimmed))) return false;

  // Match common date patterns:
  // DD-MM-YYYY, DD/MM/YYYY, YYYY-MM-DD, YYYY/MM/DD, DD.MM.YYYY, YYYY-MM-DD HH:mm:ss, etc.
  const dateRegex = /^\d{1,4}[-/.]\d{1,2}[-/.]\d{1,4}(?:[ T]\d{1,2}:\d{2}(?::\d{2})?(?:\.\d+)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;
  if (dateRegex.test(trimmed)) return true;

  // Match ISO 8601 strings
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(trimmed)) return true;

  // Match text dates like "01-Jan-2026", "Jan 1, 2026", "October 2026"
  const textDateRegex = /^(?:\d{1,2}[-/\s])?(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[-/\s,]+\d{1,4}/i;
  if (textDateRegex.test(trimmed)) return true;

  // If contains delimiter and Date.parse parses it
  if (/[/-]/.test(trimmed)) {
    const parsed = Date.parse(trimmed.replace(/-/g, '/'));
    if (!isNaN(parsed)) return true;
  }

  return false;
}

/**
 * Robustly detects the actual table header row index based on structure,
 * skipping introductory titles, descriptions, and banners.
 */
export function findHeaderRowIndex(rawRows) {
  if (!rawRows || !Array.isArray(rawRows) || rawRows.length === 0) return -1;

  let maxFilled = 0;
  for (const row of rawRows) {
    if (Array.isArray(row)) {
      const filled = row.filter(c => !isValueMissing(c)).length;
      if (filled > maxFilled) maxFilled = filled;
    }
  }
  if (maxFilled === 0) return -1;

  let bestIndex = -1;
  let bestScore = -Infinity;

  const maxScanRows = Math.min(rawRows.length, 30);
  for (let i = 0; i < maxScanRows; i++) {
    const row = rawRows[i];
    if (!Array.isArray(row)) continue;
    const nonMissing = row.filter(c => !isValueMissing(c));
    const filledCount = nonMissing.length;
    if (filledCount === 0) continue;

    // In a multi-column dataset (maxFilled >= 2), a single-cell row is an introductory title/banner, not a column header
    if (maxFilled >= 2 && filledCount === 1) continue;
    if (maxFilled >= 4 && filledCount < 2) continue;

    // Check if there is at least one non-empty row below this candidate header row
    let hasDataBelow = false;
    for (let j = i + 1; j < rawRows.length; j++) {
      if (Array.isArray(rawRows[j]) && rawRows[j].some(c => !isValueMissing(c))) {
        hasDataBelow = true;
        break;
      }
    }
    if (!hasDataBelow) continue;

    let stringCount = 0;
    let numberCount = 0;
    for (const c of nonMissing) {
      if (typeof c === 'number' || (typeof c === 'string' && c.trim() !== '' && !isNaN(Number(c.trim())))) {
        numberCount++;
      } else {
        stringCount++;
      }
    }

    // Inspect the next row to detect header -> data transition
    let nextRow = null;
    for (let j = i + 1; j < rawRows.length; j++) {
      if (Array.isArray(rawRows[j]) && rawRows[j].some(c => !isValueMissing(c))) {
        nextRow = rawRows[j];
        break;
      }
    }

    let nextRowNumberCount = 0;
    let nextRowFilledCount = 0;
    if (nextRow) {
      const nextNonMissing = nextRow.filter(c => !isValueMissing(c));
      nextRowFilledCount = nextNonMissing.length;
      for (const c of nextNonMissing) {
        if (typeof c === 'number' || (typeof c === 'string' && c.trim() !== '' && !isNaN(Number(c.trim())))) {
          nextRowNumberCount++;
        }
      }
    }

    // Structural scoring:
    // 1. Column coverage (how many columns this row fills out of maxFilled)
    let score = (filledCount / maxFilled) * 60;

    // 2. String ratio (column headers are textual labels)
    score += (stringCount / filledCount) * 40;

    // 3. Penalty if candidate header consists mostly of numbers
    if (numberCount > stringCount) {
      score -= 60;
    }

    // 4. Strong bonus if row below contains numerical data
    if (nextRow && nextRowNumberCount > 0) {
      score += 35;
    }

    // 5. Bonus if row below matches column count
    if (nextRow && Math.abs(nextRowFilledCount - filledCount) <= 2) {
      score += 25;
    }

    // 6. Tie-breaker preference for earlier rows
    score -= i * 1.5;

    if (score > bestScore) {
      bestScore = score;
      bestIndex = i;
    }
  }

  return bestIndex;
}

/**
 * Intelligently selects the best worksheet containing the actual observation table,
 * distinguishing it from documentation, notes, or readme sheets.
 */
export function selectBestWorksheet(workbook) {
  const sheetNames = workbook?.SheetNames || [];
  if (sheetNames.length === 0) {
    throw new Error('The workbook contains no sheets.');
  }
  if (sheetNames.length === 1) {
    return { sheetName: sheetNames[0], worksheet: workbook.Sheets[sheetNames[0]] };
  }

  const docKeywords = /(?:info|metadata|readme|read\s*me|doc|documentation|notes|about|instructions|guide|cover|contents|summary|description)/i;

  let bestSheetName = sheetNames[0];
  let maxScore = -Infinity;

  for (const name of sheetNames) {
    const ws = workbook.Sheets[name];
    if (!ws) continue;
    const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: null, blankrows: false });
    if (!rawRows || rawRows.length === 0) continue;

    const rowCount = rawRows.length;
    let maxCols = 0;
    let numericCells = 0;

    for (const r of rawRows) {
      if (Array.isArray(r)) {
        if (r.length > maxCols) maxCols = r.length;
        for (const c of r) {
          if (c !== null && c !== undefined && (typeof c === 'number' || (typeof c === 'string' && c.trim() !== '' && !isNaN(Number(c.trim()))))) {
            numericCells++;
          }
        }
      }
    }

    let score = (rowCount * maxCols) + (numericCells * 5);

    const clean = name.trim();
    if (docKeywords.test(clean)) {
      score -= 5000;
    } else if (!docKeywords.test(clean) && /(?:data|dataset|observation|records|table)/i.test(clean)) {
      score += 2000;
    }

    if (score > maxScore) {
      maxScore = score;
      bestSheetName = name;
    }
  }

  return { sheetName: bestSheetName, worksheet: workbook.Sheets[bestSheetName] };
}

/**
 * Analyzes a raw 2D array of rows into structured dataset intelligence
 */
export function analyzeDataMatrix(rawRows, fileName, fileSize = null, meta = {}) {
  if (!rawRows || !Array.isArray(rawRows) || rawRows.length === 0) {
    throw new Error('The uploaded file contains no data or could not be read.');
  }

  // 1. Find the header row structurally
  const headerRowIndex = findHeaderRowIndex(rawRows);

  if (headerRowIndex === -1) {
    throw new Error('The file appears completely empty with no valid column headers.');
  }

  const rawHeaderRow = rawRows[headerRowIndex];
  const headers = sanitizeHeaders(rawHeaderRow);

  if (headers.length === 0) {
    throw new Error('No usable column headers were detected in the first row.');
  }

  // 2. Extract and filter data rows
  const rawDataRows = rawRows.slice(headerRowIndex + 1);
  const originalRows = [];
  const processedRows = [];
  let missingValueCount = 0;
  const qualityWarnings = [];

  for (let rIdx = 0; rIdx < rawDataRows.length; rIdx++) {
    const row = rawDataRows[rIdx];
    if (!row || !Array.isArray(row)) continue;

    // Check if entire row is empty
    const isAllBlank = row.every(cell => isValueMissing(cell));
    if (isAllBlank) {
      continue; // Skip entirely empty rows cleanly
    }

    const originalObj = { _rowIndex: originalRows.length + 1 };
    const processedObj = { _rowIndex: processedRows.length + 1 };

    headers.forEach((header, colIdx) => {
      const cell = colIdx < row.length ? row[colIdx] : null;

      if (isValueMissing(cell)) {
        missingValueCount++;
        originalObj[header] = null;
        processedObj[header] = null;
      } else {
        // Zero is preserved accurately!
        originalObj[header] = cell;
        processedObj[header] = cell;
      }
    });

    originalRows.push(originalObj);
    processedRows.push(processedObj);
  }

  if (originalRows.length === 0) {
    throw new Error('The file contains headers but no valid data rows were found below the header row.');
  }

  // 3. Inspect each column to classify Numerical vs Date vs Categorical
  const numericalColumns = [];
  const categoricalColumns = [];
  const dateColumns = [];
  const columnTypes = {};
  const columnNullCounts = {};
  const columnNumericCounts = {};

  headers.forEach((header) => {
    let nonMissingCount = 0;
    let numericCount = 0;
    let dateCount = 0;
    let nullCount = 0;
    const uniqueValues = new Set();

    originalRows.forEach(row => {
      const val = row[header];
      if (val === null) {
        nullCount++;
      } else {
        nonMissingCount++;
        uniqueValues.add(val);

        // Check if value can be interpreted as a valid number
        if (typeof val === 'number') {
          if (!isNaN(val) && isFinite(val)) {
            numericCount++;
          }
        } else if (typeof val === 'string') {
          const trimmed = val.trim();
          if (trimmed !== '' && !isNaN(Number(trimmed)) && isFinite(Number(trimmed))) {
            numericCount++;
          }
        }

        // Check if value represents date/time
        if (isDateValue(val)) {
          dateCount++;
        }
      }
    });

    columnNullCounts[header] = nullCount;
    columnNumericCounts[header] = numericCount;

    // Identifier check
    const isId = isIdentifierColumn(header);

    // Date check:
    // Recognized if all non-missing values are dates, or header has date keyword and >= 80% are dates
    const isDate = !isId && (
      (nonMissingCount > 0 && dateCount === nonMissingCount) ||
      (/(?:date|timestamp|datetime)/i.test(header) && nonMissingCount > 0 && dateCount / nonMissingCount >= 0.8)
    );

    // Rule:
    // 1. If column is classified as date/time -> date/time.
    // 2. If column is designated as an identifier (e.g. ID, code), treat as categorical.
    // 3. If nonMissingCount > 0 and numericCount === nonMissingCount AND not an identifier -> Numerical.
    // 4. If mixed (numericCount > 0 && numericCount < nonMissingCount), treat as Categorical (mixed text) and warn.
    // 5. Otherwise, Categorical.
    if (isDate) {
      columnTypes[header] = 'date/time';
      dateColumns.push(header);
    } else if (isId) {
      columnTypes[header] = 'categorical';
      categoricalColumns.push(header);
      qualityWarnings.push({
        type: 'info',
        column: header,
        message: `Column "${header}" has numeric digits but was classified as categorical identifier.`
      });
    } else if (nonMissingCount > 0 && numericCount === nonMissingCount) {
      columnTypes[header] = 'numerical';
      numericalColumns.push(header);

      // Cast values in processedRows to explicit Number
      processedRows.forEach(row => {
        if (row[header] !== null) {
          row[header] = Number(row[header]);
        }
      });

      // Check for zero variance / constant column
      if (uniqueValues.size === 1) {
        qualityWarnings.push({
          type: 'warning',
          column: header,
          message: `Column "${header}" has constant value (${Array.from(uniqueValues)[0]}) across all rows (zero variance).`
        });
      }
    } else if (numericCount > 0 && numericCount < nonMissingCount) {
      columnTypes[header] = 'categorical';
      categoricalColumns.push(header);
      qualityWarnings.push({
        type: 'warning',
        column: header,
        message: `Column "${header}" contains mixed numeric and text entries (${numericCount} numbers, ${nonMissingCount - numericCount} text). Classified as categorical.`
      });
    } else {
      columnTypes[header] = 'categorical';
      categoricalColumns.push(header);
    }

    // High missingness warning (> 25%)
    const missingPct = (nullCount / originalRows.length) * 100;
    if (missingPct > 25) {
      qualityWarnings.push({
        type: 'warning',
        column: header,
        message: `Column "${header}" has ${missingPct.toFixed(1)}% missing values (${nullCount}/${originalRows.length} rows).`
      });
    }
  });

  // 4. Detect duplicate rows
  const rowSignatures = new Set();
  let duplicateRowCount = 0;

  originalRows.forEach(row => {
    // Generate signature ignoring the internal _rowIndex
    const signature = headers.map(h => String(row[h])).join('||');
    if (rowSignatures.has(signature)) {
      duplicateRowCount++;
    } else {
      rowSignatures.add(signature);
    }
  });

  if (duplicateRowCount > 0) {
    qualityWarnings.push({
      type: 'warning',
      column: null,
      message: `Detected ${duplicateRowCount} duplicate row${duplicateRowCount > 1 ? 's' : ''} in the dataset.`
    });
  }

  if (numericalColumns.length === 0) {
    qualityWarnings.push({
      type: 'warning',
      column: null,
      message: 'No quantitative numerical columns detected. Statistics and regression calculations require at least one numerical variable.'
    });
  }

  const totalCells = originalRows.length * headers.length;
  const missingValuePct = totalCells > 0 ? (missingValueCount / totalCells) * 100 : 0;

  // Development / Debug Logging
  console.log('=== [INSIGHTX DATA PARSER DEBUG OUTPUT] ===');
  console.log('1. Workbook sheet names:', meta.sheetNames || ['Sheet1']);
  console.log('2. Selected sheet:', meta.selectedSheet || 'Sheet1');
  console.log('3. Detected header row:', headerRowIndex + 1, `(0-indexed: ${headerRowIndex})`);
  console.log('4. Detected column names:');
  headers.forEach(h => console.log(`   - ${h}`));
  console.log('5. First 3 parsed data rows:');
  console.log(JSON.stringify(originalRows.slice(0, 3), null, 2));
  console.log('6. Data type detected for every column:');
  headers.forEach(h => {
    const displayType = columnTypes[h] === 'numerical' ? 'number' : columnTypes[h] === 'date/time' ? 'date' : 'categorical';
    console.log(`   * ${h} → ${displayType} (${columnTypes[h]})`);
  });
  console.log('7. Count of valid numeric values for every column:');
  headers.forEach(h => {
    console.log(`   * ${h}: ${columnNumericCounts[h] || 0} numeric values`);
  });
  console.log('8. Final numericalColumns:', numericalColumns);
  console.log('9. Final categoricalColumns:', categoricalColumns);
  console.log('10. Final dataset row count:', originalRows.length);
  console.log('============================================');

  return {
    name: fileName || 'Uploaded_Dataset',
    sourceType: 'upload',
    fileSize: fileSize ? formatBytes(fileSize) : 'Unknown',
    selectedSheet: meta.selectedSheet || null,
    sheetNames: meta.sheetNames || null,
    headers,
    columnTypes,
    numericalColumns,
    categoricalColumns,
    dateColumns,
    columnNullCounts,
    columnNumericCounts,
    originalRows,
    processedRows,
    rowCount: originalRows.length,
    columnCount: headers.length,
    missingValueCount,
    missingValuePct: Number(missingValuePct.toFixed(2)),
    duplicateRowCount,
    qualityWarnings,
    loadedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };
}

/**
 * Parses a SheetJS workbook object into structured dataset intelligence
 */
export function parseWorkbook(workbook, fileName, fileSize = null) {
  if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
    throw new Error('The workbook contains no sheets.');
  }

  const { sheetName, worksheet } = selectBestWorksheet(workbook);

  // Parse sheet into 2D array of rows
  const rawRows = XLSX.utils.sheet_to_json(worksheet, {
    header: 1,
    defval: null,
    blankrows: false
  });

  return analyzeDataMatrix(rawRows, fileName, fileSize, {
    sheetNames: workbook.SheetNames,
    selectedSheet: sheetName
  });
}

/**
 * Parses file binary buffer or string into structured dataset object
 */
export async function parseDatasetFile(file) {
  if (!file) {
    throw new Error('No file provided for parsing.');
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = ['csv', 'xlsx', 'xls'];

  if (!validExtensions.includes(extension)) {
    throw new Error(`Unsupported file format ".${extension}". Please upload a valid .csv, .xlsx, or .xls file.`);
  }

  // Check file size (e.g. limit to 25MB for browser safety)
  if (file.size > 25 * 1024 * 1024) {
    throw new Error('File exceeds the 25 MB browser safety limit. Please upload a smaller dataset.');
  }

  // Modern browser File / Blob arrayBuffer support with FileReader fallback
  const buffer = await new Promise((resolve, reject) => {
    if (typeof file.arrayBuffer === 'function') {
      file.arrayBuffer().then(resolve).catch(reject);
    } else if (typeof FileReader !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = () => reject(new Error('An unexpected error occurred while reading the file from disk.'));
      reader.readAsArrayBuffer(file);
    } else {
      reject(new Error('FileReader or arrayBuffer is not available in the current runtime environment.'));
    }
  });

  // Read with SheetJS
  const workbook = XLSX.read(buffer, {
    type: 'array',
    cellDates: false,
    cellNF: false,
    raw: true
  });

  return parseWorkbook(workbook, file.name, file.size);
}
