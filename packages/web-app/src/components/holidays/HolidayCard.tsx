import { HiAdjustmentsHorizontal, HiOutlineTrash } from 'react-icons/hi2';

interface HolidayCardProps {
  holiday: {
    id: number;
    name: string;
    fromDate: string;
    toDate: string;
  };
  toggleEdit: (holiday: {
    id: number;
    name: string;
    fromDate: string;
    toDate: string;
  }) => void;
  toggleDeleteModal: (id: number) => void;
}

const HolidayCard: React.FC<HolidayCardProps> = ({
  holiday,
  toggleEdit,
  toggleDeleteModal,
}) => {
  return (
    <div
      key={holiday.id}
      className='flex items-center justify-between p-4 bg-white shadow-sm rounded-md border'
    >
      <div>
        <p className='font-semibold text-gray-800'>{holiday.name}</p>
        <p className='text-sm text-gray-600'>
          From: {new Date(holiday.fromDate).toLocaleDateString()} <br />
          To: {new Date(holiday.toDate).toLocaleDateString()}
        </p>
      </div>
      <div className='flex gap-2'>
        <button
          className='w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100'
          onClick={() => toggleEdit(holiday)}
        >
          <HiAdjustmentsHorizontal size={20} />
        </button>
        <button
          className='w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 rounded-full hover:bg-red-100'
          onClick={() => toggleDeleteModal(holiday.id)}
        >
          <HiOutlineTrash size={20} />
        </button>
      </div>
    </div>
  );
};

export default HolidayCard;
