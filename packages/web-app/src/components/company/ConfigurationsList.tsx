import { useCompanyConfigurations } from '@/hooks/useCompany';
import Image from 'next/image';
import React, { useState } from 'react';
import { HiAdjustmentsHorizontal, HiOutlineTrash } from 'react-icons/hi2';
import ConfirmDeleteConfig from './ConfirmDeleteConfig';
import EditConfigModal from './EditConfigModal';

interface Configuration {
  id: string;
  logo: string;
  website: string;
  description?: string;
  company: {
    id: string;
    name: string;
  };
  location?: {
    id: string;
    name: string;
    country: string;
    city: string;
    address: string;
  };
}

interface ConfigurationsListProps {
  configurations: Configuration[];
}

const ConfigurationsList: React.FC<ConfigurationsListProps> = ({
  configurations,
}) => {
  const { handleDelete, handleUpdate, locations } = useCompanyConfigurations();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<Configuration | null>(
    null,
  );

  const toggleDeleteModal = (config: Configuration | null) => {
    setSelectedConfig(config);
    setShowDeleteModal(!!config);
  };

  const toggleEditModal = (config: Configuration | null) => {
    setSelectedConfig(config);
    setShowEditModal(!!config);
  };

  const confirmDelete = () => {
    if (selectedConfig) {
      handleDelete(selectedConfig.id);
      toggleDeleteModal(null);
    }
  };

  return (
    <div className='mt-2 bg-white p-2 sm:p-4 rounded shadow'>
      <h2 className='text-lg sm:text-xl font-bold mb-4'>
        Existing Configurations
      </h2>
      {configurations.length === 0 ? (
        <p>No configurations available.</p>
      ) : (
        <ul className='space-y-4'>
          {configurations.map((config) => (
            <li
              key={config.id}
              className='p-2 sm:p-4 border rounded bg-white shadow'
            >
              <div className='flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-4'>
                <Image
                  src={config.logo ? config.logo : '/logo.png'}
                  alt='Logo'
                  width={48}
                  height={48}
                  className='w-12 h-12 sm:w-16 sm:h-16 rounded'
                />
                <div className='flex-1 flex flex-col space-y-2'>
                  <p>
                    <strong>Website:</strong>{' '}
                    <a
                      href={config.website}
                      className='text-blue-500 hover:underline break-words'
                    >
                      {config.website}
                    </a>
                  </p>
                  <p>
                    <strong>Description:</strong> {config.description}
                  </p>
                  {config.location ? (
                    <>
                      <p>
                        <strong>Location:</strong> {config.location.city},{' '}
                        {config.location.country}
                      </p>
                      <p>
                        <strong>Address:</strong> {config.location.address}
                      </p>
                    </>
                  ) : (
                    <p className='text-gray-500'>
                      No specific location assigned.
                    </p>
                  )}
                </div>
                <div className='flex gap-2 justify-end'>
                  <button
                    className='w-8 h-8 flex items-center justify-center text-gray-600 bg-gray-50 rounded-full hover:bg-gray-100'
                    onClick={() => toggleEditModal(config)}
                  >
                    <HiAdjustmentsHorizontal size={20} />
                  </button>
                  <button
                    className='w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 rounded-full hover:bg-red-100'
                    onClick={() => toggleDeleteModal(config)}
                  >
                    <HiOutlineTrash size={20} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showDeleteModal && selectedConfig && (
        <ConfirmDeleteConfig
          selectedConfig={selectedConfig}
          toggleDeleteModal={toggleDeleteModal}
          confirmDelete={confirmDelete}
        />
      )}

      {showEditModal && selectedConfig && (
        <EditConfigModal
          selectedConfig={selectedConfig}
          toggleEditModal={toggleEditModal}
          handleUpdate={handleUpdate}
          locations={locations}
        />
      )}
    </div>
  );
};

export default ConfigurationsList;
