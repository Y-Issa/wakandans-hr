'use client';

import React from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { useParams } from 'next/navigation';
import EmployeeInfoCard from '@/components/EmployeeInfoCard';
import TeamList from '@/components/TeamList';
import QuickLinks from '@/components/QuickLinks';
import LoadingError from '@/components/LoadingError';
import AboutEmployee from '@/components/AboutEmployee';
import UserDepartmentList from '@/components/UserDepartmentList';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const EmployeePage = () => {
  const { id } = useParams();

  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeLoading,
  } = useSWR(id ? `${API_BASE_URL}/users/${id}` : null, fetcher);
  const { data: departmentData, error: departmentError } = useSWR(
    id ? `${API_BASE_URL}/userDepartments/user/${id}` : null,
    fetcher,
  );
  const { data: teamData, error: teamError } = useSWR(
    id ? `${API_BASE_URL}/userTeams/user/${id}` : null,
    fetcher,
  );

  if (employeeLoading || !departmentData || !teamData)
    return <LoadingError isLoading />;
  if (employeeError || departmentError || teamError) {
    return (
      <LoadingError error={employeeError || departmentError || teamError} />
    );
  }

  const employee = employeeData;
  const departments = departmentData?.data || [];
  const teams = teamData?.data || [];
  console.log(employee);

  return (
    <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
      <div className='w-full xl:w-3/4 flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full lg:w-1/2 '>
            <EmployeeInfoCard employee={employee} />
            <UserDepartmentList departments={departments} />
            <TeamList teams={teams} />
          </div>
          <div className='w-full lg:w-1/2'>
            <AboutEmployee profile={employee?.profile} />
          </div>
        </div>
      </div>
      <div className='w-full xl:w-1/4'>
        <QuickLinks employeeId={Array.isArray(id) ? id[0] : id} />
      </div>
    </div>
  );
};

export default EmployeePage;
