# Language Selector Widget - Embed Instructions

## Overview
This widget reads data from a Google Sheet and allows users to select their country and language to generate an Icelandic introduction sentence: "Ég er frá {location}, og ég tala {language}".

## Requirements

### Google Sheets Setup
1. **Make your Google Sheet publicly accessible:**
   - Open your Google Sheet
   - Click "Share" (top right)
   - Under "General access", select "Anyone with the link"
   - Set permission to "Viewer"
   - Click "Done"

2. **Sheet Format:**
   - Column A: Country names (English)
   - Column C: Location text in Icelandic (e.g., "Bandaríkjunum")
   - Column E: Languages (can contain multiple, separated by comma, semicolon, slash, or pipe)

3. **Get your Sheet ID:**
   - Your sheet URL looks like: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit#gid=[GID]`
   - Replace `SHEET_ID` and `GID` in the widget's `App.js` file

### Update the Widget

In `/app/frontend/src/App.js`, update these constants:

```javascript
const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/[YOUR_SHEET_ID]/export?format=csv&gid=[YOUR_GID]';

const GOOGLE_SHEET_ALTERNATIVE_URL =
  'https://docs.google.com/spreadsheets/d/[YOUR_SHEET_ID]/gviz/tq?tqx=out:csv&gid=[YOUR_GID]';
```

## Embedding the Widget

### For LearnWorlds or Other LMS

1. **Get your widget URL** (after deployment):
   ```
   https://your-app-url.emergent.sh
   ```

2. **Embed using iframe**:
   ```html
   <iframe 
     src="https://your-app-url.emergent.sh"
     width="100%" 
     height="600" 
     style="border:0; max-width: 800px; margin: 0 auto; display: block;"
     loading="lazy" 
     referrerpolicy="no-referrer-when-downgrade"
     allow="clipboard-read; clipboard-write"
     title="Language Selector Widget">
   </iframe>
   ```

3. **Responsive iframe (recommended)**:
   ```html
   <div style="max-width: 800px; margin: 0 auto; padding: 20px;">
     <iframe 
       src="https://your-app-url.emergent.sh"
       width="100%" 
       height="600" 
       style="border:0; border-radius: 16px; box-shadow: 0 4px 16px rgba(0,0,0,0.1);"
       loading="lazy"
       title="Language Selector Widget">
     </iframe>
   </div>
   ```

## Features

- ✅ **Searchable Dropdowns**: Type-ahead search for countries and languages
- ✅ **Auto-select Single Language**: If a country has only one language, it's automatically selected
- ✅ **Mobile Responsive**: Works on all screen sizes
- ✅ **Accessible**: Proper ARIA labels and keyboard navigation
- ✅ **Error Handling**: Clear error messages with retry functionality
- ✅ **Live Updates**: Sentence updates in real-time as selections change

## Troubleshooting

### Widget shows "Unable to Load Data"
1. Verify the Google Sheet is publicly accessible
2. Check that the sheet ID and GID are correct
3. Ensure columns A, C, and E contain data
4. Try the "Retry" button

### Dropdown not visible on mobile
- The widget is fully responsive and should work on all devices
- If issues persist, check that the iframe has proper width and height settings

### CORS Errors
- Ensure the Google Sheet is set to "Anyone with the link can view"
- The widget tries multiple URL formats automatically
- Check browser console for specific error messages

## Customization

### Colors
Edit `/app/frontend/src/index.css`:
```css
:root {
  --accent: 8 86% 60%;       /* Coral button color */
  --result-bg: 154 71% 43%;  /* Green result background */
}
```

### Font
The widget uses **Outfit** font. To change, edit `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=YourFont:wght@400;500;600;700&display=swap');

body {
  font-family: 'YourFont', sans-serif;
}
```

## Support

For technical issues or questions, refer to:
- Widget documentation
- Emergent.sh support
- Google Sheets API documentation

## Size & Performance

- Widget size: ~800×600px optimal
- Loads in < 2 seconds
- Mobile-friendly: minimum 320px width
- No external dependencies except Google Sheets
