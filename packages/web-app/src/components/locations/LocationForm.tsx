import { ChangeEvent, FormEvent } from 'react';

interface LocationFormProps {
  formData: {
    id?: number;
    name: string;
    address: string;
    city: string;
    country: string;
  };
  loading: boolean;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const LocationForm: React.FC<LocationFormProps> = ({
  formData,
  loading,
  handleChange,
  handleSubmit,
}) => {
  return (
    <div className='w-full lg:w-1/3 bg-white p-6 shadow-sm rounded-md'>
      <h2 className='text-xl font-medium mb-4'>
        {formData.id ? 'Edit Location' : 'Add Location'}
      </h2>
      <form onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium text-gray-700'
            >
              Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name || ''}
              onChange={handleChange}
              className='mt-1 p-2 w-full border border-gray-300 rounded-md'
              required
            />
          </div>
          <div>
            <label
              htmlFor='address'
              className='block text-sm font-medium text-gray-700'
            >
              Address
            </label>
            <input
              type='text'
              id='address'
              name='address'
              value={formData.address || ''}
              onChange={handleChange}
              className='mt-1 p-2 w-full border border-gray-300 rounded-md'
              required
            />
          </div>
          <div>
            <label
              htmlFor='city'
              className='block text-sm font-medium text-gray-700'
            >
              City
            </label>
            <input
              type='text'
              id='city'
              name='city'
              value={formData.city || ''}
              onChange={handleChange}
              className='mt-1 p-2 w-full border border-gray-300 rounded-md'
              required
            />
          </div>
          <div>
            <label
              htmlFor='country'
              className='block text-sm font-medium text-gray-700'
            >
              Country
            </label>
            <input
              type='text'
              id='country'
              name='country'
              value={formData.country || ''}
              onChange={handleChange}
              className='mt-1 p-2 w-full border border-gray-300 rounded-md'
              required
            />
          </div>
          <button
            type='submit'
            className='mt-4 p-2 bg-teal-600 text-white rounded-md hover:bg-teal-700'
            disabled={loading}
          >
            {loading ? 'Saving...' : formData.id ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default LocationForm;
