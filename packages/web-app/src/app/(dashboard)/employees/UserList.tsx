'use client';

import { HiPlus } from 'react-icons/hi2';
import Pagination from '@/components/Pagination';
import EditUserForm from '@/components/employees/EditUserForm';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store';
import UserTable from '@/components/employees/UserTable';
import { useUsers } from '@/hooks/useUsers';
import ConfirmDeleteUser from '@/components/employees/ConfirmDeleteUser';

const UsersList = () => {
  const router = useRouter();
  const user = useStore((state) => state.user);

  const {
    users,
    page,
    setPage,
    sortBy,
    sortOrder,
    handleSort,
    hasNextPage,
    handleDelete,
    handleEdit,
    handleEditSubmit,
    selectedUser,
    setSelectedUser,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isLoading,
    error,
  } = useUsers();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className='bg-gray-50 shadow-lg rounded-lg p-6 m-4 overflow-y-scroll lg:max-h-[85vh]'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-2xl font-bold text-gray-800'>All Employees</h1>
        {user?.role === 'ADMIN' && (
          <button
            onClick={() => router.push('/employees/new')}
            className='px-4 py-2 flex items-center justify-center gap-2 text-white bg-teal-600 rounded-lg shadow-md transition-all duration-300 ease-in-out hover:bg-teal-700 hover:shadow-lg focus:outline-none transform hover:scale-105'
          >
            <HiPlus size={20} />
            <span className='hidden md:inline'>Add Employee</span>
          </button>
        )}
      </div>

      <div className='overflow-x-auto rounded-lg border border-gray-200 shadow-sm'>
        <UserTable
          users={users}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={handleSort}
          onEdit={handleEdit}
          setSelectedUser={setSelectedUser}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
        />
      </div>

      <Pagination
        page={page}
        hasNextPage={hasNextPage}
        onPrevious={() => setPage((prev) => Math.max(prev - 1, 0))}
        onNext={() => setPage((prev) => prev + 1)}
      />

      {isDeleteModalOpen && selectedUser && (
        <ConfirmDeleteUser
          selectedUser={selectedUser}
          setIsDeleteModalOpen={setIsDeleteModalOpen}
          handleDelete={handleDelete}
        />
      )}

      {isEditModalOpen && selectedUser && (
        <EditUserForm
          formData={selectedUser}
          onChange={(e) => {
            if (e.target.name === 'title') {
              setSelectedUser({
                ...selectedUser,
                profile: {
                  ...selectedUser.profile,
                  [e.target.name]: e.target.value,
                },
              });
            } else {
              setSelectedUser({
                ...selectedUser,
                [e.target.name]: e.target.value,
              });
            }
          }}
          onSubmit={(e) => {
            e.preventDefault();
            handleEditSubmit(selectedUser);
          }}
          onCancel={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default UsersList;
