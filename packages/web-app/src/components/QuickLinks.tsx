import React from 'react';
import { useRouter } from 'next/navigation';
import SectionWrapper from './sectionWraper';

const QuickLinks = ({ employeeId }: { employeeId: string }) => {
  const router = useRouter();
  return (
    <SectionWrapper title='Quick Links'>
      <div className='flex gap-4'>
        <button
          onClick={() => router.push(`/employees/performance/${employeeId}`)}
          className='p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition'
        >
          View Performance
        </button>
        <button
          onClick={() => router.push(`/employees/documents/${employeeId}`)}
          className='p-3 rounded-md bg-gray-100 hover:bg-gray-200 transition'
        >
          View Documents
        </button>
      </div>
    </SectionWrapper>
  );
};

export default QuickLinks;
