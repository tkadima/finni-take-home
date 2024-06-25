import useSWR, { mutate } from 'swr';
import axios from 'axios';

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useFetch = (url: string) => {
  const { data, error } = useSWR(url, fetcher);

  const post = async (url: string, payload: any) => {
    try {
      const response = await axios.post(url, payload);
      mutate('/api/patients');
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const put = async (url: string, payload: any) => {
    try {
      const response = await axios.put(url, payload);
      mutate('/api/patients');
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  const del = async (url: string) => {
    try {
      const response = await axios.delete(url);
      mutate('/api/patients');
      return response.data;
    } catch (err) {
      throw err;
    }
  };

  return {
    data,
    isLoading: !error && !data,
    isError: error,
    post,
    put,
    del,
  };
};

export default useFetch;
