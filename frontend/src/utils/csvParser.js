/**
 * Parse CSV text into rows
 * @param {string} csvText - Raw CSV text
 * @returns {Array<Array<string>>} - Array of rows, each row is an array of values
 */
export const parseCSV = (csvText) => {
  const lines = csvText.split('\n').filter(line => line.trim());
  const rows = [];

  for (let line of lines) {
    const row = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        row.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    row.push(current.trim());
    rows.push(row);
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
  
  // Skip header row if it exists (check if first row looks like headers)
  const startIndex = rows[0] && rows[0][0]?.toLowerCase().includes('country') ? 1 : 0;
  
  const data = [];
  
  for (let i = startIndex; i < rows.length; i++) {
    const row = rows[i];
    
    // Column A (index 0) = country
    // Column C (index 2) = fromC text
    // Column E (index 4) = languages
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
