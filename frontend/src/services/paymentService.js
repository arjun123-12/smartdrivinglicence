import api from './api';

export const paymentService = {
  /**
   * Request a Stripe-hosted Checkout Session for lesson/VORT booking.
   */
  async createStripeCheckoutSession(payload) {
    const res = await api.post('/payments/stripe/checkout-session', payload);
    return res.data;
  },

  /**
   * Resume an existing pending Checkout Session.
   */
  async resumeStripeCheckoutSession(bookingReference) {
    const res = await api.post('/payments/stripe/resume', {
      booking_reference: bookingReference,
    });
    return res.data;
  },

  /**
   * Cancel and release a held slot if customer returns via cancel URL.
   */
  async cancelStripeCheckoutSession(bookingReference) {
    const res = await api.post('/payments/stripe/cancel', {
      booking_reference: bookingReference,
    });
    return res.data;
  },

  /**
   * Fetch current payment and confirmation status for return page.
   */
  async getBookingPaymentStatus(reference, sessionId = null) {
    const params = sessionId ? { session_id: sessionId } : {};
    const res = await api.get(`/bookings/${reference}/payment-status`, { params });
    return res.data;
  },

  /**
   * Legacy simulation method.
   */
  async processPayment(paymentData) {
    const res = await api.post('/payments/process', paymentData);
    return res.data;
  },
};

export default paymentService;
