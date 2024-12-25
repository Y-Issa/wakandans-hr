import React from 'react';

const LoadingError = ({
  isLoading,
  error,
}: {
  isLoading?: boolean;
  error?: { message?: string };
}) => (
  <div className={`text-center ${isLoading ? '' : 'text-red-500'}`}>
    {isLoading
      ? 'Loading...'
      : `Error: ${error?.message || 'An unknown error occurred'}`}
  </div>
);

export default LoadingError;
