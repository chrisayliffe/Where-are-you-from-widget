# Icelandic Language Selector Widget

A fully self-contained, static widget for selecting countries and learning their Icelandic names and languages.

## 🌐 Live Demo

**GitHub Pages:** https://chrisayliffe.github.io/Where-are-you-from-widget/

## ✨ Features

- 🌍 **209 Countries** - Complete dataset with Icelandic translations
- 🗣️ **Multiple Languages** - Interactive dropdown for countries with multiple official languages
- 📦 **100% Self-Contained** - Zero external dependencies or API calls
- 🚀 **Lightweight** - Only ~91 KB total (including data)
- 📱 **Fully Responsive** - Works on all devices
- 🎨 **Clean Design** - Modern, accessible interface
- 🔌 **iframe Ready** - Embed anywhere (LearnWorlds, Notion, etc.)

## 🚀 Quick Start

### Embed in your website

```html
<iframe 
  src="https://chrisayliffe.github.io/Where-are-you-from-widget/"
  width="100%" 
  height="600"
  style="border:0; max-width: 800px;"
  title="Language Selector Widget">
</iframe>
```

### Use as standalone page

Simply navigate to: https://chrisayliffe.github.io/Where-are-you-from-widget/

## 📁 Project Structure

```
/docs/                              # Production build (deployed to GitHub Pages)
├── index.html                      # Main entry point
├── .nojekyll                       # GitHub Pages config
├── static/
│   ├── css/main.*.css             # Compiled styles (3.99 kB gzipped)
│   ├── js/main.*.js               # Compiled app (62.65 kB gzipped)
│   └── data/
│       ├── countries.json         # 209 countries with Icelandic data
│       └── countries.csv          # Raw CSV backup

/frontend/                          # React source code
├── src/
│   ├── App.js                     # Main app component
│   ├── components/                # Reusable components
│   └── utils/                     # Utility functions
└── public/
    └── static/data/               # Source data files

refresh-data.sh                     # Script to update data from Google Sheets
test-build.sh                      # Verification script
```

## 🔄 Updating Data

To refresh the country data from Google Sheets:

```bash
# 1. Run the refresh script
./refresh-data.sh

# 2. Rebuild the app
cd frontend
yarn build

# 3. Copy to docs
cd ..
rm -rf docs && mkdir docs
cp -r frontend/build/* docs/
touch docs/.nojekyll

# 4. Commit and deploy
git add docs/
git commit -m "Update country data"
git push
```

The data will be automatically deployed to GitHub Pages.

## 🛠️ Development

### Prerequisites

- Node.js 14+
- Yarn

### Setup

```bash
# Install dependencies
cd frontend
yarn install

# Start development server
yarn start

# Build for production
yarn build
```

### Making Changes

1. Edit files in `/frontend/src/`
2. Test locally with `yarn start`
3. Build with `yarn build`
4. Copy `frontend/build/*` to `docs/`
5. Commit and push

## ✅ Self-Contained Verification

Run the test script to verify zero external dependencies:

```bash
./test-build.sh
```

This checks:
- ✅ No external scripts in HTML
- ✅ No external CSS imports
- ✅ No runtime API calls
- ✅ Local data file exists
- ✅ GitHub Pages configuration

## 📊 Data Format

Countries are stored as JSON:

```json
{
  "country": "Iceland",
  "fromC": "Íslandi",
  "languages": ["íslensku"]
}
```

- **country**: English name
- **fromC**: Icelandic location form (for "Ég er frá...")
- **languages**: Array of languages in Icelandic

## 🌍 Usage

1. **Select Country**: Choose from 209 countries
2. **View Translation**: See the Icelandic location name
3. **Select Language**: If multiple languages, choose one
4. **Learn**: Read the complete Icelandic sentence

Example output:
> "Ég er frá Íslandi og ég tala íslensku"
> (I am from Iceland and I speak Icelandic)

## 📝 Technical Details

### Built With

- **React** - UI framework
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **System Fonts** - No web fonts

### Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

### Performance

- **Bundle Size**: 62.65 kB JS + 3.99 kB CSS (gzipped)
- **Data Size**: 24 kB JSON
- **Total**: ~91 kB
- **Load Time**: < 1 second on 3G

## 🔐 Privacy & Security

- ✅ No analytics or tracking
- ✅ No external API calls
- ✅ No cookies
- ✅ No personal data collection
- ✅ Works offline after first load

## 📄 License

This project is open source.

## 🤝 Contributing

1. Fork the repository
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ for language learners**
