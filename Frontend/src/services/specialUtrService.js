import axiosInstance from './axiosInstance';

export const specialUtrService = {
  getSpecialUtrs: async (params = {}) => {
    const response = await axiosInstance.get('/special-utr', { params });
    return response.data;
  },

  generateSpecialUtr: async (data) => {
    const response = await axiosInstance.post('/special-utr', data);
    return response.data;
  },

  deleteSpecialUtr: async (id) => {
    const response = await axiosInstance.delete(`/special-utr/${id}`);
    return response.data;
  },
};
