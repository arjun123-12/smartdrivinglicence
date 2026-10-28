import api from './api';

export const packageService = {
  async getPackages() {
    const res = await api.get('/packages');
    return res.data.data;
  },

  async getPackage(idOrSlug) {
    const res = await api.get(`/packages/${idOrSlug}`);
    return res.data.data;
  },

  async submitAssessmentQuiz(quizData) {
    const res = await api.post('/packages/quiz-recommendation', quizData);
    return res.data;
  },
};

export default packageService;

