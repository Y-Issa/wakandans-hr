import React from 'react';
import SectionWrapper from './sectionWraper';

interface Department {
  department: {
    id: string;
    name: string;
    description: string;
  };
}

const UserDepartmentList = ({ departments }: { departments: Department[] }) => (
  <SectionWrapper title='Departments'>
    {departments.length > 0 ? (
      <ul className='space-y-3'>
        {departments.map(({ department: { id, name, description } }) => (
          <li key={id} className='p-4 bg-white rounded-lg shadow'>
            <h3 className='font-bold'>{name}</h3>
            <p>{description}</p>
          </li>
        ))}
      </ul>
    ) : (
      <p className='text-gray-500'>This user is not part of any department.</p>
    )}
  </SectionWrapper>
);

export default UserDepartmentList;
