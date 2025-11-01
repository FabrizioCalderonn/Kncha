const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createBooking,
  getMyBookings,
  getBooking,
  cancelBooking,
  updateBookingStatus,
  getVenueBookings,
  getVenueStats
} = require('../controllers/bookingController');

router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.get('/venue/:venueId', protect, authorize('owner', 'admin'), getVenueBookings);
router.get('/venue/:venueId/stats', protect, authorize('owner', 'admin'), getVenueStats);
router.get('/:id', protect, getBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, authorize('owner', 'admin'), updateBookingStatus);

module.exports = router;
