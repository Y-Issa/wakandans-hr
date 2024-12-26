import React from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';
import useSWR from 'swr';
import Link from 'next/link';

interface EmployeeInfoCardProps {
  employee: {
    profile: {
      profileImage: string;
      title: string;
    };
    firstName: string;
    lastName: string;
    role: string;
    locationId?: string;
    reportsToId?: string;
    location: {
      name: string;
    };
  };
}

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const EmployeeInfoCard: React.FC<EmployeeInfoCardProps> = ({ employee }) => {
  const { data: reportsTo, error: reportsToError } = useSWR(
    employee.reportsToId
      ? `${API_BASE_URL}/users/${employee.reportsToId}`
      : null,
    fetcher,
  );

  if (reportsToError) {
    console.error(reportsToError);
  }

  return (
    <div className='bg-white py-6 px-4 rounded-md flex gap-4 shadow-md'>
      <Image
        src={employee?.profile?.profileImage || '/avatar.png'}
        alt={employee?.firstName || 'Employee Profile'}
        width={144}
        height={144}
        className='w-36 h-36 rounded-full object-cover border-2 border-teal-200'
      />
      <div className='flex flex-col justify-between gap-4 flex-1'>
        <div className='flex items-center gap-4'>
          <h1 className='text-xl font-semibold text-teal-800'>{`${employee?.firstName} ${employee?.lastName}`}</h1>
        </div>
        <p className='text-sm text-teal-600'>{employee?.profile?.title}</p>
        <div className='flex gap-2 lg:gap-6 flex-wrap text-xs font-medium text-teal-700'>
          <div>
            <span className='font-semibold text-teal-800'>Role:</span>{' '}
            {employee?.role}
          </div>
          <div>
            <span className='font-semibold text-teal-800'>Location:</span>{' '}
            {employee?.location.name || 'N/A'}
          </div>
          {employee?.reportsToId && (
            <div>
              <span className='font-semibold text-teal-800'>Reports To:</span>{' '}
              <Link href={`/employees/${employee.reportsToId}`}>
                {reportsTo?.firstName + ' ' + reportsTo?.lastName}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;
