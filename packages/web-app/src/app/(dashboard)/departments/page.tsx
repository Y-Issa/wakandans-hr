'use client';

import DepartmentCard from '@/components/DepartmentCard';
import Pagination from '@/components/Pagination';
import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';
import React, { useState } from 'react';
import useSWR from 'swr';

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const DepartmentList: React.FC = () => {
  const [page, setPage] = useState(0);
  const limit = 10;

  const {
    data: departmentsdata,
    error: depatmentsError,
    isLoading: isLoadingDepartments,
  } = useSWR(
    `${API_BASE_URL}/departments?page=${page}&limit=${limit}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );
  const departments = departmentsdata?.data || [];
  const hasNextPage = departmentsdata?.next || false;

  return (
    <div className=' bg-white p-6 rounded-lg shadow-md m-4'>
      <h2 className='text-2xl font-semibold'>Departments</h2>
      {isLoadingDepartments && <p>Loading...</p>}
      {depatmentsError && <p>Error loading departments.</p>}
      {departments && (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center mt-3'>
            {departments.map(
              (department: {
                id: number;
                name: string;
                description: string;
              }) => (
                <DepartmentCard key={department.id} department={department} />
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
    </div>
  );
};

export default DepartmentList;
