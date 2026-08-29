import axiosInstance from "./axiosInstance";

class EventService {
  getEvents(params = {}) {
    return axiosInstance.get("/events", { params });
  }

  getEventById(id) {
    return axiosInstance.get(`/events/${id}`);
  }

  createEvent(formData) {
    return axiosInstance.post("/events", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  updateEvent(id, formData) {
    return axiosInstance.put(`/events/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }

  deleteEvent(id) {
    return axiosInstance.delete(`/events/${id}`);
  }
}

export const eventService = new EventService();
