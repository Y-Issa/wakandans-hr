'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useSWR, { mutate } from 'swr';
import DepartmentCard from '@/components/department/DepartmentCard';
import Pagination from '@/components/Pagination';
import { API_BASE_URL } from '@/lib/constants';
import CreateDepartmentForm from '@/components/department/CreateDepartmentForm';

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const DepartmentList: React.FC = () => {
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    locationId: '',
  });
  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const limit = 10;
  const {
    data: departmentsData,
    error: departmentsError,
    isLoading: isLoadingDepartments,
  } = useSWR(
    `${API_BASE_URL}/departments?page=${page}&limit=${limit}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );
  const departments = departmentsData?.data || [];
  const hasNextPage = departmentsData?.next || false;

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/locations`, {
          withCredentials: true,
        });
        setLocations(response.data.data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError('Failed to fetch locations.');
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/departments`,
        formData,
        {
          withCredentials: true,
        },
      );

      if (response.status === 201) {
        mutate(`${API_BASE_URL}/departments?page=${page}&limit=${limit}`);

        setIsModalOpen(false);
        setFormData({ name: '', description: '', locationId: '' });
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create department. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-md m-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Departments</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-teal-700 hover:bg-teal-800 text-white font-bold py-2 px-4 rounded'
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
          error={error}
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
