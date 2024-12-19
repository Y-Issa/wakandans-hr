'use client';
import React, { useEffect, useState } from 'react';

import IconButton from '@/components/shared/IconButton';
import IconLink from '@/components/shared/IconLink';
import { usePathname, useRouter } from 'next/navigation';

import { useAuth } from '@/contexts/AuthContext';
import { API_URL, navbarItems } from '@/lib/constants';
import useStore from '@/lib/store';
import useSWR from 'swr';
import { fetcher } from '@/lib/utils';
import { clearCookie } from '@/lib/cookieUtils';

const NavBar = () => {
  const [selected, setSelected] = useState<number>();
  const { isLoggedIn } = useAuth();
  const { user, setUser } = useStore();
  const router = useRouter();

  const {
    data: me,
    error,
    isLoading,
  } = useSWR(isLoggedIn ? `${API_URL}/users/me` : null, fetcher, {
    dedupingInterval: 60000 * 60, // Cache data for 60 minutes
    revalidateOnFocus: false, // Disable revalidation on focus
    revalidateOnReconnect: false, // Disable revalidation on reconnect
  });

  const pathname = usePathname();
  const { clearUser } = useStore();
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const pathToIndex = (path: string) => {
      return navbarItems.findIndex((link) => link.href === path);
    };

    const currentIndex = pathToIndex(pathname);
    if (currentIndex !== -1) {
      setSelected(currentIndex);
    }
  }, [pathname]);

  useEffect(() => {
    if (me && user?.id !== me.id) {
      setUser({
        id: me.id,
        firstName: me.firstName,
        lastName: me.lastName,
        email: me.email,
        role: me.role,
        profileImage: me.profile.profileImage,
        title: me.profile.title,
      });
    }
  }, [me, setUser, user?.id]);

  if (isLoading) return <div>Loading...</div>;
  if (isLoggedIn && error) {
    if (error.status === 401) {
      clearCookie('email');
      clearCookie('loggedIn');
      setIsLoggedIn(false);
      clearUser();
      router.push('/login');
    }
    return <div>Error loading app</div>;
  }

  return (
    <header className='bg-white shadow-md relative'>
      <div className='container mx-auto flex justify-between items-center p-4'>
        {isLoggedIn && (
          <>
            <IconLink
              src='empty-logo'
              width={30}
              height={30}
              alt='logo'
              navigateTo='/'
              text='HR App'
              onClick={() => setSelected(0)}
              classes='font-bold'
            />
            <nav>
              <ul className='flex space-x-6'>
                {navbarItems.map((link, id) => (
                  <li key={id}>
                    <IconLink
                      src={link.icon}
                      alt={link.icon}
                      text={link.title}
                      navigateTo={link.href}
                      onClick={() => setSelected(id)}
                      classes={`flex space-x-2 items-center px-3 py-1 navbar-item ${
                        selected === id ? 'selected' : ''
                      }`}
                    />
                  </li>
                ))}
              </ul>
            </nav>
            <div className='flex space-x-6'>
              <IconButton
                src='bell'
                alt='notifications'
                width={20}
                height={20}
                onClick={() => alert('Notifications clicked')}
              />
              <IconLink
                src='profile'
                alt='profile'
                width={35}
                height={35}
                navigateTo='/profile'
                onClick={() => setSelected(-1)}
              />
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default NavBar;
