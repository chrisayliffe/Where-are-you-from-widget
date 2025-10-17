import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export const InlineLanguageSelector = ({ languages, selectedLanguage, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (language) => {
    onChange(language);
    setIsOpen(false);
  };

  if (languages.length <= 1) {
    return (
      <span className="inline-block px-3 py-1 rounded-lg bg-result-bg text-result-text">
        {selectedLanguage || languages[0]}
      </span>
    );
  }

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-result-bg text-result-text hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-result-bg focus:ring-offset-2"
      >
        <span>{selectedLanguage || languages[0]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 min-w-[200px] bg-white rounded-lg shadow-widget-lg border border-gray-200 py-1 left-0">
          {languages.map((language, index) => (
            <button
              key={index}
              onClick={() => handleSelect(language)}
              className={`
                w-full px-4 py-2 text-left text-sm
                hover:bg-result-bg hover:text-result-text
                transition-colors duration-150
                ${selectedLanguage === language ? 'bg-result-bg/10 font-medium' : ''}
              `}
            >
              {language}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
