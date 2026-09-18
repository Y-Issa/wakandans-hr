'use client';

import AddConfiguration from '@/components/company/AddConfiguration';
import ConfigurationsList from '@/components/company/ConfigurationsList';
import { useCompanyConfigurations } from '@/hooks/useCompany';

const SettingsPage = () => {
  const {
    configurations,
    locations,
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
  } = useCompanyConfigurations();

  return (
    <div className='flex flex-col gap-6 py-4'>
      <h1 className='text-2xl font-semibold text-gray-900'>
        Company Configurations
      </h1>

      {error && <p className='text-red-500 text-sm'>{error}</p>}

      {!loading && !error && (
        <div className='flex gap-4 flex-col md:flex-row'>
          <div className='w-full lg:w-2/3 flex flex-col gap-8'>
            <ConfigurationsList
              configurations={configurations.map((config) => ({
                ...config,
                description: config.description || '',
              }))}
            />
          </div>
          <div className='w-full lg:w-1/3 flex flex-col gap-8 overflow-scroll hide-scrollbar'>
            <AddConfiguration
              formData={{
                ...formData,
                locationId:
                  typeof formData.locationId === 'string'
                    ? parseInt(formData.locationId, 10)
                    : formData.locationId,
              }}
              locations={locations}
              loading={loading}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default SettingsPage;
