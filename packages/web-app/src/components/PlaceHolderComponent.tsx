import React from 'react';

interface PlaceholderComponentProps {
  title?: string;
  description?: string;
}

const PlaceholderComponent: React.FC<PlaceholderComponentProps> = ({
  title = 'Coming Soon',
  description = 'This feature is under development. Stay tuned for updates!',
}) => {
  return (
    <div className='bg-gray-100 p-4 rounded-md shadow-md flex flex-col items-center justify-center'>
      <h2 className='text-lg font-semibold text-gray-800'>{title}</h2>
      <p className='mt-2 text-sm text-gray-600 text-center'>{description}</p>
    </div>
  );
};

export default PlaceholderComponent;
