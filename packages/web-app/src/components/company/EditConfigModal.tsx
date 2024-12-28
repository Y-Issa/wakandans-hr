import React, { useState } from 'react';
import { CompanyConfiguration } from '@/hooks/useCompany';

interface EditConfigModalProps {
  selectedConfig: CompanyConfiguration;
  toggleEditModal: (config: CompanyConfiguration | null) => void;
  handleUpdate: (
    id: string,
    updatedData: Partial<CompanyConfiguration>,
  ) => void;
  locations: { id: string; name: string }[];
}

const EditConfigModal: React.FC<EditConfigModalProps> = ({
  selectedConfig,
  toggleEditModal,
  handleUpdate,
  locations,
}) => {
  const [formData, setFormData] = useState<Partial<CompanyConfiguration>>({
    ...selectedConfig,
    locationId: selectedConfig.location?.id || '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'locationId' ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleUpdate(selectedConfig.id, formData);
    toggleEditModal(null);
  };

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded shadow-lg w-96'>
        <h3 className='text-lg font-bold mb-4'>Edit Configuration</h3>
        <form onSubmit={handleSubmit}>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-1'>Logo URL</label>
            <input
              type='url'
              name='logo'
              value={formData.logo || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-1'>Website</label>
            <input
              type='text'
              name='website'
              value={formData.website || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-1'>Description</label>
            <textarea
              name='description'
              value={formData.description || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            />
          </div>
          <div className='mb-4'>
            <label className='block text-sm font-bold mb-1'>Location</label>
            <select
              name='locationId'
              value={formData.locationId || ''}
              onChange={handleChange}
              className='w-full p-2 border rounded'
            >
              <option value=''>Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>
          <div className='flex justify-end space-x-4'>
            <button
              type='button'
              className='px-4 py-2 bg-gray-200 rounded hover:bg-gray-300'
              onClick={() => toggleEditModal(null)}
            >
              Cancel
            </button>
            <button
              type='submit'
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditConfigModal;
