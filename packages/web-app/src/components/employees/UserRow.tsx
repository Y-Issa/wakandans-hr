import React from 'react';
import Image from 'next/image';
import {
  HiAdjustmentsHorizontal,
  HiOutlineEye,
  HiOutlineTrash,
} from 'react-icons/hi2';
import { useRouter } from 'next/navigation';
import useStore from '@/lib/store';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  locationId: string;
  reportsToId: string;
  profile: {
    profileImage: string;
    title: string;
    employedAt: Date;
    dateOfBirth: Date;
  };
}

interface UserRowProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete }) => {
  const router = useRouter();
  const currentUser = useStore((state) => state.user);

  return (
    <tr className='hover:bg-blue-50 transition duration-150'>
      <td className='px-6 py-4 whitespace-nowrap'>
        <div className='flex items-center'>
          <Image
            src={user?.profile?.profileImage || '/avatar.png'}
            alt={`${user.firstName} ${user.lastName}`}
            width={40}
            height={40}
            className='rounded-full mr-3'
          />
          <div>
            <p className='font-semibold text-gray-800'>{`${user.firstName} ${user.lastName}`}</p>
            <p className='text-sm text-gray-500'>User ID: {user.id}</p>
          </div>
        </div>
      </td>
      <td className='px-6 py-4 whitespace-nowrap'>{user.email}</td>
      <td className='px-6 py-4 whitespace-nowrap'>{user.role}</td>
      <td className='px-6 py-4 whitespace-nowrap text-center'>
        <div className='flex justify-center gap-3'>
          {currentUser?.role === 'ADMIN' && (
            <button
              className='w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100'
              onClick={() => onEdit(user)}
            >
              <HiAdjustmentsHorizontal size={20} />
            </button>
          )}

          <button
            className='w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 rounded-full shadow-md transition-all duration-300 ease-in-out hover:bg-blue-100 hover:shadow-lg focus:outline-none'
            onClick={() => router.push(`/employees/${user.id}`)}
          >
            <HiOutlineEye size={20} />
          </button>

          {currentUser?.role === 'ADMIN' && (
            <button
              className='w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 rounded-full hover:bg-red-100'
              onClick={() => onDelete(user.id)}
            >
              <HiOutlineTrash size={20} />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default UserRow;
