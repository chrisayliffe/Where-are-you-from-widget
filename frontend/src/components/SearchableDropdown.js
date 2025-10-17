import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';

export const SearchableDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  label,
  disabled = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  const handleSelect = (option) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-semibold mb-2 text-text">
          {label}
        </label>
      )}
      
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-3.5 rounded-widget
          bg-accent text-accent-text
          font-medium text-left text-base
          flex items-center justify-between
          transition-all duration-300
          shadow-widget-sm
          hover:shadow-widget-md active:shadow-widget-md
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
          disabled:opacity-50 disabled:cursor-not-allowed
          min-h-[56px] touch-manipulation
          ${isOpen ? 'shadow-widget-md' : ''}
        `}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate text-left block">
          {value || placeholder}
        </span>
        <ChevronDown
          className={`ml-2 h-5 w-5 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          className="
            absolute z-50 w-full mt-2
            bg-white rounded-widget shadow-widget-lg
            border border-gray-200
            max-h-80 overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-200
          "
          role="listbox"
        >
          <div className="p-2 border-b border-gray-200 bg-gray-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type to search..."
                className="
                  w-full pl-10 pr-4 py-2
                  border border-gray-300 rounded-lg
                  focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent
                  text-sm
                "
                aria-label="Search options"
              />
            </div>
          </div>

          <div className="overflow-y-auto max-h-64 p-1">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No results found
              </div>
            ) : (
              filteredOptions.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleSelect(option)}
                  className={`
                    w-full px-4 py-2.5 text-left
                    hover:bg-accent hover:text-accent-text
                    transition-colors duration-150
                    rounded-lg
                    ${value === option ? 'bg-accent/10 font-medium' : ''}
                  `}
                  role="option"
                  aria-selected={value === option}
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
