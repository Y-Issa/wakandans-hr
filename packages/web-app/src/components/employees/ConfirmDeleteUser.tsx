import React from 'react';

interface ConfirmDeleteUserProps {
  selectedUser: { firstName: string; lastName: string; id: string };
  setIsDeleteModalOpen: (isOpen: boolean) => void;
  handleDelete: (userId: string) => void;
}

const ConfirmDeleteUser: React.FC<ConfirmDeleteUserProps> = ({
  selectedUser,
  setIsDeleteModalOpen,
  handleDelete,
}) => {
  return (
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
  );
};

export default ConfirmDeleteUser;
