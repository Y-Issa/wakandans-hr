import { useState } from 'react';
import useSWR from 'swr';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';

interface Location {
  id: number;
  name: string;
  country: string;
  city: string;
  address: string;
}

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data);

export const useLocations = () => {
  const { data, error, mutate } = useSWR<{ data: Location[]; next: boolean }>(
    `${API_BASE_URL}/locations`,
    fetcher,
    {
      revalidateOnFocus: false,
    },
  );

  const locations = data?.data || [];
  const hasNextPage = data?.next || false;
  const [formData, setFormData] = useState<Location>({
    id: 0,
    name: '',
    country: '',
    city: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        await axios.put(`${API_BASE_URL}/locations/${formData.id}`, formData, {
          withCredentials: true,
        });
      } else {
        await axios.post(`${API_BASE_URL}/locations`, formData, {
          withCredentials: true,
        });
      }
      mutate();
      setFormData({
        id: 0,
        name: '',
        country: '',
        city: '',
        address: '',
      });
    } catch (err) {
      console.error('Failed to save location:', err);
      setErrorMessage('Failed to save location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE_URL}/locations/${id}`, {
        withCredentials: true,
      });
      mutate();
    } catch (err) {
      console.error('Failed to delete location:', err);
      setErrorMessage('Failed to delete location. Please try again.');
    }
  };

  return {
    locations,
    hasNextPage,
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
