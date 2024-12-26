import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';
import React from 'react';
import useSWR from 'swr';

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

interface LocationData {
  data: { id: string; name: string }[];
  next: string | null | boolean;
}

interface EditUserFormProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    locationId: string;
    reportsToId: string;
    profile: {
      title: string;
    };
  };
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

const EditUserForm: React.FC<EditUserFormProps> = ({
  formData,
  onChange,
  onSubmit,
  onCancel,
}) => {
  const { data: locationsdata, error: locationError } = useSWR<LocationData>(
    `${API_BASE_URL}/locations`,
    fetcher,
  );
  const { data: managersData, error: managerError } = useSWR<{
    data: { id: string; firstName: string; lastName: string }[];
  }>(`${API_BASE_URL}/users/managers`, fetcher);

  const locations = locationsdata?.data;
  const managers = managersData?.data;

  if (locationError || managerError)
    return (
      <p className='text-red-600'>Failed to load locations or managers.</p>
    );
  if (!locations || !managers) return <p>Loading locations and managers...</p>;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-96'>
        <h3 className='text-lg font-semibold text-gray-800'>
          Edit User Details
        </h3>
        <form onSubmit={onSubmit} className='mt-4 space-y-4'>
          <div>
            <label
              htmlFor='firstName'
              className='block text-sm font-medium text-gray-700'
            >
              First Name
            </label>
            <input
              type='text'
              id='firstName'
              name='firstName'
              value={formData.firstName}
              onChange={onChange}
              className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          <div>
            <label
              htmlFor='lastName'
              className='block text-sm font-medium text-gray-700'
            >
              Last Name
            </label>
            <input
              type='text'
              id='lastName'
              name='lastName'
              value={formData.lastName}
              onChange={onChange}
              className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={onChange}
              className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              required
            />
          </div>
          <div>
            <label
              htmlFor='role'
              className='block text-sm font-medium text-gray-700'
            >
              Role
            </label>
            <select
              id='role'
              name='role'
              value={formData.role}
              onChange={onChange}
              className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
              required
            >
              <option value='ADMIN'>Admin</option>
              <option value='EMPLOYEE'>Employee</option>
              <option value='MANAGER'>Manager</option>
            </select>
          </div>
          <div>
            <label
              htmlFor='title'
              className='block text-sm font-medium text-gray-700'
            >
              Title
            </label>
            <input
              type='text'
              id='title'
              name='title'
              value={formData.profile?.title}
              onChange={onChange}
              className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          <div>
            <label
              htmlFor='locationId'
              className='block text-sm font-medium text-gray-700'
            >
              Location
            </label>
            <select
              id='locationId'
              name='locationId'
              value={parseInt(formData.locationId)}
              onChange={onChange}
              className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            >
              {locations?.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor='managerId'
              className='block text-sm font-medium text-gray-700'
            >
              {' '}
              Reports to
            </label>
            <select
              id='reportsToId'
              name='reportsToId'
              value={parseInt(formData.reportsToId)}
              onChange={onChange}
              className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500'
            >
              <option value=''>Select a manager</option>
              {managers?.map((manager) => (
                <option key={manager.id} value={manager.id}>
                  {manager.firstName} {manager.lastName}
                </option>
              ))}
            </select>
          </div>
          <div className='flex justify-end gap-3'>
            <button
              type='button'
              className='px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300'
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserForm;
