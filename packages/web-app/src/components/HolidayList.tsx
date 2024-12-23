import React from 'react';

const HolidayList = () => {
  const holidays = [
    { name: "New Year's Day", date: 'January 1, 2024' },
    { name: 'Independence Day', date: 'July 4, 2024' },
    { name: 'Thanksgiving', date: 'November 28, 2024' },
    { name: 'Christmas Day', date: 'December 25, 2024' },
  ];

  return (
    <>
      <h2 className='text-2xl font-semibold'>Upcoming Holidays</h2>
      <ul className='mt-3 space-y-2'>
        {holidays.map((holiday, index) => (
          <li key={index} className='flex justify-between border-b pb-2'>
            <span className='font-medium'>{holiday.name}</span>
            <span className='text-gray-500'>{holiday.date}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default HolidayList;
