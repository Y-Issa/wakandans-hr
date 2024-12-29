'use client';

import { useLocations } from '@/hooks/useLocations';
import LocationCard from '@/components/locations/LocationCard';
import LocationForm from '@/components/locations/LocationForm';
import ConfirmationModal from '@/components/locations/ConfirmationModal';
import { useState } from 'react';

const SettingsPage = () => {
  const {
    locations,
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
    handleDelete,
    setFormData,
  } = useLocations();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<number | null>(null);

  const toggleEdit = (location: {
    id: number;
    name: string;
    address: string;
    city: string;
    country: string;
  }) => {
    setFormData(location);
  };

  const toggleDeleteModal = (id: number) => {
    setLocationToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (locationToDelete !== null) {
      handleDelete(locationToDelete);
      setLocationToDelete(null);
    }
    setIsModalOpen(false);
  };

  return (
    <div className='p-6 bg-gray-50'>
      <h1 className='text-2xl font-semibold mb-6'>Manage Locations</h1>

      {error && <p className='text-red-500 text-sm mb-4'>{error}</p>}

      <div className='p-4 flex gap-4 flex-col md:flex-row'>
        <div className='w-full lg:w-2/3 flex flex-col gap-4'>
          <div className='space-y-4'>
            {locations.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                toggleEdit={toggleEdit}
                toggleDeleteModal={toggleDeleteModal}
              />
            ))}
            {!locations.length && (
              <p className='text-gray-500'>No locations found.</p>
            )}
          </div>
        </div>

        <LocationForm
          formData={formData}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>

      {/* Modal */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Location'
        message='Are you sure you want to delete this location? This action cannot be undone.'
      />
    </div>
  );
};

export default SettingsPage;
