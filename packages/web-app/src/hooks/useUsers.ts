import { useEffect, useState } from 'react';
import useSWR, { mutate } from 'swr';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { useRouter } from 'next/navigation';

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  locationId: string;
  reportsToId: string;
  profile: {
    profileImage: string;
    title: string;
    employedAt: Date;
    dateOfBirth: Date;
  };
}

export const useUsers = (limit: number = 10) => {
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState('firstName');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const { data, error, isLoading } = useSWR(
    `${API_BASE_URL}/users?page=${page}&limit=${limit}&sortField=${sortBy}&sortOrder=${sortOrder}`,
    fetcher,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
    },
  );

  const users = data?.data || [];
  const hasNextPage = data?.next || false;

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, {
        withCredentials: true,
      });

      mutate(
        `${API_BASE_URL}/users?page=${page}&limit=${limit}&sortField=${sortBy}&sortOrder=${sortOrder}`,
        async (cachedData) => ({
          ...cachedData,
          data: cachedData?.data?.filter((user: User) => user.id !== id),
        }),
        false,
      );
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (updatedUser: User) => {
    try {
      const { id, ...userWithoutId } = updatedUser;
      await axios.put(`${API_BASE_URL}/users/${id}`, userWithoutId, {
        withCredentials: true,
      });
      mutate(
        `${API_BASE_URL}/users?page=${page}&limit=${limit}&sortField=${sortBy}&sortOrder=${sortOrder}`,
        async (cachedData) => ({
          ...cachedData,
          data: cachedData?.data.map((user: User) =>
            user.id === updatedUser.id ? updatedUser : user,
          ),
        }),
        false,
      );
    } catch (error) {
      console.error('Error updating user:', error);
    }
    setIsEditModalOpen(false);
  };

  return {
    users,
    page,
    setPage,
    sortBy,
    sortOrder,
    handleSort,
    hasNextPage,
    handleDelete,
    handleEdit,
    handleEditSubmit,
    selectedUser,
    setSelectedUser,
    isEditModalOpen,
    setIsEditModalOpen,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    isLoading,
    error,
  };
};

export const useProfile = (id: string | null) => {
  const {
    data: employeeData,
    error: employeeError,
    isLoading: employeeLoading,
  } = useSWR(id ? `${API_BASE_URL}/users/${id}` : null, fetcher);
  const { data: departmentData, error: departmentError } = useSWR(
    id ? `${API_BASE_URL}/userDepartments/user/${id}` : null,
    fetcher,
  );
  const { data: teamData, error: teamError } = useSWR(
    id ? `${API_BASE_URL}/userTeams/user/${id}` : null,
    fetcher,
  );

  const isLoading = employeeLoading || !departmentData || !teamData;
  const error = employeeError || departmentError || teamError;

  const employee = employeeData;
  const departments = departmentData?.data || [];
  const teams = teamData?.data || [];

  return {
    employee,
    departments,
    teams,
    isLoading,
    error,
  };
};

interface LocationData {
  data: { id: string; name: string }[];
  next: string | null | boolean;
}

interface ManagerData {
  id: string;
  firstName: string;
  lastName: string;
}

export const useUserEditData = () => {
  const { data: locationsData, error: locationError } = useSWR<LocationData>(
    `${API_BASE_URL}/locations`,
    fetcher,
  );
  const { data: managersData, error: managerError } = useSWR<{
    data: ManagerData[];
  }>(`${API_BASE_URL}/users/managers`, fetcher);

  return {
    locations: locationsData?.data || [],
    managers: managersData?.data || [],
    locationError,
    managerError,
    isLoading: !locationsData || !managersData,
  };
};

interface FormData {
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  locationId: string;
  reportsToId: string;
  profile: {
    title: string;
  };
}

interface LocationData {
  id: string;
  name: string;
}

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
}

export const useCreateUser = () => {
  const [formData, setFormData] = useState<FormData>({
    email: '',
    firstName: '',
    lastName: '',
    role: '',
    locationId: '',
    reportsToId: '',
    profile: {
      title: '',
    },
  });
  const [locations, setLocations] = useState<LocationData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchLocationsAndUsers = async () => {
      try {
        const [locationsResponse, usersResponse] = await Promise.all([
          axios.get(`${API_BASE_URL}/locations`, { withCredentials: true }),
          axios.get(`${API_BASE_URL}/users/managers`, {
            withCredentials: true,
          }),
        ]);

        setLocations(locationsResponse.data.data);
        setUsers(usersResponse.data.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch locations or users.');
      }
    };

    fetchLocationsAndUsers();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setFormData((prev) => ({
        ...prev,
        profile: { ...prev.profile, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/users`, formData, {
        withCredentials: true,
      });

      if (response.status === 201) {
        alert('Employee created successfully');
        router.push('/employees');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to create employee. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    setFormData,
    locations,
    users,
    error,
    loading,
    handleChange,
    handleSubmit,
  };
};
