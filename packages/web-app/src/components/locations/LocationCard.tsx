import { HiAdjustmentsHorizontal, HiOutlineTrash } from 'react-icons/hi2';

interface Location {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
}

interface LocationCardProps {
  location: Location;
  toggleEdit: (location: Location) => void;
  toggleDeleteModal: (id: number) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({
  location,
  toggleEdit,
  toggleDeleteModal,
}) => {
  return (
    <div
      key={location.id}
      className='flex items-center justify-between p-4 bg-white shadow-sm rounded-md border'
    >
      <div>
        <p className='font-semibold text-gray-800'>{location.name}</p>
        <p className='text-sm text-gray-600'>
          {location.address}, {location.city}, {location.country}
        </p>
      </div>
      <div className='flex gap-2'>
        <button
          className='w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100'
          onClick={() => toggleEdit(location)}
        >
          <HiAdjustmentsHorizontal size={20} />
        </button>
        <button
          className='w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 rounded-full hover:bg-red-100'
          onClick={() => toggleDeleteModal(location.id)}
        >
          <HiOutlineTrash size={20} />
        </button>
      </div>
    </div>
  );
};

export default LocationCard;
