import React from 'react';

interface SectionWrapperProps {
  title: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ title, children }) => {
  return (
    <div className='mt-4 bg-white rounded-md p-4 shadow-md'>
      <h1 className='text-xl font-semibold'>{title}</h1>
      <div>{children}</div>
    </div>
  );
};

export default SectionWrapper;
