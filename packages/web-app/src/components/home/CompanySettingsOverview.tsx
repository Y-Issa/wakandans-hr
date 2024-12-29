'use client';

import Image from 'next/image';
import { useState } from 'react';
import { useCompanyConfigurations } from '@/hooks/useCompany';
import { useRouter } from 'next/navigation';
import { HiAdjustmentsHorizontal } from 'react-icons/hi2';

const CompanySettingsOverview = () => {
  const { configurations } = useCompanyConfigurations();
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  if (!configurations || configurations.length === 0) {
    return <p>No configurations available.</p>;
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % configurations.length);
  };

  const currentConfiguration = configurations[currentIndex];

  return (
    <div className='bg-white p-6 rounded-lg shadow-md mb-4 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-gray-800'>
          Company Overview
        </h2>
        <button
          className='w-12 h-12 flex items-center justify-center text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100'
          onClick={() => router.push(`/settings`)}
        >
          <HiAdjustmentsHorizontal />
        </button>
      </div>

      {/* Content */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {/* Name */}
        <div>
          <h3 className='text-lg font-medium text-gray-700'>Name</h3>
          <p className='text-gray-600'>{currentConfiguration.company.name}</p>
        </div>

        {/* Logo */}
        {currentConfiguration.logo && (
          <div>
            <Image
              src={currentConfiguration.logo}
              alt='Company Logo'
              width={96}
              height={96}
              className='object-contain rounded-full border'
            />
          </div>
        )}

        {/* Description */}
        <div className='sm:col-span-2'>
          <h3 className='text-lg font-medium text-gray-700'>Description</h3>
          <p className='text-gray-600 leading-relaxed'>
            {currentConfiguration.description}
          </p>
        </div>

        {/* Website */}
        <div className='sm:col-span-2'>
          <h3 className='text-lg font-medium text-gray-700'>Website</h3>
          <a
            href={currentConfiguration.website}
            target='_blank'
            rel='noopener noreferrer'
            className='text-teal-500 hover:underline break-all'
          >
            {currentConfiguration.website}
          </a>
        </div>
      </div>

      {/* Navigation */}
      <div className='mt-4'>
        <button
          className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition'
          onClick={handleNext}
        >
          Next Configuration
        </button>
      </div>
    </div>
  );
};

export default CompanySettingsOverview;
