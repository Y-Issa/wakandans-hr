'use client';

import { useParams } from 'next/navigation';
import EmployeeInfoCard from '@/components/employees/EmployeeInfoCard';
import UserTeamList from '@/components/employees/UserTeamList';
import QuickLinks from '@/components/QuickLinks';
import LoadingError from '@/components/LoadingError';
import AboutEmployee from '@/components/employees/AboutEmployee';
import UserDepartmentList from '@/components/employees/UserDepartmentList';
import { useProfile } from '@/hooks/useUsers';

const EmployeePage = () => {
  const { id } = useParams();
  const { employee, departments, teams, isLoading, error } = useProfile(
    Array.isArray(id) ? id[0] : id,
  );

  if (isLoading) return <LoadingError isLoading />;
  if (error) return <LoadingError error={error} />;

  return (
    <div className='flex-1 p-4 flex flex-col gap-4 xl:flex-row'>
      <div className='w-full xl:w-3/4 flex flex-col gap-4'>
        <div className='flex flex-col md:flex-row gap-4'>
          <div className='w-full lg:w-1/2 '>
            <EmployeeInfoCard employee={employee} />
            <UserDepartmentList departments={departments} />
            <UserTeamList teams={teams} />
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
