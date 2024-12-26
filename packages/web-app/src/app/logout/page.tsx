'use client';

import React, { useEffect, useState } from 'react';

import { clearCookie } from '@/lib/cookieUtils';
import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import useStore from '@/lib/store';
import Link from 'next/link';

const LogoutPage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { setIsLoggedIn } = useAuth();
  const { clearUser } = useStore();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/logout`,
          {},
          { withCredentials: true },
        );

        if (response.status !== 200) {
          setError('Logout failed. Please try again.');
          return;
        }

        clearCookie('loggedIn');
        setIsLoggedIn(false);
        clearUser();

        setMessage('You have been logged out.');
        setError(null);
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred while logging out.');
      }
    };

    handleLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className='flex justify-center items-center h-screen bg-gray-50'>
      <div className='bg-white p-8 rounded-lg shadow-lg w-96'>
        {message ? (
          <div className='text-center'>
            <h1 className='text-2xl font-semibold text-green-600'>{message}</h1>
            <p className='mt-4 text-gray-500'>
              You have been successfully logged out of your account.
            </p>
            <Link href='/login'>
              <button className='mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'>
                Go to Login Page
              </button>
            </Link>
          </div>
        ) : (
          <div className='text-center'>
            <p className='text-lg text-gray-700'>Logging out...</p>
          </div>
        )}
        {error && <p className='text-center text-red-600 mt-4'>{error}</p>}
      </div>
    </div>
  );
};

export default LogoutPage;
