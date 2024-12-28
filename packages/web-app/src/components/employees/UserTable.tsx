import React from 'react';
import { BiSortAZ, BiSortZA, BiSortAlt2 } from 'react-icons/bi';
import UserRow from './UserRow';

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

interface UserTableProps {
  users: User[];
  sortBy: string;
  sortOrder: string;
  onSort: (field: string) => void;
  onEdit: (user: User) => void;
  setSelectedUser: (user: User) => void;
  setIsDeleteModalOpen: (isOpen: boolean) => void;
}

const UserTable: React.FC<UserTableProps> = ({
  users,
  sortBy,
  sortOrder,
  onSort,
  onEdit,
  setSelectedUser,
  setIsDeleteModalOpen,
}) => {
  return (
    <table className='min-w-full bg-white divide-y divide-gray-200'>
      <thead className='bg-gray-100'>
        <tr>
          <th
            onClick={() => onSort('firstName')}
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
            onClick={() => onSort('email')}
            className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer'
          >
            Email{' '}
            <span className='inline-block px-2 py-1 bg-gray-200 rounded-full align-middle'>
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
            onClick={() => onSort('role')}
            className='px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer'
          >
            Role{' '}
            <span className='inline-block px-2 py-1 bg-gray-200 rounded-full align-middle'>
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
            onEdit={onEdit}
            onDelete={() => {
              setSelectedUser(user);
              setIsDeleteModalOpen(true);
            }}
          />
        ))}
      </tbody>
    </table>
  );
};

export default UserTable;
