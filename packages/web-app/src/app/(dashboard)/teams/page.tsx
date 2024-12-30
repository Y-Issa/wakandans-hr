'use client';

import React, { useState } from 'react';
import TeamCard from '@/components/teams/TeamCard';
import Pagination from '@/components/Pagination';
import CreateTeamForm from '@/components/teams/CreateTeamForm';
import { useTeams, useTeamForm, useLocations } from '@/hooks/useTeams';

const TeamList: React.FC = () => {
  const [page, setPage] = useState(0);

  const limit = 10;
  const {
    teams,
    hasNextPage,
    isLoading: isLoadingTeams,
    error: teamsError,
  } = useTeams(page, limit);

  const {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error: formError,
    isModalOpen,
    setIsModalOpen,
  } = useTeamForm(page, limit);

  const { locations } = useLocations();

  return (
    <div className='bg-white p-6 rounded-lg shadow-md m-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Teams</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className='bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded'
        >
          Add Team
        </button>
      </div>

      {isLoadingTeams && <p>Loading...</p>}
      {teamsError && <p>Error loading teams.</p>}

      {teams && (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center mt-3'>
            {teams.map(
              (team: {
                id: number;
                name: string;
                description: string;
                locationId: number;
              }) => (
                <TeamCard key={team.id} team={team} page={page} />
              ),
            )}
          </div>

          {(teams.length > limit || page > 0) && (
            <Pagination
              page={page}
              hasNextPage={hasNextPage}
              onPrevious={() => setPage(page - 1)}
              onNext={() => setPage(page + 1)}
            />
          )}
        </>
      )}

      {isModalOpen && (
        <CreateTeamForm
          error={formError}
          formData={formData}
          locations={locations}
          loading={loading}
          setIsModalOpen={setIsModalOpen}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
        />
      )}
    </div>
  );
};

export default TeamList;
