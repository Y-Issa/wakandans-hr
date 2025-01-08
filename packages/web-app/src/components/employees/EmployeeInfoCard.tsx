import React, { useState } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import Link from 'next/link';
import useStore from '@/lib/store';
import EditProfileForm from './EditProfileForm';
import axiosInstance from '@/lib/axiosInstance';

interface EmployeeInfoCardProps {
  employee: {
    id: number;
    profile: {
      profileImage: string;
      title: string;
      employedAt: string;
      dateOfBirth: string;
      additionalInfo: string;
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
interface ProfileData {
  id: number;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  dateOfBirth?: string;
  profileImage?: string;
  title?: string;
}
interface profileWithoutId {
  id?: number;
  bio?: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    [key: string]: string | undefined;
  };
  dateOfBirth?: string;
  profileImage?: string;
  title?: string;
}
const fetcher = (url: string) =>
  axiosInstance.get(url, { withCredentials: true }).then((res) => res.data);

const EmployeeInfoCard: React.FC<EmployeeInfoCardProps> = ({ employee }) => {
  const currentUser = useStore((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: reportsTo, error: reportsToError } = useSWR(
    employee.reportsToId
      ? `${API_BASE_URL}/users/${employee.reportsToId}`
      : null,
    fetcher,
  );

  if (reportsToError) {
    console.error(reportsToError);
  }

  const handleFormSubmit = (updatedProfile: ProfileData) => {
    try {
      const profileWithoutId: profileWithoutId = { ...updatedProfile };
      delete profileWithoutId.id;
      axios.put(`${API_BASE_URL}/profiles/${employee.id}`, profileWithoutId, {
        withCredentials: true,
      });
      mutate(
        `${API_BASE_URL}/users/${employee.id}`,
        async (cachedData) => ({
          ...cachedData,
          profile: updatedProfile,
        }),
        false,
      );
    } catch (error) {
      console.error(error);
    }

    setIsModalOpen(false);
  };

  return (
    <>
      <div className='bg-white py-6 px-4 rounded-md flex gap-4 shadow-md md:min-h-48'>
        <Image
          src={employee?.profile?.profileImage || '/avatar.png'}
          alt={employee?.firstName || 'Employee Profile'}
          width={144}
          height={144}
          className='w-36 h-36 rounded-full object-cover border-2 border-teal-200'
        />
        <div className='flex flex-col justify-between gap-4 flex-1'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-4'>
              <h1 className='text-xl font-semibold text-teal-800'>{`${employee?.firstName} ${employee?.lastName}`}</h1>
            </div>
            {currentUser?.id === employee?.id && (
              <button
                className='px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition-all text-sm font-medium'
                onClick={() => setIsModalOpen(true)}
              >
                Edit Profile
              </button>
            )}
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
            {employee?.profile?.employedAt && (
              <div>
                <span className='text-teal-800 font-semibold'>Joined At:</span>{' '}
                {new Date(employee.profile.employedAt).toLocaleDateString(
                  'en-US',
                  {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  },
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 max-w-2xl'>
            <h2 className='text-xl font-semibold text-teal-800 mb-4'>
              Edit Profile
            </h2>
            <EditProfileForm
              initialProfile={{
                id: employee.id,
                additionalInfo:
                  typeof employee.profile.additionalInfo === 'string'
                    ? JSON.parse(employee.profile.additionalInfo || '{}')
                    : employee.profile.additionalInfo,

                dateOfBirth: employee.profile.dateOfBirth,
                profileImage: employee.profile.profileImage,
                title: employee.profile.title,
              }}
              onSubmit={handleFormSubmit}
              onClose={() => setIsModalOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default EmployeeInfoCard;
