import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import axiosInstance from '@/lib/axiosInstance';

interface Holiday {
  id: number;
  name: string;
  fromDate: string;
  toDate: string;
  createdAt?: string;
  updatedAt?: string;
}

const fetcher = (url: string) =>
  axiosInstance.get(url, { withCredentials: true }).then((res) => res.data);

export const useHolidays = () => {
  const { data, error, mutate } = useSWR<{ data: Holiday[] }>(
    `${API_BASE_URL}/day-offs?limit=50&page=0`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const holidays = data?.data || [];
  const [formData, setFormData] = useState<Holiday>({
    id: 0,
    name: '',
    fromDate: '',
    toDate: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');

    try {
      if (formData.id) {
        await axios.put(`${API_BASE_URL}/day-offs/${formData.id}`, formData, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_BASE_URL}/day-offs`, formData, {
          withCredentials: true,
        });
      }
      mutate();
      setFormData({
        id: 0,
        name: '',
        fromDate: '',
        toDate: '',
      });
    } catch (err) {
      console.error('Failed to save holiday:', err);
      setErrorMessage('Failed to save holiday. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/day-offs/${id}`, {
        withCredentials: true,
      });
      mutate();
    } catch (err) {
      console.error('Failed to delete holiday:', err);
      setErrorMessage('Failed to delete holiday. Please try again.');
    }
  };

  return {
    holidays,
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    handleDelete,
    error,
    errorMessage,
    loading,
  };
};
