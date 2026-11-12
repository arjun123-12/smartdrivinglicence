import api from './api';
import { mockPackages } from './mockData';

export const packageService = {
  async getPackages() {
    try {
      const res = await api.get('/packages');
      return res.data.data;
    } catch {
      return mockPackages;
    }
  },

  async getPackage(idOrSlug) {
    try {
      const res = await api.get(`/packages/${idOrSlug}`);
      return res.data.data;
    } catch {
      return mockPackages.find((p) => p.slug === idOrSlug || p.id === Number(idOrSlug)) || mockPackages[0];
    }
  },

  async submitAssessmentQuiz(quizData) {
    try {
      const res = await api.post('/packages/quiz-recommendation', quizData);
      return res.data;
    } catch {
      return {
        status: 'success',
        recommended_package: mockPackages[1],
        confidence_score: 85,
        message: 'Based on your quiz, we recommend the 10-Hour Confidence Builder pack!',
      };
    }
  },
};

export default packageService;
