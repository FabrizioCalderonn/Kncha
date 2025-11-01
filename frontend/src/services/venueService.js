import api from '../config/api';

// Get all venues
export const getVenues = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/venues?${params}`);
  return response.data;
};

// Get venue by ID
export const getVenue = async (id) => {
  const response = await api.get(`/venues/${id}`);
  return response.data;
};

// Get my venues (owner)
export const getMyVenues = async () => {
  const response = await api.get('/venues/my/venues');
  return response.data;
};

// Create venue
export const createVenue = async (venueData) => {
  const response = await api.post('/venues', venueData);
  return response.data;
};

// Update venue
export const updateVenue = async (id, venueData) => {
  const response = await api.put(`/venues/${id}`, venueData);
  return response.data;
};

// Delete venue
export const deleteVenue = async (id) => {
  const response = await api.delete(`/venues/${id}`);
  return response.data;
};
