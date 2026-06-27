import axiosInstance from './axiosInstance';

class EventService {
  async getEvents() {
    return axiosInstance.get('/events');
  }

  async createEvent(formData) {
    return axiosInstance.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteEvent(id) {
    return axiosInstance.delete(`/events/${id}`);
  }
}

export const eventService = new EventService();
export default EventService;
