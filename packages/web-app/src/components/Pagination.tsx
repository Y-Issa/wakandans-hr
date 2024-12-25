// components/users/Pagination.tsx
import React from 'react';

interface PaginationProps {
  page: number;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  hasNextPage,
  onPrevious,
  onNext,
}) => (
  <div className='flex justify-between items-center mt-6'>
    <button
      disabled={page === 0}
      onClick={onPrevious}
      className={`px-4 py-2 rounded-lg shadow-sm ${
        page === 0
          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none'
      }`}
    >
      Previous
    </button>
    <button
      disabled={!hasNextPage}
      onClick={onNext}
      className={`px-4 py-2 rounded-lg shadow-sm ${
        !hasNextPage
          ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
          : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none'
      }`}
    >
      Next
    </button>
  </div>
);

export default Pagination;
