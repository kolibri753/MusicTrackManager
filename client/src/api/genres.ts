import axios from 'axios';

export const getGenres = async (): Promise<string[]> => {
  const { data } = await axios.get<string[]>('/api/genres');
  return data;
};