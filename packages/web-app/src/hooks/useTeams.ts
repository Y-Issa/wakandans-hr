import axiosInstance from '@/lib/axiosInstance';
import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';

const fetcher = (url: string) =>
  axiosInstance.get(url, { withCredentials: true }).then((res) => res.data);

export const useModalState = () => {
  const [modalState, setModalState] = useState({
    showMembers: false,
    showAssignModal: false,
    showEditModal: false,
    showDeleteModal: false,
  });

  const toggleModal = (key: string, state: boolean) => {
    setModalState((prev) => ({ ...prev, [key]: state }));
  };

  return { modalState, toggleModal };
};

export const useTeamDetails = (
  teamId: number,
  modalState: { showMembers: boolean; showAssignModal: boolean },
) => {
  // User count data
  const { data: userCountData, error: userCountError } = useSWR(
    `${API_BASE_URL}/userTeams/team/user-count/${teamId}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  // Team users data
  const { data: teamUsersData } = useSWR(
    modalState.showMembers || modalState.showAssignModal
      ? `${API_BASE_URL}/userTeams/team/${teamId}`
      : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  // All users data
  const { data: allUsersData } = useSWR(
    modalState.showAssignModal ? `${API_BASE_URL}/users?limit=1100` : null,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  return {
    userCountData,
    userCountError,
    teamUsersData,
    allUsersData,
  };
};

export const useEditTeamForm = (
  initialData: { name: string; description: string; locationId: number },
  teamId: number,
  page: number,
  toggleModal: (key: string, state: boolean) => void,
) => {
  const [editFormData, setEditFormData] = useState(initialData);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`${API_BASE_URL}/teams/${teamId}`, editFormData, {
        withCredentials: true,
      });
      mutate(`${API_BASE_URL}/teams?page=${page}&limit=10`);
      toggleModal('showEditModal', false);
    } catch (error) {
      console.error('Error updating team:', error);
    }
  };

  return { editFormData, handleEditChange, handleEditSubmit };
};

export const useDeleteTeam = (
  teamId: number,
  page: number,
  toggleModal: (key: string, state: boolean) => void,
) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/teams/${teamId}`, {
        withCredentials: true,
      });
      mutate(`${API_BASE_URL}/teams?page=${page}&limit=10`);
      toggleModal('showDeleteModal', false);
    } catch (error) {
      console.error('Error deleting team:', error);
    }
  };
  return { handleDelete };
};

export const useMemberActions = (
  teamId: number,
  toggleModal: (key: string, state: boolean) => void,
) => {
  const handleMemberAction = async (
    userId: number,
    action: 'assign' | 'delete',
  ) => {
    const url =
      action === 'assign'
        ? `${API_BASE_URL}/userTeams/`
        : `${API_BASE_URL}/userTeams/user/${userId}/team/${teamId}`;
    const method = action === 'assign' ? 'post' : 'delete';
    const data = action === 'assign' ? { userId, teamId } : null;

    try {
      if (action === 'assign') {
        await axios.post(url, data, { withCredentials: true });
      } else {
        await axios[method](url, { withCredentials: true });
      }
      mutate(`${API_BASE_URL}/userTeams/team/${teamId}`);
      mutate(`${API_BASE_URL}/userTeams/team/user-count/${teamId}`);
      if (action === 'assign') toggleModal('showAssignModal', false);
    } catch (error) {
      console.error(
        `Error ${action === 'assign' ? 'assigning' : 'deleting'} user:`,
        error,
      );
    }
  };

  return { handleMemberAction };
};

export const useTeams = (page: number, limit: number) => {
  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/teams?page=${page}&limit=${limit}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const teams = data?.data || [];
  const hasNextPage = data?.next || false;

  return { teams, hasNextPage, error, isLoading };
};

export const useTeamForm = (page: number, limit: number) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    locationId: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/teams`, formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        mutate(`${API_BASE_URL}/teams?page=${page}&limit=${limit}`);
        setFormData({ name: '', description: '', locationId: '' });
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create team. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    handleChange,
    handleSubmit,
    loading,
    error,
    isModalOpen,
    setIsModalOpen,
  };
};

export const useLocations = () => {
  const [locations, setLocations] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/locations`, {
          withCredentials: true,
        });
        setLocations(response.data.data);
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        setError('Failed to fetch locations.');
      }
    };

    fetchLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { locations, error };
};
