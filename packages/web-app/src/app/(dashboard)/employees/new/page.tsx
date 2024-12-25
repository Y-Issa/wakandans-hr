'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/constants';

const NewEmployeePage = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    locationId: '',
    reportsToId: '',
  });

  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [users, setUsers] = useState<
    { id: string; firstName: string; lastName: string }[]
  >([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchLocationsAndUsers = async () => {
      try {
        const [locationsResponse, usersResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/locations`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/users/managers`, {
            withCredentials: true,
          }),
        ]);

        setLocations(locationsResponse.data.data);
        setUsers(usersResponse.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch locations or users.');
      }
    };

    fetchLocationsAndUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    console.log(formData);

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        alert('Employee created successfully');
        router.push('/employees');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <div className='w-full max-w-lg p-6 bg-white rounded-lg shadow-md'>
        <h1 className='text-2xl font-bold text-center text-gray-900 mb-4'>
          Add New Employee
        </h1>
        {error && (
          <p className='text-xs text-red-500 text-center mb-4'>{error}</p>
        )}
        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* Email */}
          <div>
            <label
              htmlFor='email'
              className='block text-xs font-semibold text-gray-600'
            >
              Email
            </label>
            <input
              type='email'
              name='email'
              id='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='mt-1 block w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>

          {/* First Name */}
          <div>
            <label
              htmlFor='firstName'
              className='block text-xs font-semibold text-gray-600'
            >
              First Name
            </label>
            <input
              type='text'
              name='firstName'
              id='firstName'
              value={formData.firstName}
              onChange={handleChange}
              required
              className='mt-1 block w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>

          {/* Last Name */}
          <div>
            <label
              htmlFor='lastName'
              className='block text-xs font-semibold text-gray-600'
            >
              Last Name
            </label>
            <input
              type='text'
              name='lastName'
              id='lastName'
              value={formData.lastName}
              onChange={handleChange}
              required
              className='mt-1 block w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor='role'
              className='block text-xs font-semibold text-gray-600'
            >
              Role
            </label>
            <select
              name='role'
              id='role'
              value={formData.role}
              onChange={handleChange}
              required
              className='mt-1 block w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            >
              <option value=''>Select a role</option>
              <option value='ADMIN'>Admin</option>
              <option value='EMPLOYEE'>Employee</option>
              <option value='MANAGER'>Manager</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor='locationId'
              className='block text-xs font-semibold text-gray-600'
            >
              Location
            </label>
            <select
              name='locationId'
              id='locationId'
              value={formData.locationId}
              onChange={handleChange}
              required
              className='mt-1 block w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            >
              <option value=''>Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reports To */}
          <div>
            <label
              htmlFor='reportsToId'
              className='block text-xs font-semibold text-gray-600'
            >
              Reports To
            </label>
            <select
              name='reportsToId'
              id='reportsToId'
              value={formData.reportsToId}
              onChange={handleChange}
              className='mt-1 block w-full px-3 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400'
            >
              <option value=''>Select a manager</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className={`w-full px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-sm hover:bg-blue-700 transition ${
              loading && 'cursor-not-allowed opacity-60'
            }`}
          >
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewEmployeePage;
