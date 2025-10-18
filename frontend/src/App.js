import React, { useState, useEffect } from 'react';
import { SearchableDropdown } from './components/SearchableDropdown';
import { InlineLanguageSelector } from './components/InlineLanguageSelector';
import { ErrorState } from './components/ErrorState';
import { LoadingState } from './components/LoadingState';
import { Globe } from 'lucide-react';

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
      // Load from local JSON file in public folder
      // Using process.env.PUBLIC_URL for correct path resolution
      const response = await fetch(process.env.PUBLIC_URL + '/static/data/countries.json');
      
      if (!response.ok) {
        throw new Error('Failed to load country data. Please refresh the page.');
      }

      const jsonData = await response.json();

      if (!jsonData || jsonData.length === 0) {
        throw new Error('No valid data found.');
      }

      setData(jsonData);
      
      const uniqueCountries = [...new Set(jsonData.map(d => d.country))].sort();
      setCountries(uniqueCountries);
      
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err.message || 'Failed to load data');
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
      
      // Auto-select first language (always default to first)
      if (rowData.languages.length > 0) {
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
          <div className="text-gray-600 text-sm sm:text-base px-4">
            <p className="mb-1">
              Choose your country to learn it's name in Icelandic (you'll get asked this a lot).
            </p>
            <p>
              You'll get your language as a bonus!
            </p>
          </div>
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
                  
                  {/* Language display with inline dropdown if multiple options */}
                  {languages.length > 0 ? (
                    <InlineLanguageSelector
                      languages={languages}
                      selectedLanguage={selectedLanguage}
                      onChange={handleLanguageSelect}
                    />
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
