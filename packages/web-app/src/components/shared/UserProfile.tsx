import React from 'react';
import Image from 'next/image';

type UserProfileProps = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profile: {
    title: string;
    profileImage: string;
  };
};

const UserProfile: React.FC<UserProfileProps> = ({
  firstName,
  lastName,
  email,
  profile,
}) => {
  return (
    <div className='inline-flex flex-col p-3 hover:shadow-lg rounded-xl space-y-3'>
      <Image
        src={'/images/profile.svg'}
        alt='profile'
        width={22}
        height={22}
        className='rounded-full w-48 h-48 p-10 opacity-50'
      />
      <div className='flex flex-col'>
        <strong>{`${firstName} ${lastName}`}</strong>
        <span className='text-gray-500 text-sm'>{profile?.title}</span>
        <span className='text-gray-500 text-sm'>{email}</span>
      </div>
    </div>
  );
};

export default UserProfile;
