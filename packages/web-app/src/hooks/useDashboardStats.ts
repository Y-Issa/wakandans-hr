import { useEffect, useState } from 'react';
import useSWR from 'swr';
import { API_BASE_URL } from '@/lib/constants';
import axiosInstance from '@/lib/axiosInstance';

const fetcher = (url: string) =>
  axiosInstance.get(url, { withCredentials: true }).then((res) => res.data);

interface DashboardUser {
  id: number;
  firstName: string;
  lastName: string;
  role: string;
  profile?: { profileImage?: string };
}

interface DashboardDepartment {
  id: number;
  name: string;
}

interface DashboardTeam {
  id: number;
  name: string;
}

export interface DepartmentHeadcount {
  id: number;
  name: string;
  count: number;
}

export const useDashboardStats = () => {
  const { data: usersData, isLoading: usersLoading } = useSWR<{
    data: DashboardUser[];
  }>(`${API_BASE_URL}/users?limit=1100`, fetcher, {
    revalidateOnFocus: false,
  });

  const { data: departmentsData, isLoading: departmentsLoading } = useSWR<{
    data: DashboardDepartment[];
  }>(`${API_BASE_URL}/departments?limit=100`, fetcher, {
    revalidateOnFocus: false,
  });

  const { data: teamsData, isLoading: teamsLoading } = useSWR<{
    data: DashboardTeam[];
  }>(`${API_BASE_URL}/teams?limit=100`, fetcher, {
    revalidateOnFocus: false,
  });

  const users = usersData?.data || [];
  const departments = departmentsData?.data || [];
  const teams = teamsData?.data || [];

  const [departmentHeadcounts, setDepartmentHeadcounts] = useState<
    DepartmentHeadcount[]
  >([]);

  useEffect(() => {
    if (departments.length === 0) return;

    let cancelled = false;

    const loadCounts = async () => {
      const counts = await Promise.all(
        departments.map(async (department) => {
          try {
            const res = await axiosInstance.get(
              `${API_BASE_URL}/userDepartments/department/user-count/${department.id}`,
              { withCredentials: true },
            );
            return {
              id: department.id,
              name: department.name,
              count: res.data?.data ?? 0,
            };
          } catch {
            return { id: department.id, name: department.name, count: 0 };
          }
        }),
      );
      if (!cancelled) setDepartmentHeadcounts(counts);
    };

    loadCounts();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentsData]);

  const roleBreakdown = users.reduce<Record<string, number>>((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  return {
    totalEmployees: users.length,
    totalDepartments: departments.length,
    totalTeams: teams.length,
    sampleUsers: users.slice(0, 4),
    roleBreakdown,
    departmentHeadcounts,
    isLoading: usersLoading || departmentsLoading || teamsLoading,
  };
};
