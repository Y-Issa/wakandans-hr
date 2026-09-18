import useStore from '@/lib/store';
import TeamMembers from './TeamMembers';
import AssignUserTeam from './AssignUserTeam';
import { HiAdjustmentsHorizontal, HiOutlineTrash } from 'react-icons/hi2';
import EditTeam from './EditTeam';
import ConfirmDeleteTeam from './ConfirmDeleteTeam';
import {
  useDeleteTeam,
  useTeamDetails,
  useEditTeamForm,
  useMemberActions,
  useModalState,
} from '@/hooks/useTeams';

interface TeamCardProps {
  team: {
    id: number;
    name: string;
    description: string;
    locationId: number;
  };
  page: number;
}

const TeamCard = ({ team, page }: TeamCardProps) => {
  const currentUser = useStore((state) => state.user);

  const { modalState, toggleModal } = useModalState();

  const { userCountData, userCountError, teamUsersData, allUsersData } =
    useTeamDetails(team.id, modalState);

  const { editFormData, handleEditChange, handleEditSubmit } = useEditTeamForm(
    {
      name: team.name,
      description: team.description,
      locationId: team.locationId,
    },
    team.id,
    page,
    toggleModal,
  );

  const { handleDelete } = useDeleteTeam(team.id, page, toggleModal);

  const { handleMemberAction } = useMemberActions(team.id, toggleModal);

  const userCount = userCountData?.data || 0;
  const users = teamUsersData?.data || [];
  const allUsers = allUsersData?.data || [];

  return (
    <div className='rounded-2xl bg-gradient-to-b from-blue-50 to-blue-100 p-6 flex-1 shadow-md hover:shadow-lg transition-shadow min-w-44'>
      <div className='flex justify-between items-center mb-4'>
        <span className='text-xs bg-white px-3 py-1 rounded-full shadow-sm min-w-6'>
          <h2 className='capitalize text-sm font-medium text-gray-600'>
            {team.name}
          </h2>
        </span>
        <span className='flex gap-3'>
          <button
            className='w-8 h-8 flex items-center justify-center text-blue-600 bg-blue-50 rounded-full shadow-md transition-all duration-300 ease-in-out hover:bg-blue-100 hover:shadow-lg focus:outline-none'
            onClick={() => toggleModal('showEditModal', true)}
          >
            <HiAdjustmentsHorizontal />
          </button>
          <button
            className='w-8 h-8 flex items-center justify-center text-red-600 bg-red-50 rounded-full hover:bg-red-100'
            onClick={() => toggleModal('showDeleteModal', true)}
          >
            <HiOutlineTrash />
          </button>
        </span>
      </div>
      <div>
        <p className='text-sm text-gray-600'>
          {team.description || 'No description available.'}
        </p>
      </div>
      {userCountError ? (
        <div className='text-red-600'>Failed to load users</div>
      ) : (
        <>
          <div className='flex items-baseline space-x-2'>
            <h1 className='text-3xl font-bold text-blue-700'>{userCount}</h1>
          </div>
          <h2 className='text-sm text-gray-600'>Members</h2>
        </>
      )}
      <div className='mt-4 flex space-x-2'>
        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={() => toggleModal('showAssignModal', true)}
            className='px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700'
          >
            Assign Employee
          </button>
        )}
        <button
          onClick={() => toggleModal('showMembers', true)}
          className='px-4 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-600 rounded-md hover:bg-blue-50'
        >
          View Members
        </button>
      </div>
      {modalState.showMembers && (
        <TeamMembers
          isLoadingTeamUsers={!teamUsersData}
          teamUsersError={!teamUsersData}
          users={users}
          handleModalClose={() => toggleModal('showMembers', false)}
          handleDeleteMember={(userId) => handleMemberAction(userId, 'delete')}
        />
      )}
      {modalState.showAssignModal && (
        <AssignUserTeam
          isLoadingAllUsers={!allUsersData}
          allUsersError={!allUsersData}
          allUsers={allUsers}
          handleAssignMember={(userId) => handleMemberAction(userId, 'assign')}
          handleAssignModalClose={() => toggleModal('showAssignModal', false)}
          usersInTeam={users}
        />
      )}
      {modalState.showDeleteModal && (
        <ConfirmDeleteTeam
          team={team}
          toggleModal={toggleModal}
          handleDelete={handleDelete}
        />
      )}
      {modalState.showEditModal && (
        <EditTeam
          editFormData={editFormData}
          handleEditChange={handleEditChange}
          handleEditSubmit={handleEditSubmit}
          toggleModal={toggleModal}
        />
      )}
    </div>
  );
};

export default TeamCard;
