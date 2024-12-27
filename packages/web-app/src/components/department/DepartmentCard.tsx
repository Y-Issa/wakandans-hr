import useStore from '@/lib/store';
import DepartmentMembers from './DepartmentMembers';
import AssignUserDepartment from './AssignUserDepartment';
import { HiAdjustmentsHorizontal, HiOutlineTrash } from 'react-icons/hi2';
import EditDepartment from './EditDepartment';
import ConfirmDeleteDepartment from './ConfirmDeleteDepartment';
import {
  useDeleteDepartment,
  useDepartmentDetails,
  useEditForm,
  useMemberActions,
  useModalState,
} from '@/hooks/useDepartment';

interface DepartmentCardProps {
  department: {
    id: number;
    name: string;
    description: string;
    locationId: number;
  };
  page: number;
}

const DepartmentCard = ({ department, page }: DepartmentCardProps) => {
  const currentUser = useStore((state) => state.user);

  const { modalState, toggleModal } = useModalState();

  const { userCountData, userCountError, departmentUsersData, allUsersData } =
    useDepartmentDetails(department.id, modalState);

  const { editFormData, handleEditChange, handleEditSubmit } = useEditForm(
    {
      name: department.name,
      description: department.description,
      locationId: department.locationId,
    },
    department.id,
    page,
    toggleModal,
  );

  const { handleDelete } = useDeleteDepartment(
    department.id,
    page,
    toggleModal,
  );

  const { handleMemberAction } = useMemberActions(department.id, toggleModal);

  const userCount = userCountData?.data || 0;
  const users = departmentUsersData?.data || [];
  const allUsers = allUsersData?.data || [];

  return (
    <div className='rounded-2xl bg-gradient-to-b from-teal-50 to-teal-100 p-6 flex-1 shadow-md hover:shadow-lg transition-shadow min-w-44'>
      <div className='flex justify-between items-center mb-4'>
        <span className='text-xs bg-white px-3 py-1 rounded-full shadow-sm min-w-6'>
          <h2 className='capitalize text-sm font-medium text-gray-600'>
            {department.name}
          </h2>
        </span>
        <span className='flex gap-3'>
          <button
            className='w-8 h-8 flex items-center justify-center text-teal-600 bg-teal-50 rounded-full shadow-md transition-all duration-300 ease-in-out hover:bg-teal-100 hover:shadow-lg focus:outline-none'
            onClick={() => toggleModal('showEditModal', true)}
          >
            <HiAdjustmentsHorizontal />
          </button>
          <button
            className='w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 rounded-full hover:bg-red-100'
            onClick={() => toggleModal('showDeleteModal', true)}
          >
            <HiOutlineTrash />
          </button>
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
      {modalState.showDeleteModal && (
        <ConfirmDeleteDepartment
          department={department}
          toggleModal={toggleModal}
          handleDelete={handleDelete}
        />
      )}
      {modalState.showEditModal && (
        <EditDepartment
          editFormData={editFormData}
          handleEditChange={handleEditChange}
          handleEditSubmit={handleEditSubmit}
          toggleModal={toggleModal}
        />
      )}
    </div>
  );
};

export default DepartmentCard;
