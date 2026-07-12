import axiosInstance from "./axiosInstance";

class RegistrationService {
  async registerStudent(studentData) {
    return axiosInstance.post("/students/register", studentData);
  }

  async getRegistrations(params = {}) {
    return axiosInstance.get("/registrations", { params });
  }

  async updateRegistrationStatus(id, status) {
    return axiosInstance.patch(`/registrations/${id}/status`, { status });
  }

  async addManualRegistration(studentData) {
    return axiosInstance.post("/registrations/manual", studentData);
  }
}

export const registrationService = new RegistrationService();
export default RegistrationService;
