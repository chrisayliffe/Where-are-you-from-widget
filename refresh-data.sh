#!/bin/bash
# refresh-data.sh
# Script to refresh the countries data from Google Sheets

set -e

SHEET_URL="https://docs.google.com/spreadsheets/d/1ZrCA7lFcw_WV5YcgNu-slDarG5IbQCDHw30fmW1vpco/export?format=csv&gid=0"
OUTPUT_DIR="./frontend/public/static/data"

echo "🔄 Refreshing country data from Google Sheets..."

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Download CSV
echo "📥 Downloading CSV..."
curl -L -s "$SHEET_URL" > "$OUTPUT_DIR/countries.csv"

# Check if download was successful
if [ ! -s "$OUTPUT_DIR/countries.csv" ]; then
    echo "❌ Failed to download CSV data"
    exit 1
fi

echo "✓ Downloaded $(wc -l < "$OUTPUT_DIR/countries.csv") lines"

# Convert to JSON using Node.js
echo "🔄 Converting CSV to JSON..."
node << 'EOF'
const fs = require('fs');

const csvData = fs.readFileSync('./frontend/public/static/data/countries.csv', 'utf8');

function parseCSV(csvText) {
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      currentRow.push(currentField.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else if (char === '\r' && nextChar === '\n' && !inQuotes) {
      continue;
    } else if (char === '\r' && !inQuotes) {
      currentRow.push(currentField.trim());
      if (currentRow.some(cell => cell.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      currentField += char;
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(cell => cell.length > 0)) {
      rows.push(currentRow);
    }
  }

  return rows;
}

function parseLanguages(languageString) {
  if (!languageString) return [];
  
  const separators = /[,;\/|\n]/;
  const languages = languageString
    .split(separators)
    .map(lang => lang.trim())
    .filter(lang => lang.length > 0);
  
  return [...new Set(languages)];
}

const rows = parseCSV(csvData);
const data = [];

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  
  const country = (row[0] || '').trim();
  const fromC = (row[2] || '').trim();
  const languagesRaw = (row[4] || '').trim();
  
  if (!country) continue;
  
  const languages = parseLanguages(languagesRaw);
  
  data.push({ country, fromC, languages });
}

const jsonData = JSON.stringify(data, null, 2);
fs.writeFileSync('./frontend/public/static/data/countries.json', jsonData);

console.log('✓ Converted ' + data.length + ' countries to JSON');
EOF

echo "✅ Data refresh complete!"
echo ""
echo "📊 Summary:"
echo "  - CSV: $(wc -c < "$OUTPUT_DIR/countries.csv" | awk '{print int($1/1024)}')KB"
echo "  - JSON: $(wc -c < "$OUTPUT_DIR/countries.json" | awk '{print int($1/1024)}')KB"
echo ""
echo "Next steps:"
echo "  1. Review the data: cat $OUTPUT_DIR/countries.json | head -50"
echo "  2. Rebuild: cd frontend && yarn build"
echo "  3. Deploy: cp -r frontend/build/* docs/"
