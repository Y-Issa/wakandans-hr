'use client';
import React from 'react';
import Link from 'next/link';

import UserProfile from '@/components/shared/UserProfile';
import { API_URL } from '@/lib/constants';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  profile: {
    title: string;
    profileImage: string;
  };
};

const Page = () => {
  const { data: users, error, isLoading } = useSWR(`${API_URL}/users`, fetcher);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error fetching users</div>;

  return (
    <div className='p-4 flex justify-center'>
      <div className='grid grid-cols-4 gap-4'>
        {users.data.map((user: User) => (
          <Link key={user.id} href={`/users/${user.id}`}>
            <UserProfile {...user} />
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Page;
