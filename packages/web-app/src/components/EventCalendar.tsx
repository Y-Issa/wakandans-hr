'use client';

import { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import HolidayList from './HolidayList';


type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

// TEMPORARY
const events = [
  {
    id: 1,
    title: 'Team Standup Meeting',
    time: '9:00 AM - 10:00 AM',
    description: 'Daily standup with the project team to discuss progress.',
  },
  {
    id: 2,
    title: 'Design Review',
    time: '11:00 AM - 12:00 PM',
    description: 'Review the latest UI/UX designs with the design team.',
  },
  {
    id: 3,
    title: 'Client Presentation',
    time: '2:00 PM - 3:00 PM',
    description: 'Present project updates to the client stakeholders.',
  },
];

const EventCalendar = () => {
  const [value, onChange] = useState<Value>(new Date());

  return (
    <div className='bg-white p-6 rounded-lg max-w-md mx-auto'>
      {/* Calendar */}
      <div className='mb-6'>
        <Calendar
          onChange={onChange}
          value={value}
          className='rounded-lg border'
        />
      </div>
      <HolidayList />

      {/* Events Header */}
      <div className='flex items-center justify-between my-4'>

        <h1 className='text-2xl font-semibold text-gray-700'>Events</h1>
      </div>

      {/* Events List */}
      <div className='space-y-4'>
        {events.map((event) => (
          <div
            className='p-4 rounded-lg border shadow-sm bg-white hover:shadow-md transition-shadow border-gray-200 odd:border-l-4 odd:border-blue-500 even:border-l-4 even:border-purple-500'
            key={event.id}
          >
            <div className='flex items-center justify-between'>
              <h2 className='font-semibold text-gray-800'>{event.title}</h2>
              <span className='text-sm text-gray-500'>{event.time}</span>
            </div>
            <p className='mt-2 text-gray-600 text-sm'>{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendar;
