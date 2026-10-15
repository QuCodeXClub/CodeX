import axiosInstance from "./axiosInstance";

class CertificateService {
  async generateBulkCertificates(formData) {
    return axiosInstance.post("/certificates/generate-bulk", formData);
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

  async getCertificateBatches(params = {}) {
    return axiosInstance.get("/certificates/batches", { params });
  }

  async getCertificateBatchById(id) {
    return axiosInstance.get(`/certificates/batches/${id}`);
  }

  async updateCertificateBatch(id, data) {
    return axiosInstance.put(`/certificates/batches/${id}`, data);
  }

  async approveCertificateBatch(id) {
    return axiosInstance.patch(`/certificates/batches/${id}/approve`);
  }

  async rejectCertificateBatch(id, reason = "") {
    return axiosInstance.patch(`/certificates/batches/${id}/reject`, { reason });
  }

  async deleteCertificate(id) {
    return axiosInstance.delete(`/certificates/${id}`);
  }

  async resendCertificateEmail(id) {
    return axiosInstance.post(`/certificates/${id}/resend`);
  }

  async exportBatchCertificates(batchId) {
    return axiosInstance.get(`/certificates/batches/${batchId}/export`, {
      responseType: "blob",
    });
  }

  async exportAllCertificates(params = {}) {
    return axiosInstance.get('/certificates/export', {
      params,
      responseType: "blob",
    });
  }
}

export const certificateService = new CertificateService();
export default CertificateService;
