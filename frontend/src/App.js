import React, { useState, useEffect } from 'react';
import { SearchableDropdown } from './components/SearchableDropdown';
import { ResultCard } from './components/ResultCard';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { processCSVData } from './utils/csvParser';
import { Globe } from 'lucide-react';

const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1ZrCA7lFcw_WV5YcgNu-slDarG5IbQCDHw30fmW1vpco/export?format=csv&gid=0';

// Alternative: Direct CSV URL if export doesn't work
const GOOGLE_SHEET_ALTERNATIVE_URL =
  'https://docs.google.com/spreadsheets/d/1ZrCA7lFcw_WV5YcgNu-slDarG5IbQCDHw30fmW1vpco/gviz/tq?tqx=out:csv&gid=0';

function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const [countries, setCountries] = useState([]);
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [fromC, setFromC] = useState('');
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Try primary URL first
      let response;
      let csvText;
      
      try {
        response = await fetch(GOOGLE_SHEET_CSV_URL, {
          method: 'GET',
          mode: 'cors',
        });
        
        if (!response.ok) {
          throw new Error('Primary URL failed');
        }
        
        csvText = await response.text();
      } catch (primaryError) {
        console.warn('Primary URL failed, trying alternative:', primaryError);
        
        // Try alternative URL
        response = await fetch(GOOGLE_SHEET_ALTERNATIVE_URL, {
          method: 'GET',
          mode: 'cors',
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch data from Google Sheets. Please ensure the sheet is publicly accessible (Anyone with the link can view).');
        }
        
        csvText = await response.text();
      }

      const processedData = processCSVData(csvText);

      if (processedData.length === 0) {
        throw new Error('No valid data found in the sheet. Please check the CSV format and ensure data exists in columns A, C, and E.');
      }

      setData(processedData);
      
      // Extract unique countries and sort alphabetically
      const uniqueCountries = [...new Set(processedData.map(d => d.country))].sort();
      setCountries(uniqueCountries);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      let errorMessage = err.message;
      
      // Provide more specific error messages
      if (err.name === 'TypeError' && (err.message.includes('fetch') || err.message.includes('NetworkError'))) {
        errorMessage = 'Unable to connect to Google Sheets. Please ensure:\n\n• The sheet is publicly accessible (Share > Anyone with the link can view)\n• Your internet connection is stable\n• CORS is not being blocked by your browser';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    
    const rowData = data.find(d => d.country === country);
    
    if (rowData) {
      setFromC(rowData.fromC);
      setLanguages(rowData.languages);
      
      // Auto-select if only one language
      if (rowData.languages.length === 1) {
        setSelectedLanguage(rowData.languages[0]);
      } else {
        setSelectedLanguage('');
      }
    } else {
      setFromC('');
      setLanguages([]);
      setSelectedLanguage('');
    }
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
  };

  const getSentence = () => {
    if (!fromC) return '';
    
    const language = selectedLanguage || (languages.length === 1 ? languages[0] : '');
    
    if (language) {
      return `Ég er frá ${fromC} og ég tala ${language}`;
    }
    
    return `Ég er frá ${fromC}`;
  };

  return (
    <div className="min-h-screen bg-background py-4 sm:py-8 px-4 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 bg-accent/10 rounded-full mb-3 sm:mb-4">
            <Globe className="h-7 w-7 sm:h-8 sm:w-8 text-accent" />
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-2">
            Hvaðan ertu?
          </h1>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            Choose your country to learn it's name in Icelandic (you'll get asked this a lot). You'll get your language as a bonus!
          </p>
        </div>

        {/* Main Widget */}
        <div className="space-y-4 sm:space-y-5">
          {loading && <LoadingState />}

          {error && <ErrorState message={error} onRetry={fetchData} />}

          {!loading && !error && (
            <>
              {/* Country Selector - No label */}
              <SearchableDropdown
                options={countries}
                value={selectedCountry}
                onChange={handleCountrySelect}
                placeholder="Choose a country"
              />

              {/* Language Selector - Only show if multiple languages */}
              {selectedCountry && languages.length > 1 && (
                <div className="relative">
                  <SearchableDropdown
                    options={languages}
                    value={selectedLanguage}
                    onChange={handleLanguageSelect}
                    placeholder="Choose a language"
                  />
                </div>
              )}

              {/* Missing data warning */}
              {selectedCountry && !fromC && (
                <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-widget text-sm text-yellow-800">
                  This entry is missing location data (Column C).
                </div>
              )}

              {/* Always visible sentence with inline green boxes */}
              <div className="p-4 sm:p-6 rounded-lg bg-white border border-gray-200">
                <div className="flex flex-wrap items-center gap-2 text-base font-normal leading-relaxed">
                  <span className="text-text">Ég er frá</span>
                  {fromC ? (
                    <span className="inline-block px-3 py-1 rounded-lg bg-result-bg text-result-text">
                      {fromC}
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-lg border-2 border-dashed border-result-bg text-result-bg">
                      ___
                    </span>
                  )}
                  <span className="text-text">og ég tala</span>
                  
                  {/* Language display with dropdown if multiple options */}
                  {languages.length > 1 ? (
                    <div className="relative inline-block">
                      <button
                        onClick={() => {
                          // Find and click the hidden language dropdown
                          const languageDropdown = document.querySelector('[aria-label="language-selector"]');
                          if (languageDropdown) {
                            languageDropdown.click();
                          }
                        }}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-result-bg text-result-text hover:bg-opacity-90 transition-colors"
                      >
                        <span>{selectedLanguage || languages[0]}</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  ) : (selectedLanguage || (languages.length === 1 && languages[0])) ? (
                    <span className="inline-block px-3 py-1 rounded-lg bg-result-bg text-result-text">
                      {selectedLanguage || languages[0]}
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 rounded-lg border-2 border-dashed border-result-bg text-result-bg">
                      ___
                    </span>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
