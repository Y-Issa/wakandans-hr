// THIS IS A DUMMY COMPONENT, IT DOES NOT ACTUALLY POST AN ANNOUNCEMENT, ONLY A PLACEHOLDER

'use client';

import { useState } from 'react';

const PostAnnouncement = () => {
  const [announcement, setAnnouncement] = useState({
    title: '',
    content: '',
    date: '',
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setAnnouncement((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    alert('Announcement posted successfully!');
    // Here you can add logic to submit the announcement, like calling an API or updating the state
  };

  return (
    <div className='bg-white p-6 rounded-lg shadow-md mb-4 space-y-6'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold text-gray-800'>
          Post an Announcement
        </h2>
      </div>

      {/* Content */}
      <div className='grid grid-cols-1 sm:grid-cols-2 gap-6'>
        {/* Title */}
        <div className='sm:col-span-2'>
          <label htmlFor='title' className='text-lg font-medium text-gray-700'>
            Title
          </label>
          <input
            id='title'
            name='title'
            type='text'
            value={announcement.title}
            onChange={handleInputChange}
            className='mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter announcement title'
          />
        </div>

        {/* Content */}
        <div className='sm:col-span-2'>
          <label
            htmlFor='content'
            className='text-lg font-medium text-gray-700'
          >
            Content
          </label>
          <textarea
            id='content'
            name='content'
            value={announcement.content}
            onChange={handleInputChange}
            className='mt-2 p-2 w-full h-32 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Enter announcement content'
          />
        </div>

        {/* Date */}
        <div className='sm:col-span-2'>
          <label htmlFor='date' className='text-lg font-medium text-gray-700'>
            Date
          </label>
          <input
            id='date'
            name='date'
            type='date'
            value={announcement.date}
            onChange={handleInputChange}
            className='mt-2 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className='flex justify-end'>
        <button
          onClick={handleSubmit}
          className='px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition'
        >
          Post Announcement
        </button>
      </div>
    </div>
  );
};

export default PostAnnouncement;
