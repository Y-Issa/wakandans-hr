import { useHolidays } from '@/hooks/useHolidays';

const HolidayList = () => {
  const { holidays, loading, error } = useHolidays();

  if (loading) {
    return <p className='text-sm text-gray-400'>Loading holidays...</p>;
  }

  if (error) {
    return (
      <p className='text-sm text-red-500'>
        Error fetching holidays: {error.message}
      </p>
    );
  }

  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setMonth(currentDate.getMonth() + 5);

  const upcomingHolidays = holidays
    .filter((holiday) => {
      const holidayDate = new Date(holiday.fromDate);
      return holidayDate > currentDate && holidayDate <= futureDate;
    })
    .sort(
      (a, b) => new Date(a.fromDate).getTime() - new Date(b.fromDate).getTime(),
    );

  if (upcomingHolidays.length === 0) {
    return (
      <p className='text-sm text-gray-400'>
        No upcoming holidays in the next 5 months.
      </p>
    );
  }

  return (
    <ul className='flex flex-col gap-3'>
      {upcomingHolidays.map((holiday) => (
        <li
          key={holiday.id}
          className='flex justify-between items-center border-b border-gray-100 pb-2 last:border-0 last:pb-0'
        >
          <span className='text-sm font-medium text-gray-700'>
            {holiday.name}
          </span>
          <span className='text-xs text-gray-400'>
            {new Date(holiday.fromDate).toLocaleDateString()}
          </span>
        </li>
      ))}
    </ul>
  );
};

export default HolidayList;
