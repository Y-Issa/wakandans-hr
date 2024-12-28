import useSWR from 'swr';
import axios from 'axios';
import { API_BASE_URL } from '@/lib/constants';
import { useEffect, useState } from 'react';

export interface CompanyConfiguration {
  id: string;
  logo: string;
  website: string;
  description?: string;
  locationId?: number | string;
  company: {
    id: string;
    name: string;
  };
  location?: {
    id: string;
    name: string;
    country: string;
    city: string;
    address: string;
  };
}

export interface LocationData {
  id: string;
  name: string;
  country: string;
  city: string;
  address: string;
}

const fetcher = (url: string) =>
  axios.get(url, { withCredentials: true }).then((res) => res.data.data);

export const useCompanyConfigurations = () => {
  const {
    data: configurations,
    error: configurationsError,
    mutate,
  } = useSWR<CompanyConfiguration[]>(
    `${API_BASE_URL}/company-configurations`,
    fetcher,
  );

  const [locations, setLocations] = useState<LocationData[]>([]);
  const [formData, setFormData] = useState<Partial<CompanyConfiguration>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;

    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/locations`, {
          withCredentials: true,
        });
        if (isMounted) {
          setLocations(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch locations:', err);
        if (isMounted) {
          setError('Failed to fetch locations.');
        }
      }
    };

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'locationId' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    console.log('Form Data:', formData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/company-configurations`,
        formData,
        { withCredentials: true },
      );

      if (response.status === 201) {
        mutate();
        setFormData({});
      }
    } catch (err) {
      console.error('Failed to save configuration:', err);
      setError('Failed to save configuration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/company-configurations/${id}`, {
        withCredentials: true,
      });
      mutate();
    } catch (err) {
      console.error('Failed to delete configuration:', err);
      setError('Failed to delete configuration. Please try again.');
    }
  };

  const handleUpdate = async (
    id: string,
    updatedData: Partial<CompanyConfiguration>,
  ) => {
    try {
      await axios.put(
        `${API_BASE_URL}/company-configurations/${id}`,
        updatedData,
        {
          withCredentials: true,
        },
      );
      mutate();
    } catch (err) {
      console.error('Failed to update configuration:', err);
      setError('Failed to update configuration. Please try again.');
    }
  };

  return {
    configurations: configurations || [],
    locations,
    error: configurationsError || error,
    loading,
    formData,
    handleChange,
    handleSubmit,
    mutate,
    handleDelete,
    handleUpdate,
  };
};
