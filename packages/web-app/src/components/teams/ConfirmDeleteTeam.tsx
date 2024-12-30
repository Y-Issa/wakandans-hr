import React from 'react';

interface ConfirmDeleteProps {
  team: { name: string };
  toggleModal: (modalName: string, state: boolean) => void;
  handleDelete: () => void;
}

const ConfirmDeleteTeam: React.FC<ConfirmDeleteProps> = ({
  team,
  toggleModal,
  handleDelete,
}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-lg font-medium mb-4'>Confirm Deletion</h2>
        <p className='text-gray-600 mb-4'>
          Are you sure you want to delete the team &quot;
          {team.name}&quot;?
        </p>
        <div className='flex justify-end space-x-4'>
          <button
            onClick={() => toggleModal('showDeleteModal', false)}
            className='px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300'
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className='px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteTeam;
