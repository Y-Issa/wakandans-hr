import { API_BASE_URL } from '@/lib/constants';
import useStore from '@/lib/store';
import axios from 'axios';
import { FaBuildingUser } from 'react-icons/fa6';
import { useState } from 'react';
import useSWR from 'swr';
import Link from 'next/link';

interface DepartmentCardProps {
  department: {
    id: number;
    name: string;
    description: string;
  };
}

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const DepartmentCard = ({ department }: DepartmentCardProps) => {
  const currentUser = useStore((state) => state.user);
  const [showMembers, setShowMembers] = useState(false);

  const {
    data: departmentUsersData,
    error: departmentUsersError,
    isLoading: isLoadingDepartmentUsers,
  } = useSWR(
    `${API_BASE_URL}/userDepartments/department/${department.id}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const users = departmentUsersData?.data || [];
  console.log(users);

  return (
    <div className='rounded-2xl bg-gradient-to-b from-teal-50 to-teal-100 p-6 flex-1 shadow-md hover:shadow-lg transition-shadow min-w-44'>
      <div className='flex justify-between items-center mb-4'>
        <span className='text-xs bg-white px-3 py-1 rounded-full shadow-sm min-w-6'>
          <h2 className='capitalize text-sm font-medium text-gray-600'>
            {department.name}
          </h2>
        </span>
        <span className='text-teal-600'>
          <FaBuildingUser />
        </span>
      </div>
      <div>
        <p className='text-sm text-gray-600'>{department.description}</p>
      </div>
      {isLoadingDepartmentUsers ? (
        <div className='text-gray-600'>Loading...</div>
      ) : departmentUsersError ? (
        <div className='text-red-600'>Failed to load users</div>
      ) : (
        <>
          <div className='flex items-baseline space-x-2'>
            <h1 className='text-3xl font-bold text-teal-700'>{users.length}</h1>
          </div>
          <h2 className='text-sm text-gray-600'>Employees</h2>
        </>
      )}
      <div className='mt-4 flex space-x-2'>
        {currentUser?.role === 'ADMIN' && (
          <button className='px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700'>
            Assign Employee
          </button>
        )}
        <button
          onClick={() => setShowMembers(true)}
          className='px-4 py-2 text-sm font-medium text-teal-600 bg-white border border-teal-600 rounded-md hover:bg-teal-50'
        >
          View Members
        </button>
      </div>
      {showMembers && (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h2 className='text-lg font-bold mb-4'>Department Members</h2>
            <div className='space-y-4'>
              {users.length > 0 ? (
                users.map(
                  (user: {
                    user: {
                      firstName: string;
                      lastName: string;
                      role: string;
                      id: number;
                    };
                  }) => (
                    <Link
                      href={`/employees/${user.user.id}`}
                      key={user.user.id}
                      className='flex items-center space-x-3 border-b pb-2 last:border-none'
                    >
                      <div className='w-10 h-10 bg-teal-100 text-teal-700 font-bold rounded-full flex items-center justify-center'>
                        {user.user.firstName[0]}
                        {user.user.lastName[0]}
                      </div>
                      <div>
                        <h3 className='text-sm font-medium text-gray-800'>
                          {user.user.firstName} {user.user.lastName}
                        </h3>
                        <p className='text-xs text-gray-500'>
                          {user.user.role}
                        </p>
                      </div>
                    </Link>
                  ),
                )
              ) : (
                <p className='text-sm text-gray-500'>No members found.</p>
              )}
            </div>
            <button
              onClick={() => setShowMembers(false)}
              className='mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700'
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentCard;
