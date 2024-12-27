import { API_BASE_URL } from '@/lib/constants';
import axios from 'axios';
import { useState } from 'react';
import useSWR, { mutate } from 'swr';

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

export const useDepartmentDetails = (
  departmentId: number,
  modalState: { showMembers: boolean; showAssignModal: boolean },
) => {
  const fetcher = (url: string) =>
    axios.get(url, { withCredentials: true }).then((res) => res.data);
  // User count data
  const { data: userCountData, error: userCountError } = useSWR(
    `${API_BASE_URL}/userDepartments/department/user-count/${departmentId}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  // Department users data
  const { data: departmentUsersData } = useSWR(
    modalState.showMembers || modalState.showAssignModal
      ? `${API_BASE_URL}/userDepartments/department/${departmentId}`
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
    departmentUsersData,
    allUsersData,
  };
};

export const useEditForm = (
  initialData: { name: string; description: string; locationId: number },
  departmentId: number,
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
      await axios.put(
        `${API_BASE_URL}/departments/${departmentId}`,
        editFormData,
        { withCredentials: true },
      );
      mutate(`${API_BASE_URL}/departments?page=${page}&limit=10`);
      toggleModal('showEditModal', false);
    } catch (error) {
      console.error('Error updating department:', error);
    }
  };

  return { editFormData, handleEditChange, handleEditSubmit };
};

export const useDeleteDepartment = (
  departmentId: number,
  page: number,
  toggleModal: (key: string, state: boolean) => void,
) => {
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/departments/${departmentId}`, {
        withCredentials: true,
      });
      mutate(`${API_BASE_URL}/departments?page=${page}&limit=10`);
      toggleModal('showDeleteModal', false);
    } catch (error) {
      console.error('Error deleting department:', error);
    }
  };
  return { handleDelete };
};

export const useMemberActions = (
  departmentId: number,
  toggleModal: (key: string, state: boolean) => void,
) => {
  const handleMemberAction = async (
    userId: number,
    action: 'assign' | 'delete',
  ) => {
    const url =
      action === 'assign'
        ? `${API_BASE_URL}/userDepartments/`
        : `${API_BASE_URL}/userDepartments/user/${userId}/department/${departmentId}`;
    const method = action === 'assign' ? 'post' : 'delete';
    const data = action === 'assign' ? { userId, departmentId } : null;

    try {
      if (action === 'assign') {
        await axios.post(url, data, { withCredentials: true });
      } else {
        await axios[method](url, { withCredentials: true });
      }
      mutate(`${API_BASE_URL}/userDepartments/department/${departmentId}`);
      mutate(
        `${API_BASE_URL}/userDepartments/department/user-count/${departmentId}`,
      );
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
