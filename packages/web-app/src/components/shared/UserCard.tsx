import React from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';

export type UserProps = {
  name: string;
  email: string;
  imageSrc?: string;
};

const getInitials = (fullName: string) => {
  const words = fullName.split(' ');
  const initials = words.map((word) => word.charAt(0)).join('');
  return initials.toUpperCase();
};

const UserCard: React.FC<UserProps> = ({ name, email, imageSrc }) => {
  return (
    <div className='inline-flex items-center space-x-4'>
      <Avatar>
        {imageSrc && <AvatarImage src={imageSrc} />}
        <AvatarFallback>{getInitials(name)}</AvatarFallback>
      </Avatar>
      <div className='flex flex-col'>
        <strong>{name}</strong>
        <span className='text-gray-500 text-sm'>{email}</span>
      </div>
    </div>
  );
};

export default UserCard;
