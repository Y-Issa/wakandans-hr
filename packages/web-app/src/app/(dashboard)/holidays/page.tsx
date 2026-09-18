'use client';

import { useHolidays } from '@/hooks/useHolidays';
import HolidayCard from '@/components/holidays/HolidayCard';
import HolidayForm from '@/components/holidays/HolidayForm';
import { useState } from 'react';
import ConfirmationModal from '@/components/locations/ConfirmationModal';
import Card from '@/components/ui/Card';

const HolidaysPage = () => {
  const {
    holidays,
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
    handleDelete,
    setFormData,
  } = useHolidays();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [holidayToDelete, setHolidayToDelete] = useState<number | null>(null);

  const toggleEdit = (holiday: {
    id: number;
    name: string;
    fromDate: string;
    toDate: string;
  }) => {
    setFormData(holiday);
  };

  const toggleDeleteModal = (id: number) => {
    setHolidayToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (holidayToDelete !== null) {
      handleDelete(holidayToDelete);
      setHolidayToDelete(null);
    }
    setIsModalOpen(false);
  };

  return (
    <div className='flex flex-col gap-6 py-4'>
      <h1 className='text-2xl font-semibold text-gray-900'>Manage Holidays</h1>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      <div className='flex gap-4 flex-col md:flex-row'>
        <div className='w-full lg:w-2/3 flex flex-col gap-4'>
          {holidays.map((holiday) => (
            <HolidayCard
              key={holiday.id}
              holiday={holiday}
              toggleEdit={toggleEdit}
              toggleDeleteModal={toggleDeleteModal}
            />
          ))}
          {!holidays.length && (
            <Card className='p-6 text-sm text-gray-400'>
              No holidays found.
            </Card>
          )}
        </div>

        <HolidayForm
          formData={formData}
          loading={loading}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title='Delete Holiday'
        message='Are you sure you want to delete this holiday? This action cannot be undone.'
      />
    </div>
  );
};

export default HolidaysPage;
