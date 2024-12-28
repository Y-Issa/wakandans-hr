import { FaUsers } from 'react-icons/fa6';

interface DepartmentCardProps {
  name: string;
  employeeCount: number;
}

const DepartmentCard = ({ name, employeeCount }: DepartmentCardProps) => {
  return (
    <div className='rounded-2xl bg-gradient-to-b from-blue-50 to-blue-100 p-6 flex-1 shadow-md hover:shadow-lg transition-shadow min-w-44'>
      <div className='flex justify-between items-center mb-4'>
        <span className='text-xs bg-white px-3 py-1 rounded-full shadow-sm min-w-6'>
          <h2 className='capitalize text-sm font-medium text-gray-600'>
            {name}
          </h2>
        </span>
        <span className='text-blue-600'>
          <FaUsers />
        </span>
      </div>
      <div className='flex items-baseline space-x-2'>
        <h1 className='text-3xl font-bold text-blue-700'>{employeeCount}</h1>
      </div>
      <h2 className='text-sm text-gray-600'>Employees</h2>
    </div>
  );
};

export default DepartmentCard;
