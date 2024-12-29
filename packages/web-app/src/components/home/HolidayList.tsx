import { useHolidays } from '@/hooks/useHolidays';

const HolidayList = () => {
  const { holidays, loading, error } = useHolidays();

  if (loading) {
    return <div>Loading holidays...</div>;
  }

  if (error) {
    return (
      <div className='text-red-500'>
        Error fetching holidays: {error.message}
      </div>
    );
  }

  const currentDate = new Date();
  const futureDate = new Date();
  futureDate.setMonth(currentDate.getMonth() + 5);

  const upcomingHolidays = holidays.filter((holiday) => {
    const holidayDate = new Date(holiday.fromDate);
    return holidayDate > currentDate && holidayDate <= futureDate;
  });

  return (
    <div className='p-6 bg-white shadow-sm rounded-md'>
      <h2 className='text-2xl font-semibold mb-4'>Upcoming Holidays</h2>
      {upcomingHolidays.length === 0 ? (
        <p>
          No upcoming holidays in the next 5 months. (Admin might have forgot to
          update holiday data)
        </p>
      ) : (
        <ul className='space-y-3'>
          {upcomingHolidays.map((holiday) => (
            <li
              key={holiday.id}
              className='flex justify-between items-center border-b pb-2'
            >
              <span className='font-medium text-gray-800'>{holiday.name}</span>
              <span className='text-gray-500'>
                {new Date(holiday.fromDate).toLocaleDateString()}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HolidayList;
