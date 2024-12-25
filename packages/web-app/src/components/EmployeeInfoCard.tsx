import React from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';
import useSWR from 'swr';

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
  onEdit: () => void;
}

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const EmployeeInfoCard: React.FC<EmployeeInfoCardProps> = ({
  employee,
  onEdit,
}) => {
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
    <div className='bg-blue-100 py-6 px-4 rounded-md flex gap-4 shadow-md'>
      <Image
        src={
          employee?.profile?.profileImage || 'https://via.placeholder.com/144'
        }
        alt={employee?.firstName || 'Employee Profile'}
        width={144}
        height={144}
        className='w-36 h-36 rounded-full object-cover'
      />
      <div className='flex flex-col justify-between gap-4 flex-1'>
        <div className='flex items-center gap-4'>
          <h1 className='text-xl font-semibold'>{`${employee?.firstName} ${employee?.lastName}`}</h1>
          <button
            onClick={onEdit}
            className='px-4 py-2 text-white bg-blue-600 rounded-lg'
          >
            Edit
          </button>
        </div>
        <p className='text-sm text-gray-500'>{employee?.profile?.title}</p>
        <div className='flex gap-2 lg:gap-6 flex-wrap text-xs font-medium'>
          <div>Role: {employee?.role}</div>
          <div>Location: {employee?.location.name || 'N/A'}</div>
          <div>
            Reports To:{' '}
            {employee?.reportsToId
              ? reportsTo?.firstName + ' ' + reportsTo?.lastName
              : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeInfoCard;
