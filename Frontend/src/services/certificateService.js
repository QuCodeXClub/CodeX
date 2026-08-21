import axiosInstance from "./axiosInstance";

class CertificateService {
  async generateBulkCertificates(formData) {
    return axiosInstance.post("/certificates/generate-bulk", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  }

  async verifyCertificate(certificateId) {
    return axiosInstance.get(`/certificates/verify/${certificateId}`);
  }

  async getLatestSignature() {
    return axiosInstance.get("/certificates/latest-signature");
  }

  async getAllCertificates(params = {}) {
    return axiosInstance.get("/certificates", { params });
  }
}

export const certificateService = new CertificateService();
export default CertificateService;
