/**
 * Parse CSV text into rows
 * Handles quoted fields with newlines properly
 * @param {string} csvText - Raw CSV text
 * @returns {Array<Array<string>>} - Array of rows, each row is an array of values
 */
export const parseCSV = (csvText) => {
  const lines = csvText.split('\n');
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  let currentLine = '';

  for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
    const line = lines[lineIndex];
    
    // If we're continuing a quoted field from previous line, add newline
    if (inQuotes && currentLine.length > 0) {
      currentLine += '\n' + line;
    } else {
      currentLine = line;
    }

    for (let i = 0; i < currentLine.length; i++) {
      const char = currentLine[i];
      const nextChar = currentLine[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          currentField += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        currentRow.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }

    // If we're not in quotes, this line is complete
    if (!inQuotes) {
      currentRow.push(currentField.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
      currentLine = '';
    }
  }

  // Handle last row if exists
  if (currentRow.length > 0 || currentField.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
};

/**
 * Parse languages from Column E
 * Splits on common separators: , ; / |
 * @param {string} languageString - Raw language string from CSV
 * @returns {Array<string>} - Array of unique languages
 */
export const parseLanguages = (languageString) => {
  if (!languageString) return [];
  
  const separators = /[,;\/|]/;
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
