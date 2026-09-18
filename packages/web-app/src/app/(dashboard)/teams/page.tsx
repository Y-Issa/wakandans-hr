'use client';

import React, { useState } from 'react';
import { HiPlus } from 'react-icons/hi2';
import TeamCard from '@/components/teams/TeamCard';
import Pagination from '@/components/Pagination';
import CreateTeamForm from '@/components/teams/CreateTeamForm';
import PillButton from '@/components/ui/PillButton';
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
    <div className='flex flex-col gap-6 py-4'>
      <div className='flex justify-between items-center'>
        <h1 className='text-2xl font-semibold text-gray-900'>Teams</h1>
        <PillButton onClick={() => setIsModalOpen(true)}>
          <HiPlus size={16} />
          Add Team
        </PillButton>
      </div>

      {isLoadingTeams && <p className='text-gray-400'>Loading...</p>}
      {teamsError && <p className='text-red-500'>Error loading teams.</p>}

      {teams && (
        <>
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4'>
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
