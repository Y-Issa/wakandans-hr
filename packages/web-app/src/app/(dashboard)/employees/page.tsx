'use client';

import React, { useState } from 'react';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { HiPlus } from 'react-icons/hi2';
import UserRow from '@/components/UserRow';
import Pagination from '@/components/Pagination';
import EditUserForm from '@/components/forms/EditUserForm';
import { useRouter } from 'next/navigation';
import { BiSortAlt2, BiSortAZ, BiSortZA } from 'react-icons/bi';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  locationId: string;
  reportsToId: string;
  profile: {
    profileImage: string;
    title: string;
    employedAt: Date;
    dateOfBirth: Date;
  };
}

// Fetcher function for SWR
const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const UsersList = () => {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const limit = 10;

  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/users?page=${page}&limit=${limit}&sortField=${sortBy}&sortOrder=${sortOrder}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, {
        withCredentials: true,
      });

      mutate(
        `${API_BASE_URL}/users?page=${page}&limit=${limit}&sortField=${sortBy}&sortOrder=${sortOrder}`,
        async (cachedData) => ({
          ...cachedData,
          data: cachedData?.data?.filter((user: User) => user.id !== id),
        }),
        false,
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedUser: User) => {
    try {
      const { id, ...userWithoutId } = updatedUser;
      await axios.put(`${API_BASE_URL}/users/${id}`, userWithoutId, {
        withCredentials: true,
      });
      mutate(
        `${API_BASE_URL}/users?page=${page}&limit=${limit}&sortField=${sortBy}&sortOrder=${sortOrder}`,
        async (cachedData) => ({
          ...cachedData,
          data: cachedData?.data.map((user: User) =>
            user.id === updatedUser.id ? updatedUser : user,
          ),
        }),
        false,
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
    setIsEditModalOpen(false);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const users = data?.data || [];
  const hasNextPage = data?.next || false;

  return (
    <div className='bg-gray-50 shadow-lg rounded-lg p-6 m-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>All Employees</h1>
        <button
          onClick={() => router.push('/employees/new')}
          className='px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 focus:outline-none'
        >
          <HiPlus size={20} />
        </button>
      </div>

      <div className='overflow-hidden rounded-lg border border-gray-200 shadow-sm'>
        <table className='min-w-full bg-white divide-y divide-gray-200'>
          <thead className='bg-gray-100'>
            <tr>
              <th
                onClick={() => handleSort('firstName')}
                className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer'
              >
                Name{' '}
                <span className='inline-block px-2 py-1 bg-gray-200 rounded-full align-middle'>
                  {sortBy === 'firstName' ? (
                    sortOrder === 'asc' ? (
                      <BiSortAZ />
                    ) : (
                      <BiSortZA />
                    )
                  ) : (
                    <BiSortAlt2 />
                  )}
                </span>
              </th>
              <th
                onClick={() => handleSort('email')}
                className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer'
              >
                Email
                <span className='inline-block px-2 py-1 bg-gray-200 rounded-full align-baseline'>
                  {sortBy === 'email' ? (
                    sortOrder === 'asc' ? (
                      <BiSortAZ />
                    ) : (
                      <BiSortZA />
                    )
                  ) : (
                    <BiSortAlt2 />
                  )}
                </span>
              </th>
              <th
                onClick={() => handleSort('role')}
                className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer'
              >
                Role{' '}
                <span className='inline-block px-2 py-1 bg-gray-200 rounded-full align-center'>
                  {sortBy === 'role' ? (
                    sortOrder === 'asc' ? (
                      <BiSortAZ />
                    ) : (
                      <BiSortZA />
                    )
                  ) : (
                    <BiSortAlt2 />
                  )}
                </span>
              </th>
              <th className='px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {users.map((user: User) => (
              <UserRow
                key={user.id}
                user={user}
                onEdit={handleEdit}
                onDelete={() => {
                  setSelectedUser(user);
                  setIsDeleteModalOpen(true);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>

      <Pagination
        page={page}
        hasNextPage={hasNextPage}
        onPrevious={() => setPage((prev) => Math.max(prev - 1, 0))}
        onNext={() => setPage((prev) => prev + 1)}
      />

      {isDeleteModalOpen && selectedUser && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white rounded-lg shadow-lg p-6 w-96'>
            <h3 className='text-lg font-semibold text-gray-800'>
              Confirm Deletion
            </h3>
            <p className='mt-2 text-sm text-gray-600'>
              Are you sure you want to delete{' '}
              <span className='font-semibold'>
                {selectedUser.firstName} {selectedUser.lastName}
              </span>
              ? This action cannot be undone.
            </p>
            <div className='mt-4 flex justify-end gap-3'>
              <button
                className='px-4 py-2 bg-gray-200 rounded-lg text-gray-700 hover:bg-gray-300'
                onClick={() => setIsDeleteModalOpen(false)}
              >
                Cancel
              </button>
              <button
                className='px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700'
                onClick={() => handleDelete(selectedUser.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {isEditModalOpen && selectedUser && (
        <EditUserForm
          formData={selectedUser}
          onChange={(e) =>
            setSelectedUser({
              ...selectedUser,
              [e.target.name]: e.target.value,
            })
          }
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSubmit(selectedUser);
          }}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UsersList;
