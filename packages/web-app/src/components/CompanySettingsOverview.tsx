'use client';

import React from 'react';
import Image from 'next/image';

const CompanySettingsOverview = () => {
  const companySettings = {
    name: 'Example Inc.',
    logo: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    description:
      'A leading software development company specializing in HR solutions.',
    website: 'https://www.example.com',
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-md mb-4 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-gray-800'>
          Company Overview
        </h2>
        <button
          className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
          onClick={() => {
            alert('Redirecting to the detailed settings page...');
          }}
        >
          Edit Settings
        </button>
      </div>

      {/* Content */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {/* Name */}
        <div>
          <h3 className='text-lg font-medium text-gray-700'>Name</h3>
          <p className='text-gray-600'>{companySettings.name}</p>
        </div>

        {/* Logo */}
        {companySettings.logo && (
          <div>
            <Image
              src={companySettings.logo}
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
            {companySettings.description}
          </p>
        </div>

        {/* Website */}
        <div className='sm:col-span-2'>
          <h3 className='text-lg font-medium text-gray-700'>Website</h3>
          <a
            href={companySettings.website}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:underline break-all'
          >
            {companySettings.website}
          </a>
        </div>
      </div>
    </div>
  );
};

export default CompanySettingsOverview;
