import axiosInstance from "./axiosInstance";

class RegistrationService {
  async registerStudent(studentData) {
    return axiosInstance.post("/students/register", studentData);
  }

  async getRegistrations(params = {}) {
    return axiosInstance.get("/registrations", { params });
  }

  async updateRegistrationStatus(id, status, rejectionReason = '') {
    return axiosInstance.patch(`/registrations/${id}/status`, { status, rejectionReason, reason: rejectionReason });
  }

  async addManualRegistration(studentData) {
    return axiosInstance.post("/registrations/manual", studentData);
  }

  async addBulkRegistration(formData) {
    return axiosInstance.post("/registrations/bulk", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

export const registrationService = new RegistrationService();
export default RegistrationService;
