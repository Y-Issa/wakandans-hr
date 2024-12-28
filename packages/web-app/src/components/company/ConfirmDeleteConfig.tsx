import React from 'react';

interface ConfirmDeleteConfigProps {
  selectedConfig: { company: { name: string } };
  toggleDeleteModal: (value: null) => void;
  confirmDelete: () => void;
}

const ConfirmDeleteConfig: React.FC<ConfirmDeleteConfigProps> = ({
  selectedConfig,
  toggleDeleteModal,
  confirmDelete,
}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded shadow-lg'>
        <h3 className='text-lg font-bold mb-4'>Confirm Deletion</h3>
        <p className='mb-4'>
          Are you sure you want to delete the configuration for{' '}
          <strong>{selectedConfig.company.name}</strong>?
        </p>
        <div className='flex justify-end space-x-4'>
          <button
            className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
            onClick={() => toggleDeleteModal(null)}
          >
            Cancel
          </button>
          <button
            className='px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700'
            onClick={confirmDelete}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteConfig;
