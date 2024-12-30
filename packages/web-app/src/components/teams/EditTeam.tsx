import React from 'react';

interface EditTeamProps {
  editFormData: {
    name: string;
    description: string;
  };
  handleEditChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleEditSubmit: () => void;
  toggleModal: (modalName: string, state: boolean) => void;
}

const EditTeam: React.FC<EditTeamProps> = ({
  editFormData,
  handleEditChange,
  handleEditSubmit,
  toggleModal,
}) => {
  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
        <h2 className='text-lg font-medium mb-4'>Edit Team</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSubmit();
          }}
          className='space-y-4'
        >
          <div>
            <label className='block text-sm font-medium text-gray-600'>
              Name
            </label>
            <input
              type='text'
              name='name'
              value={editFormData.name}
              onChange={handleEditChange}
              required
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-600'>
              Description
            </label>
            <textarea
              name='description'
              value={editFormData.description}
              onChange={handleEditChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500'
            />
          </div>
          <button
            type='submit'
            className='w-full px-4 py-2 text-white bg-teal-600 rounded-md hover:bg-teal-700'
          >
            Save Changes
          </button>
          <button
            type='button'
            onClick={() => toggleModal('showEditModal', false)}
            className='w-full px-4 py-2 text-gray-600 bg-gray-200 rounded-md hover:bg-gray-300'
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTeam;
