import React from 'react';
import { Loader2 } from 'lucide-react';

export const Spinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
    </div>
  );
};
