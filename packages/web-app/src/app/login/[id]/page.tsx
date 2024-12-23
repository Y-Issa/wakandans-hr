'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { setCookie } from '@/lib/cookieUtils';
import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';
import useStore from '@/lib/store';

type PageProps = {
  params: {
    id: string;
  };
};

const Page = ({ params }: PageProps) => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { setIsLoggedIn } = useAuth();
  const { setUser } = useStore();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.post(
          `${API_BASE_URL}/validate-token`,
          {
            loginToken: params.id,
          },
          {
            withCredentials: true,
          },
        );

        if (response.status !== 200) {
          setError('Login failed.');
          return;
        }
        console.log(response.data);

        setCookie('loggedIn', '1');
        setMessage("You're logged in!");
        setError(null);
        setIsLoggedIn(true);

        const userResponse = await axios.get(
          `${API_BASE_URL}/users/${response.data.id}`,
          {
            withCredentials: true,
          },
        );

        setUser({
          id: userResponse.data.id,
          firstName: userResponse.data.firstName,
          lastName: userResponse.data.lastName,
          email: userResponse.data.email,
          role: userResponse.data.role,
          profileImage: userResponse.data.profile.profileImage,
          title: userResponse.data.profile.title,
        });
        router.push('/home');
      } catch (err) {
        console.error(err);
        setError('An unexpected error occurred.');
      }
    };

    validateToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.id]);

  return (
    <div>
      {message ? <p>{message}</p> : <p>Validating token...</p>}
      {error && <p className='text-red-600'>{error}</p>}
    </div>
  );
};

export default Page;
