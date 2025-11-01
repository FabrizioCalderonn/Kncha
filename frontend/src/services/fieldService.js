import api from '../config/api';

// Get fields by venue
export const getFieldsByVenue = async (venueId) => {
  const response = await api.get(`/fields/venue/${venueId}`);
  return response.data;
};

// Get field by ID
export const getField = async (id) => {
  const response = await api.get(`/fields/${id}`);
  return response.data;
};

// Create field
export const createField = async (fieldData) => {
  const response = await api.post('/fields', fieldData);
  return response.data;
};

// Update field
export const updateField = async (id, fieldData) => {
  const response = await api.put(`/fields/${id}`, fieldData);
  return response.data;
};

// Delete field
export const deleteField = async (id) => {
  const response = await api.delete(`/fields/${id}`);
  return response.data;
};

// Check availability
export const checkAvailability = async (fieldId, date, startTime, endTime) => {
  const response = await api.post(`/fields/${fieldId}/availability`, {
    date,
    start_time: startTime,
    end_time: endTime
  });
  return response.data;
};

// Get booked slots
export const getBookedSlots = async (fieldId, date) => {
  const response = await api.get(`/fields/${fieldId}/booked-slots?date=${date}`);
  return response.data;
};
