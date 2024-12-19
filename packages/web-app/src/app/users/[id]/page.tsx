'use client';
import React from 'react';
import Image from 'next/image';

import SocialProfile from '@/components/shared/SocialProfile';
import ContactItem from '@/components/shared/ContactItem';
import { API_URL } from '@/lib/constants';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

type UserDetailsProps = {
  params: {
    id: string;
  };
};

const UserDetails = ({ params }: UserDetailsProps) => {
  const {
    data: user,
    error,
    isLoading,
  } = useSWR(`${API_URL}/users/${params.id}`, fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching user</div>;

  return (
    <div className='space-y-24'>
      <div className='flex flex-col border bg-blue-500 text-white p-10'>
        <div className='ml-40'>
          <h1 className='text-2xl'>{`${user?.firstName} ${user?.lastName}`}</h1>
          <h3>{user?.profile?.title}</h3>
        </div>
        <div className='flex flex-row items-center absolute top-0 right-4 transform -translate-x-1/4 translate-y-1/4'>
          <SocialProfile />
          <Image
            src={'/images/profile.svg'}
            alt='profile'
            width={200}
            height={200}
            className='rounded-xl w-80 p-10'
          />
        </div>
      </div>
      <div className='p-4 flex space-x-4'>
        <div className='bg-white w-1/3 rounded-lg p-4 space-y-3 shadow-2xl'>
          <h3 className='font-bold text-xl'>About</h3>
          <p>{user?.profile?.bio}</p>
        </div>
        <div className='bg-white w-1/3 rounded-lg p-4 space-y-3 shadow-2xl'>
          <h3 className='font-bold text-xl'>Contact</h3>
          <ContactItem
            imgSrc='mail'
            label='Email'
            value={user?.email}
            classes='invert'
          />
          <ContactItem
            imgSrc='phone'
            label='Mobile'
            value={user?.profile?.phoneNumber}
            classes='invert'
          />
          <ContactItem
            imgSrc='slack'
            label='Slack'
            value={`@${user?.firstName} ${user?.lastName}`}
          />
        </div>
        <div></div>
      </div>
    </div>
  );
};

export default UserDetails;
