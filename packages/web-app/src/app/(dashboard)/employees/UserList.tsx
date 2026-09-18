'use client';

import { HiPlus } from 'react-icons/hi2';
import Pagination from '@/components/Pagination';
import EditUserForm from '@/components/employees/EditUserForm';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store';
import UserTable from '@/components/employees/UserTable';
import { useUsers } from '@/hooks/useUsers';
import ConfirmDeleteUser from '@/components/employees/ConfirmDeleteUser';
import Card from '@/components/ui/Card';
import PillButton from '@/components/ui/PillButton';

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
    <div className='flex flex-col gap-6 py-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-gray-900'>All Employees</h1>
        {user?.role === 'ADMIN' && (
          <PillButton onClick={() => router.push('/employees/new')}>
            <HiPlus size={16} />
            Add Employee
          </PillButton>
        )}
      </div>

      <Card className='overflow-hidden'>
        <div className='overflow-x-auto'>
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

        <div className='px-4 pb-4'>
          <Pagination
            page={page}
            hasNextPage={hasNextPage}
            onPrevious={() => setPage((prev) => Math.max(prev - 1, 0))}
            onNext={() => setPage((prev) => prev + 1)}
          />
        </div>
      </Card>

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
