import api from './api';

export const paymentService = {
  async processPayment(paymentData) {
    const res = await api.post('/payments/process', paymentData);
    return res.data;
  },
};

export default paymentService;

