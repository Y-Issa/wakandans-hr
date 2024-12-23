'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/constants';
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi2';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  profile: {
    profileImage: string;
    title: string;
    employedAt: Date;
    dateOfBirth: Date;
  };
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(0);
  const [limit] = useState(10); // Default limit
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
          params: { page, limit },
          withCredentials: true,
        });
        const { data, next } = response.data;
        setUsers(data);
        setHasNextPage(next);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, [page, limit]);

  return (
    <div className='bg-white shadow-md rounded-lg p-6 m-4'>
      {/* Header */}
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-semibold text-gray-800'>All Users</h1>
        <button
          onClick={() => setPage(0)} // Reset to page 0
          className='px-4 py-2 text-white bg-blue-500 rounded-lg shadow hover:bg-blue-600'
        >
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className='overflow-x-auto'>
        <table className='w-full table-auto border-collapse border border-gray-200 rounded-lg'>
          <thead className='bg-gray-100 text-gray-700'>
            <tr>
              <th className='p-4 border border-gray-200 text-left'>Name</th>
              <th className='p-4 border border-gray-200 text-left'>Email</th>
              <th className='p-4 border border-gray-200 text-left'>Role</th>
              <th className='p-4 border border-gray-200 text-center'>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className='border-t border-gray-200 hover:bg-blue-200 transition'
              >
                <td className='p-4'>
                  <div className='flex items-center'>
                    <Image
                      src={user?.profile?.profileImage || '/avatar.png'}
                      alt={`${user.firstName} ${user.lastName}`}
                      width={40}
                      height={40}
                      className='rounded-full mr-3'
                    />
                    <div>
                      <p className='font-medium'>{`${user.firstName} ${user.lastName}`}</p>
                      <p className='text-sm text-gray-500'>
                        User ID: {user.id}
                      </p>
                    </div>
                  </div>
                </td>
                <td className='p-4'>{user.email}</td>
                <td className='p-4'>{user.role}</td>
                <td className='p-4 text-center'>
                  <div className='flex items-center justify-center gap-2'>
                    <button
                      className='px-3 py-1 text-white bg-blue-500 rounded-full shadow hover:bg-blue-600'
                      onClick={() => alert(`Viewing user: ${user.id}`)}
                    >
                      <HiOutlineEye />
                    </button>
                    <button
                      className='px-3 py-1 text-white bg-red-500 rounded-full shadow hover:bg-red-600'
                      onClick={() => alert(`Deleting user: ${user.id}`)}
                    >
                      <HiOutlineTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex justify-between items-center mt-4'>
        <button
          disabled={page === 0}
          onClick={() => setPage(page - 1)}
          className={`px-4 py-2 rounded-lg ${
            page === 0
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        <button
          disabled={!hasNextPage}
          onClick={() => setPage(page + 1)}
          className={`px-4 py-2 rounded-lg ${
            !hasNextPage
              ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersList;
