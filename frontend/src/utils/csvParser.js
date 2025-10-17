/**
 * Parse CSV text into rows
 * Properly handles quoted fields with newlines
 * @param {string} csvText - Raw CSV text
 * @returns {Array<Array<string>>} - Array of rows, each row is an array of values
 */
export const parseCSV = (csvText) => {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      // Handle escaped quotes (two quotes in a row)
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // Skip the next quote
      } else {
        // Toggle quote mode
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      // End of row
      currentRow.push(currentField.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else if (char === '\r' && nextChar === '\n' && !inQuotes) {
      // Windows line ending - skip \r, \n will be handled next iteration
      continue;
    } else if (char === '\r' && !inQuotes) {
      // Mac line ending
      currentRow.push(currentField.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      // Regular character
      currentField += char;
    }
  }

  // Handle last field and row
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
};

/**
 * Parse languages from Column E
 * Splits on common separators: , ; / | and newlines
 * @param {string} languageString - Raw language string from CSV
 * @returns {Array<string>} - Array of unique languages
 */
export const parseLanguages = (languageString) => {
  if (!languageString) return [];
  
  // Split on commas, semicolons, slashes, pipes, AND newlines
  const separators = /[,;\/|\n]/;
  const languages = languageString
    .split(separators)
    .map(lang => lang.trim())
    .filter(lang => lang.length > 0);
  
  // Remove duplicates while preserving order
  return [...new Set(languages)];
};

/**
 * Process CSV data into structured format
 * @param {string} csvText - Raw CSV text
 * @returns {Array<Object>} - Array of country data objects
 */
export const processCSVData = (csvText) => {
  const rows = parseCSV(csvText);
  
  // Skip header row (first row is always headers in this sheet)
  const startIndex = 1;
  
  const data = [];
  
  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    
    // Column A (index 0) = country in English
    // Column C (index 2) = fromC text (Icelandic location)
    // Column E (index 4) = languages (Icelandic)
    const country = (row[0] || '').trim();
    const fromC = (row[2] || '').trim();
    const languagesRaw = (row[4] || '').trim();
    
    if (!country) continue; // Skip rows without country
    
    const languages = parseLanguages(languagesRaw);
    
    data.push({
      country,
      fromC,
      languages,
    });
  }
  
  return data;
};
