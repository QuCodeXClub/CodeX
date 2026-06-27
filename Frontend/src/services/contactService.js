import axiosInstance from './axiosInstance';

class ContactService {
  async submitContactForm(contactData) {
    return axiosInstance.post('/contact', contactData);
  }

  async getAllContactMessages() {
    return axiosInstance.get('/contact');
  }

  async markAsRead(id) {
    return axiosInstance.patch(`/contact/${id}/read`);
  }

  async deleteMessage(id) {
    return axiosInstance.delete(`/contact/${id}`);
  }
}

export const contactService = new ContactService();
export default ContactService;
