import axiosInstance from "./axiosInstance";

class EventService {
  getEvents() {
    return axiosInstance.get("/events");
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
