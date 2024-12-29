const Announcements = () => {
  return (
    <div className='bg-gradient-to-b from-gray-50 to-white p-6 rounded-lg shadow-lg max-w-md mx-auto'>
      {/* Header */}
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold text-gray-700'>Announcements</h1>
        <span className='text-sm text-blue-500 cursor-pointer hover:underline'>
          View All
        </span>
      </div>

      {/* Announcements List */}
      <div className='space-y-4'>
        <div className='p-4 rounded-lg shadow-sm bg-blue-50 border-l-4 border-blue-500'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-medium text-gray-800'>
              Lorem ipsum dolor sit
            </h2>
            <span className='text-xs text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm'>
              2025-01-01
            </span>
          </div>
          <p className='text-sm text-gray-600 mt-2'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            expedita. Rerum, quidem facilis?
          </p>
        </div>
        <div className='p-4 rounded-lg shadow-sm bg-purple-50 border-l-4 border-purple-500'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-medium text-gray-800'>
              Lorem ipsum dolor sit
            </h2>
            <span className='text-xs text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm'>
              2025-01-01
            </span>
          </div>
          <p className='text-sm text-gray-600 mt-2'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            expedita. Rerum, quidem facilis?
          </p>
        </div>
        <div className='p-4 rounded-lg shadow-sm bg-blue-50 border-l-4 border-blue-500'>
          <div className='flex items-center justify-between'>
            <h2 className='text-lg font-medium text-gray-800'>
              Lorem ipsum dolor sit
            </h2>
            <span className='text-xs text-gray-500 bg-white px-2 py-1 rounded-md shadow-sm'>
              2025-01-01
            </span>
          </div>
          <p className='text-sm text-gray-600 mt-2'>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum,
            expedita. Rerum, quidem facilis?
          </p>
        </div>
      </div>
    </div>
  );
};

export default Announcements;
