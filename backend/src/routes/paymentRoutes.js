const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  updatePaymentMethod,
  confirmPayment,
  getPaymentInfo
} = require('../controllers/paymentController');

router.get('/booking/:id', protect, getPaymentInfo);
router.put('/booking/:id/method', protect, updatePaymentMethod);
router.put('/booking/:id/confirm', protect, authorize('owner', 'admin'), confirmPayment);

module.exports = router;
