import React from 'react';

interface Location {
  id: string;
  name: string;
}

interface CreateTeamFormProps {
  error: string | null;
  formData: {
    name: string;
    description: string;
    locationId: string;
  };
  locations: Location[];
  loading: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  handleChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CreateTeamForm: React.FC<CreateTeamFormProps> = ({
  error,
  formData,
  locations,
  loading,
  setIsModalOpen,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
      <div className='bg-white rounded-lg shadow-lg p-6 w-full max-w-md'>
        <h2 className='text-xl font-semibold mb-4'>Create Team</h2>
        {error && <p className='text-red-500 text-sm mb-2'>{error}</p>}
        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-xs font-semibold text-gray-600'
            >
              Name
            </label>
            <input
              type='text'
              name='name'
              id='name'
              value={formData.name}
              onChange={handleChange}
              required
              className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500'
            />
          </div>
          <div>
            <label
              htmlFor='description'
              className='block text-xs font-semibold text-gray-600'
            >
              Description
            </label>
            <textarea
              name='description'
              id='description'
              value={formData.description}
              onChange={handleChange}
              required
              className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500'
            />
          </div>
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
              className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500'
            >
              <option value=''>Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type='submit'
            disabled={loading}
            className={`w-full px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded hover:bg-teal-700 transition-all ${
              loading && 'cursor-not-allowed opacity-60'
            }`}
          >
            {loading ? 'Creating...' : 'Create Team'}
          </button>
        </form>
        <button
          onClick={() => setIsModalOpen(false)}
          className='mt-4 w-full px-4 py-2 text-sm font-semibold text-gray-600 bg-gray-100 rounded hover:bg-gray-200'
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default CreateTeamForm;
