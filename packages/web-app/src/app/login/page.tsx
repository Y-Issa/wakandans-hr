'use client';

import React, { useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return; // Prevent multiple submissions

    setLoading(true); // Start loading state


    try {
      const response = await axios.post(`${API_BASE_URL}/login`, { email });

      if (response.status === 200) {
        setMessage('Success! Please check your email for login instructions.');
        setSuccess(true);

        setError(null);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setError('Failed to log in. Please check your email and try again.');
    } finally {
      if (!success) {
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }

    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-brand-canvas relative'>

      {/* Error/Message Banner */}
      {(error || message) && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-md shadow-md text-center max-w-md w-full ${
            error
              ? 'bg-red-100 text-red-600 border border-red-300'
              : 'bg-blue-100 text-blue-600 border border-blue-300'

          }`}
        >
          {error || message}
        </div>
      )}

      {/* Login Card */}
      <div className='bg-white rounded-2xl border border-gray-100 shadow-sm p-8 max-w-md w-full'>
        {/* Logo and Heading */}
        <div className='text-center mb-6 flex flex-col items-center gap-2'>
          <Image src='/logo.png' alt='WakandansHR' width={40} height={40} />
          <h1 className='text-xl font-semibold text-gray-900'>WakandansHR</h1>
          <p className='text-gray-500 text-sm'>Sign in to your account</p>
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
              disabled={success} 
              className={`mt-1 block w-full px-4 py-2 border ${
                success
                  ? 'bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'border-blue-300 focus:ring-blue-500 focus:border-blue-500'
              } rounded-md shadow-sm`}

            />
          </div>
          <button
            type='submit'
            disabled={!email || loading || success}
            className={`w-full py-2.5 text-white font-medium rounded-full transition-colors ${
              !email || loading || success
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {success
              ? 'Check your email for login instructions'
              : loading
                ? 'Processing...'
                : 'Sign In'}

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
