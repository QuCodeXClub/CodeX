import axiosInstance from './axiosInstance';

class FaqService {
  async getFAQs(params = {}) {
    return axiosInstance.get('/faqs', { params });
  }

  async createFAQ(faqData) {
    return axiosInstance.post('/faqs', faqData);
  }

  async updateFAQ(id, faqData) {
    return axiosInstance.patch(`/faqs/${id}`, faqData);
  }

  async deleteFAQ(id) {
    return axiosInstance.delete(`/faqs/${id}`);
  }
}

export const faqService = new FaqService();
export default FaqService;
