'use client';

import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
} from 'recharts';
import { useHolidays } from '@/hooks/useHolidays';

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const HolidaysTrendChart = () => {
  const { holidays, loading } = useHolidays();

  if (loading) {
    return <p className='text-sm text-gray-400'>Loading holidays...</p>;
  }

  const year = new Date().getFullYear();
  const counts = new Array(12).fill(0);

  holidays.forEach((holiday) => {
    const date = new Date(holiday.fromDate);
    if (date.getFullYear() === year) {
      counts[date.getMonth()] += 1;
    }
  });

  const data = MONTHS.map((month, index) => ({ month, count: counts[index] }));
  const totalThisYear = counts.reduce((a, b) => a + b, 0);

  const upcoming = holidays
    .map((h) => ({ ...h, date: new Date(h.fromDate) }))
    .filter((h) => h.date >= new Date())
    .sort((a, b) => a.date.getTime() - b.date.getTime())[0];

  return (
    <div className='flex flex-col gap-4'>
      <div className='h-40'>
        <ResponsiveContainer width='100%' height='100%'>
          <AreaChart data={data}>
            <defs>
              <linearGradient id='holidayFill' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='0%' stopColor='#3B82F6' stopOpacity={0.25} />
                <stop offset='100%' stopColor='#3B82F6' stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey='month'
              tickLine={false}
              axisLine={false}
              interval={1}
              tick={{ fontSize: 11, fill: '#9CA3AF' }}
            />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                fontSize: 12,
                border: '1px solid #F3F4F6',
              }}
            />
            <Area
              type='monotone'
              dataKey='count'
              stroke='#3B82F6'
              strokeWidth={2}
              fill='url(#holidayFill)'
              dot={{ r: 3, stroke: '#3B82F6', fill: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className='flex items-center justify-between text-xs'>
        <div>
          <p className='text-gray-400'>Holidays this year</p>
          <p className='text-sm font-semibold text-gray-800'>
            {totalThisYear}
          </p>
        </div>
        <div className='text-right'>
          <p className='text-gray-400'>Next holiday</p>
          <p className='text-sm font-semibold text-gray-800'>
            {upcoming
              ? `${upcoming.name} · ${upcoming.date.toLocaleDateString()}`
              : 'None scheduled'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HolidaysTrendChart;
