import React, { useState, useEffect } from 'react';
import { SearchableDropdown } from './components/SearchableDropdown';
import { ResultCard } from './components/ResultCard';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { processCSVData } from './utils/csvParser';
import { Globe } from 'lucide-react';

const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1TmPwlvrkV5J2EIlxRDK2I9RKBdciAEez/export?format=csv&gid=490247153';

// Alternative: Direct CSV URL if export doesn't work
const GOOGLE_SHEET_ALTERNATIVE_URL =
  'https://docs.google.com/spreadsheets/d/1TmPwlvrkV5J2EIlxRDK2I9RKBdciAEez/gviz/tq?tqx=out:csv&gid=490247153';

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
      return `Ég er frá ${fromC}, og ég tala ${language}`;
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
            Language Selector
          </h1>
          <p className="text-gray-600 text-sm sm:text-base px-4">
            Choose your country and language to create your introduction
          </p>
        </div>

        {/* Main Widget */}
        <div className="space-y-4 sm:space-y-5">
          {loading && <LoadingState />}

          {error && <ErrorState message={error} onRetry={fetchData} />}

          {!loading && !error && (
            <>
              {/* Country Selector */}
              <SearchableDropdown
                label="Select your country"
                options={countries}
                value={selectedCountry}
                onChange={handleCountrySelect}
                placeholder="Choose a country"
              />

              {/* Language Selector - Only show if multiple languages */}
              {selectedCountry && languages.length > 1 && (
                <SearchableDropdown
                  label="Select your language"
                  options={languages}
                  value={selectedLanguage}
                  onChange={handleLanguageSelect}
                  placeholder="Choose a language"
                />
              )}

              {/* Missing data warning */}
              {selectedCountry && !fromC && (
                <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-widget text-sm text-yellow-800">
                  This entry is missing location data (Column C).
                </div>
              )}

              {/* Result Card */}
              {fromC && (
                <ResultCard
                  sentence={getSentence()}
                  fromC={fromC}
                  selectedLanguage={selectedLanguage}
                />
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!loading && !error && (
          <div className="mt-6 sm:mt-8 text-center text-xs text-gray-500">
            Widget powered by Google Sheets
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
