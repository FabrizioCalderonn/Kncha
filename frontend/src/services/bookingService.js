import api from '../config/api';

// Create booking
export const createBooking = async (bookingData) => {
  const response = await api.post('/bookings', bookingData);
  return response.data;
};

// Get my bookings
export const getMyBookings = async () => {
  const response = await api.get('/bookings/my');
  return response.data;
};

// Get booking by ID
export const getBooking = async (id) => {
  const response = await api.get(`/bookings/${id}`);
  return response.data;
};

// Cancel booking
export const cancelBooking = async (id) => {
  const response = await api.put(`/bookings/${id}/cancel`);
  return response.data;
};

// Update booking status (owner/admin)
export const updateBookingStatus = async (id, status) => {
  const response = await api.put(`/bookings/${id}/status`, { status });
  return response.data;
};

// Get venue bookings (owner)
export const getVenueBookings = async (venueId) => {
  const response = await api.get(`/bookings/venue/${venueId}`);
  return response.data;
};

// Get venue stats (owner)
export const getVenueStats = async (venueId, startDate, endDate) => {
  const params = new URLSearchParams({ start_date: startDate, end_date: endDate }).toString();
  const response = await api.get(`/bookings/venue/${venueId}/stats?${params}`);
  return response.data;
};
