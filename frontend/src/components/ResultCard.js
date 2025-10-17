import React from 'react';

export const ResultCard = ({ sentence, fromC, selectedLanguage }) => {
  if (!fromC) {
    return null;
  }

  return (
    <div
      className="
        p-4 sm:p-6 rounded-widget
        bg-result-bg text-result-text
        shadow-widget-md
        transition-all duration-500
        animate-in fade-in slide-in-from-bottom-4
      "
      role="status"
      aria-live="polite"
    >
      <p className="text-xl sm:text-2xl md:text-3xl font-semibold leading-relaxed">
        {sentence}
      </p>
      
      {!selectedLanguage && (
        <p className="text-xs sm:text-sm mt-2 sm:mt-3 opacity-90">
          Select a language to complete the sentence
        </p>
      )}
    </div>
  );
};
