'use client';

import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import DepartmentCard from '@/components/department/DepartmentCard';
import Pagination from '@/components/Pagination';
import CreateDepartmentForm from '@/components/department/CreateDepartmentForm';
import PillButton from '@/components/ui/PillButton';
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
    <div className='flex flex-col gap-6 py-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-gray-900'>Departments</h1>
        <PillButton onClick={() => setIsModalOpen(true)}>
          <HiPlus size={16} />
          Add Department
        </PillButton>
      </div>
      {isLoadingDepartments && <p className='text-gray-400'>Loading...</p>}
      {departmentsError && (
        <p className='text-red-500'>Error loading departments.</p>
      )}
      {departments && (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
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
