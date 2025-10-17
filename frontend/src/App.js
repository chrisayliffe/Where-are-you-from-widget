import React, { useState, useEffect } from 'react';
import { SearchableDropdown } from './components/SearchableDropdown';
import { ResultCard } from './components/ResultCard';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { processCSVData } from './utils/csvParser';
import { Globe } from 'lucide-react';

const GOOGLE_SHEET_CSV_URL =
  'https://docs.google.com/spreadsheets/d/1TmPwlvrkV5J2EIlxRDK2I9RKBdciAEez/export?format=csv&gid=490247153';

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
      const response = await fetch(GOOGLE_SHEET_CSV_URL, {
        mode: 'cors',
        headers: {
          'Accept': 'text/csv,text/plain,*/*',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch data. Please ensure the Google Sheet is publicly accessible (Anyone with the link can view).');
      }

      const csvText = await response.text();
      const processedData = processCSVData(csvText);

      if (processedData.length === 0) {
        throw new Error('No valid data found in the sheet. Please check the CSV format.');
      }

      setData(processedData);
      
      // Extract unique countries and sort alphabetically
      const uniqueCountries = [...new Set(processedData.map(d => d.country))].sort();
      setCountries(uniqueCountries);
      
    } catch (err) {
      console.error('Error fetching data:', err);
      let errorMessage = err.message;
      
      // Provide more specific error messages
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        errorMessage = 'Unable to connect to Google Sheets. Please ensure the sheet is publicly accessible and CORS is enabled.';
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
    <div className="min-h-screen bg-background py-8 px-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-full mb-4">
            <Globe className="h-8 w-8 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
            Language Selector
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Choose your country and language to create your introduction
          </p>
        </div>

        {/* Main Widget */}
        <div className="space-y-5">
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
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-widget text-sm text-yellow-800">
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
          <div className="mt-8 text-center text-xs text-gray-500">
            Widget powered by Google Sheets
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
