'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email });

      if (response.status === 200) {
        setMessage(response.data.message);
        console.log(response.data);
        setError(null);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to log in. Please check your email and try again.');
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-100 relative'>
      {/* Error/Message Banner */}
      {(error || message) && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-md shadow-md text-center max-w-md w-full ${
            error
              ? 'bg-red-100 text-red-600 border border-red-300'
              : 'bg-green-100 text-green-600 border border-green-300'
          }`}
        >
          {error || message}
        </div>
      )}

      {/* Login Card */}
      <div className='bg-white rounded-lg shadow-lg p-6 max-w-md w-full'>
        {/* Logo and Heading */}
        <div className='text-center mb-6'>
          <h1 className='text-2xl font-bold'>HR App</h1>
          <p className='text-gray-500'>Sign in to your account</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className='space-y-4'>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium text-gray-700'
            >
              Email address
            </label>
            <input
              id='email'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500'
            />
          </div>
          <button
            type='submit'
            disabled={!email}
            className={`w-full py-2 text-white font-semibold rounded-md ${
              email
                ? 'bg-blue-600 hover:bg-blue-700'
                : 'bg-blue-300 cursor-not-allowed'
            }`}
          >
            Sign In
          </button>
        </form>

        {/* Additional Information */}
        <p className='mt-4 text-center text-sm text-gray-500'>
          By signing in, you agree to our{' '}
          <Link href='/terms' className='text-blue-600 hover:underline'>
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href='/privacy' className='text-blue-600 hover:underline'>
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
