import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export const ErrorState = ({ message, onRetry }) => {
  return (
    <div
      className="
        p-6 rounded-widget
        bg-white border-2 border-error/20
        shadow-widget-sm
        text-center
      "
      role="alert"
      aria-live="assertive"
    >
      <AlertCircle className="h-12 w-12 text-error mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-error mb-2">
        Unable to Load Data
      </h3>
      <p className="text-gray-600 mb-4 text-sm">
        {message || 'Could not load data. Please check the sharing settings or try again.'}
      </p>
      <button
        onClick={onRetry}
        className="
          inline-flex items-center gap-2
          px-6 py-3 rounded-lg
          bg-accent text-accent-text
          font-medium
          transition-all duration-300
          hover:shadow-widget-md
          focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
        "
      >
        <RefreshCw className="h-4 w-4" />
        Retry
      </button>
    </div>
  );
};
