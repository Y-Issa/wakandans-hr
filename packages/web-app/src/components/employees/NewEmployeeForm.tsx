'use client';

import { useCreateUser } from '@/hooks/useUsers';

const NewEmployeeForm = () => {
  const {
    formData,
    locations,
    users,
    error,
    loading,
    handleChange,
    handleSubmit,
  } = useCreateUser();

  return (
    <div className='flex items-center justify-center bg-gray-50'>
      <div className='w-full max-w-lg p-6 bg-white rounded-lg shadow-lg'>
        <h1 className='text-2xl font-bold text-center text-gray-900 mb-6'>
          Add New Employee
        </h1>
        {error && (
          <p className='text-xs text-red-500 text-center mb-4'>{error}</p>
        )}
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='flex space-x-4'>
            {/* First Name */}
            <div className='w-1/2'>
              <label
                htmlFor='firstName'
                className='block text-xs font-semibold text-gray-600'
              >
                First Name
              </label>
              <input
                type='text'
                name='firstName'
                id='firstName'
                value={formData.firstName}
                onChange={handleChange}
                required
                className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
              />
            </div>

            {/* Last Name */}
            <div className='w-1/2'>
              <label
                htmlFor='lastName'
                className='block text-xs font-semibold text-gray-600'
              >
                Last Name
              </label>
              <input
                type='text'
                name='lastName'
                id='lastName'
                value={formData.lastName}
                onChange={handleChange}
                required
                className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor='email'
              className='block text-xs font-semibold text-gray-600'
            >
              Email
            </label>
            <input
              type='email'
              name='email'
              id='email'
              value={formData.email}
              onChange={handleChange}
              required
              className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
            />
          </div>

          {/* Role */}
          <div>
            <label
              htmlFor='role'
              className='block text-xs font-semibold text-gray-600'
            >
              Role
            </label>
            <select
              name='role'
              id='role'
              value={formData.role}
              onChange={handleChange}
              required
              className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
            >
              <option value=''>Select a role</option>
              <option value='ADMIN'>Admin</option>
              <option value='EMPLOYEE'>Employee</option>
              <option value='MANAGER'>Manager</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor='title'
              className='block text-xs font-semibold text-gray-600'
            >
              Title
            </label>
            <input
              type='text'
              name='title'
              id='title'
              value={formData.profile.title}
              onChange={handleChange}
              required
              className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor='locationId'
              className='block text-xs font-semibold text-gray-600'
            >
              Location
            </label>
            <select
              name='locationId'
              id='locationId'
              value={formData.locationId}
              onChange={handleChange}
              required
              className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
            >
              <option value=''>Select a location</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {/* Reports To */}
          <div>
            <label
              htmlFor='reportsToId'
              className='block text-xs font-semibold text-gray-600'
            >
              Reports To
            </label>
            <select
              name='reportsToId'
              id='reportsToId'
              value={formData.reportsToId}
              onChange={handleChange}
              className='mt-2 block w-full px-4 py-2 text-gray-700 bg-gray-100 border border-gray-300 rounded-sm focus:outline-none focus:ring-2 focus:ring-teal-500'
            >
              <option value=''>Select a manager</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.firstName} {user.lastName}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <button
            type='submit'
            disabled={loading}
            className={`w-full px-4 py-2 text-sm font-semibold text-white bg-teal-600 rounded-sm hover:bg-teal-700 transition-all duration-300 ease-in-out focus:outline-none ${
              loading && 'cursor-not-allowed opacity-60'
            }`}
          >
            {loading ? 'Creating...' : 'Create Employee'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewEmployeeForm;
