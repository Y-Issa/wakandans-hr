'use client';

import React, { useState } from 'react';
import DepartmentCard from '@/components/department/DepartmentCard';
import Pagination from '@/components/Pagination';
import CreateDepartmentForm from '@/components/department/CreateDepartmentForm';
import {
  useDepartmentForm,
  useDepartments,
  useLocations,
} from '@/hooks/useDepartment';

const DepartmentList: React.FC = () => {
  const [page, setPage] = useState(0);

  const limit = 10;
  const {
    departments,
    hasNextPage,
    isLoading: isLoadingDepartments,
    error: departmentsError,
  } = useDepartments(page, limit);

  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error: formError,
    isModalOpen,
    setIsModalOpen,
  } = useDepartmentForm(page, limit);

  const { locations } = useLocations();

  return (
    <div className='bg-white p-6 rounded-lg shadow-md m-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Departments</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'
        >
          Add Department
        </button>
      </div>
      {isLoadingDepartments && <p>Loading...</p>}
      {departmentsError && <p>Error loading departments.</p>}
      {departments && (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center mt-3'>
            {departments.map(
              (department: {
                id: number;
                name: string;
                description: string;
                locationId: number;
              }) => (
                <DepartmentCard
                  key={department.id}
                  department={department}
                  page={page}
                />
              ),
            )}
          </div>
          {(departments.length > limit || page > 0) && (
            <Pagination
              page={page}
              hasNextPage={hasNextPage}
              onPrevious={() => setPage(page - 1)}
              onNext={() => setPage(page + 1)}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <CreateDepartmentForm
          error={formError}
          formData={formData}
          locations={locations}
          loading={loading}
          setIsModalOpen={setIsModalOpen}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default DepartmentList;
