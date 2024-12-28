import React from 'react';

interface AddConfigurationProps {
  formData: {
    logo?: string;
    website?: string;
    description?: string;
    locationId?: number;
    location?: {
      id: string;
    };
  };
  locations: { id: string; name: string }[];
  loading: boolean;
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
}

const AddConfiguration: React.FC<AddConfigurationProps> = ({
  formData,
  locations,
  loading,
  handleSubmit,
  handleChange,
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4 bg-white p-6 rounded shadow'
    >
      <h2 className='text-xl font-bold'>Add Configuration</h2>
      <div>
        <label
          htmlFor='logo'
          className='block text-xs font-semibold text-gray-600'
        >
          Logo URL
        </label>
        <input
          type='url'
          name='logo'
          id='logo'
          value={formData.logo || ''}
          onChange={handleChange}
          required
          className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500'
        />
      </div>
      <div>
        <label
          htmlFor='website'
          className='block text-xs font-semibold text-gray-600'
        >
          Website
        </label>
        <input
          type='url'
          name='website'
          id='website'
          value={formData.website || ''}
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
          value={formData.description || ''}
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
          value={formData?.locationId || ''}
          onChange={handleChange}
          className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-teal-500'
        >
          <option value=''>Select a location (optional)</option>
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
        {loading ? '...loading...' : 'Save Configuration'}
      </button>
    </form>
  );
};

export default AddConfiguration;
