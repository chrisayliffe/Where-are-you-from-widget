import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState = () => {
  return (
    <div
      className="
        p-8 rounded-widget
        bg-white shadow-widget-sm
        text-center
      "
      role="status"
      aria-live="polite"
    >
      <Loader2 className="h-10 w-10 text-accent mx-auto mb-4 animate-spin" />
      <p className="text-gray-600 font-medium">
        Loading data...
      </p>
    </div>
  );
};
