import { useState } from 'react';
import { LuSearch } from 'react-icons/lu';

interface AssignUserDepartmentProps {
  isLoadingAllUsers: boolean;
  allUsersError: boolean;
  allUsers: { id: number; firstName: string; lastName: string }[];
  usersInDepartment: { userId: number }[];
  handleAssignMember: (id: number) => void;
  handleAssignModalClose: () => void;
}

const AssignUserDepartment: React.FC<AssignUserDepartmentProps> = ({
  isLoadingAllUsers,
  allUsersError,
  allUsers,
  usersInDepartment,
  handleAssignMember,
  handleAssignModalClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmUserId, setConfirmUserId] = useState<number | null>(null);

  const filteredUsers = allUsers.filter(
    (user) =>
      !usersInDepartment.some((deptUser) => deptUser.userId === user.id) &&
      `${user.firstName} ${user.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
  );

  const handleConfirmAssign = () => {
    if (confirmUserId !== null) {
      handleAssignMember(confirmUserId);
      setConfirmUserId(null);
    }
  };

  return (
    <div
      className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center'
      onClick={(e) => {
        if (e.target === e.currentTarget) handleAssignModalClose();
      }}
    >
      <div className='bg-white p-6 rounded-lg shadow-lg w-[40rem]'>
        <h2 className='text-lg font-bold mb-4'>Assign Employee</h2>

        <div className='flex items-center gap-2 mb-4 rounded-full ring-[1.5px] ring-gray-300 px-2'>
          <LuSearch />
          <input
            type='text'
            placeholder='Search employees...'
            className='w-full p-2 bg-transparent outline-none'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {isLoadingAllUsers ? (
          <p className='text-gray-600'>Loading employees...</p>
        ) : allUsersError ? (
          <p className='text-red-600'>Failed to load employees.</p>
        ) : (
          <ul className='space-y-2 max-h-80 overflow-y-auto'>
            {filteredUsers.map((user) => (
              <li
                key={user.id}
                className='flex justify-between items-center p-2 border rounded-md hover:bg-teal-50'
              >
                <span>{`${user.firstName} ${user.lastName}`}</span>
                <button
                  onClick={() => setConfirmUserId(user.id)}
                  className='px-2 py-1 text-sm text-white bg-teal-600 rounded-md hover:bg-teal-700'
                >
                  Assign
                </button>
              </li>
            ))}
          </ul>
        )}

        <button
          onClick={handleAssignModalClose}
          className='mt-4 w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700'
        >
          Close
        </button>
      </div>

      {confirmUserId !== null && (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white p-6 rounded-lg shadow-lg w-96'>
            <h3 className='text-lg font-bold mb-4'>Confirm Assignment</h3>
            <p className='text-sm mb-4'>
              Are you sure you want to assign this user to the department?
            </p>
            <div className='flex justify-end space-x-2'>
              <button
                onClick={() => setConfirmUserId(null)}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300'
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAssign}
                className='px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignUserDepartment;
