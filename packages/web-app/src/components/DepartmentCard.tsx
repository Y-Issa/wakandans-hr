import { API_BASE_URL } from '@/lib/constants';
import useStore from '@/lib/store';
import axios from 'axios';
import { FaBuildingUser } from 'react-icons/fa6';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';
import DepartmentMembers from './DepartmentMembers';
import AssignUserDepartment from './AssignUserDepartment';

interface DepartmentCardProps {
  department: {
    id: number;
    name: string;
    description: string;
  };
}

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

const useDepartmentData = (url: string | null, enabled: boolean) =>
  useSWR(enabled ? url : null, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

const DepartmentCard = ({ department }: DepartmentCardProps) => {
  const currentUser = useStore((state) => state.user);
  const [modalState, setModalState] = useState({
    showMembers: false,
    showAssignModal: false,
  });

  const toggleModal = (
    key: 'showMembers' | 'showAssignModal',
    state: boolean,
  ) => setModalState((prev) => ({ ...prev, [key]: state }));

  const { data: userCountData, error: userCountError } = useDepartmentData(
    `${API_BASE_URL}/userDepartments/department/user-count/${department.id}`,
    true,
  );

  const { data: departmentUsersData } = useDepartmentData(
    modalState.showMembers || modalState.showAssignModal
      ? `${API_BASE_URL}/userDepartments/department/${department.id}`
      : null,
    modalState.showMembers || modalState.showAssignModal,
  );

  const { data: allUsersData } = useDepartmentData(
    modalState.showAssignModal ? `${API_BASE_URL}/users?limit=1100` : null,
    modalState.showAssignModal,
  );

  const userCount = userCountData?.data || 0;
  const users = departmentUsersData?.data || [];
  const allUsers = allUsersData?.data || [];

  const handleMemberAction = async (
    userId: number,
    action: 'assign' | 'delete',
  ) => {
    const url =
      action === 'assign'
        ? `${API_BASE_URL}/userDepartments/`
        : `${API_BASE_URL}/userDepartments/user/${userId}/department/${department.id}`;
    const method = action === 'assign' ? 'post' : 'delete';
    const data =
      action === 'assign' ? { userId, departmentId: department.id } : null;

    try {
      if (action === 'assign') {
        await axios.post(url, data, { withCredentials: true });
      } else {
        await axios[method](url, { withCredentials: true });
      }
      mutate(`${API_BASE_URL}/userDepartments/department/${department.id}`);
      mutate(
        `${API_BASE_URL}/userDepartments/department/user-count/${department.id}`,
      );
      if (action === 'assign') toggleModal('showAssignModal', false);
    } catch (error) {
      console.error(
        `Error ${action === 'assign' ? 'assigning' : 'deleting'} user:`,
        error,
      );
    }
  };

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
        <p className='text-sm text-gray-600'>
          {department.description || 'No description available.'}
        </p>
      </div>
      {userCountError ? (
        <div className='text-red-600'>Failed to load users</div>
      ) : (
        <>
          <div className='flex items-baseline space-x-2'>
            <h1 className='text-3xl font-bold text-teal-700'>{userCount}</h1>
          </div>
          <h2 className='text-sm text-gray-600'>Employees</h2>
        </>
      )}
      <div className='mt-4 flex space-x-2'>
        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={() => toggleModal('showAssignModal', true)}
            className='px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700'
          >
            Assign Employee
          </button>
        )}
        <button
          onClick={() => toggleModal('showMembers', true)}
          className='px-4 py-2 text-sm font-medium text-teal-600 bg-white border border-teal-600 rounded-md hover:bg-teal-50'
        >
          View Members
        </button>
      </div>
      {modalState.showMembers && (
        <DepartmentMembers
          isLoadingDepartmentUsers={!departmentUsersData}
          departmentUsersError={!departmentUsersData}
          users={users}
          handleModalClose={() => toggleModal('showMembers', false)}
          handleDeleteMember={(userId) => handleMemberAction(userId, 'delete')}
        />
      )}
      {modalState.showAssignModal && (
        <AssignUserDepartment
          isLoadingAllUsers={!allUsersData}
          allUsersError={!allUsersData}
          allUsers={allUsers}
          handleAssignMember={(userId) => handleMemberAction(userId, 'assign')}
          handleAssignModalClose={() => toggleModal('showAssignModal', false)}
          usersInDepartment={users}
        />
      )}
    </div>
  );
};

export default DepartmentCard;
