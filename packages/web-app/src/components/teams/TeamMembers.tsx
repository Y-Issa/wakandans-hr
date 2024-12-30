import React, { useState } from 'react';
import { HiOutlineTrash } from 'react-icons/hi2';
import Link from 'next/link';

interface User {
  user: {
    firstName: string;
    lastName: string;
    role: string;
    id: number;
  };
}

interface TeamMembersProps {
  isLoadingTeamUsers: boolean;
  teamUsersError: boolean;
  users: User[];
  handleModalClose: () => void;
  handleDeleteMember: (id: number) => void;
}

const TeamMembers: React.FC<TeamMembersProps> = ({
  isLoadingTeamUsers,
  teamUsersError,
  users,
  handleModalClose,
  handleDeleteMember,
}) => {
  const [confirmDelete, setConfirmDelete] = useState<{
    show: boolean;
    userId: number | null;
  }>({ show: false, userId: null });

  const handleConfirmDelete = (id: number) => {
    setConfirmDelete({ show: true, userId: id });
  };

  const handleCancelDelete = () => {
    setConfirmDelete({ show: false, userId: null });
  };

  const handleProceedDelete = () => {
    if (confirmDelete.userId !== null) {
      handleDeleteMember(confirmDelete.userId);
      setConfirmDelete({ show: false, userId: null });
    }
  };

  return (
    <div
      className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center'
      onClick={(e) => {
        if (e.target === e.currentTarget) handleModalClose();
      }}
    >
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-lg font-bold mb-4'>Team Members</h2>
        <div className='space-y-4 max-h-64 overflow-y-auto'>
          {isLoadingTeamUsers ? (
            <p className='text-gray-600'>Loading members...</p>
          ) : teamUsersError ? (
            <p className='text-red-600'>Failed to load team members.</p>
          ) : users.length > 0 ? (
            users.map((user) => (
              <div
                className='flex items-center justify-between border-b pb-2 last:border-none'
                key={user.user.id}
              >
                <Link
                  href={`/employees/${user.user.id}`}
                  className='flex items-center space-x-3 group'
                >
                  <div className='w-10 h-10 bg-teal-100 text-teal-700 font-bold rounded-full flex items-center justify-center'>
                    {user.user.firstName[0]}
                    {user.user.lastName[0]}
                  </div>
                  <div>
                    <h3 className='text-sm font-medium text-gray-800 group-hover:text-teal-600'>
                      {user.user.firstName} {user.user.lastName}
                    </h3>
                    <p className='text-xs text-gray-500'>{user.user.role}</p>
                  </div>
                </Link>
                <button
                  onClick={() => handleConfirmDelete(user.user.id)}
                  className='w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 rounded-full hover:bg-red-100 mx-2'
                >
                  <HiOutlineTrash />
                </button>
              </div>
            ))
          ) : (
            <p className='text-sm text-gray-500'>No members found.</p>
          )}
        </div>
        <button
          onClick={handleModalClose}
          className='mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700'
        >
          Close
        </button>
      </div>

      {confirmDelete.show && (
        <div
          className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center'
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCancelDelete();
          }}
        >
          <div className='bg-white p-6 rounded-lg shadow-lg w-80'>
            <h3 className='text-lg font-bold mb-4'>Confirm Deletion</h3>
            <p className='text-sm text-gray-600'>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </p>
            <div className='mt-4 flex space-x-2'>
              <button
                onClick={handleProceedDelete}
                className='px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700'
              >
                Delete
              </button>
              <button
                onClick={handleCancelDelete}
                className='px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-md hover:bg-gray-200'
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamMembers;
