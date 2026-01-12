import api from './api';

const gigService = {
  getAllGigs: async (search = '') => {
    const url = search ? `/gigs?search=${search}` : '/gigs';
    const response = await api.get(url);
    return response.data.data;
  },

  getGigById: async (gigId) => {
    const response = await api.get(`/gigs/${gigId}`);
    return response.data.data;
  },

  createGig: async (gigData) => {
    const response = await api.post('/gigs', gigData);
    return response.data.data;
  },

  updateGig: async (gigId, gigData) => {
    const response = await api.patch(`/gigs/${gigId}`, gigData);
    return response.data.data;
  },

  deleteGig: async (gigId) => {
    await api.delete(`/gigs/${gigId}`);
    return gigId;
  },

  getMyGigs: async () => {
    const response = await api.get('/gigs/my');
    return response.data.data;
  },
};

export default gigService;
