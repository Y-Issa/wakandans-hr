import React from 'react';
import SectionWrapper from './sectionWraper';

interface Team {
  team: {
    id: string;
    name: string;
    description: string;
  };
}

const TeamList = ({ teams }: { teams: Team[] }) => (
  <SectionWrapper title='Teams'>
    {teams.length > 0 ? (
      <ul className='space-y-3'>
        {teams.map(({ team: { id, name, description } }) => (
          <li key={id} className='p-4 bg-white rounded-lg shadow'>
            <h3 className='font-bold'>{name}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className='text-gray-500'>This user is not part of any team.</p>
    )}
  </SectionWrapper>
);

export default TeamList;
