import axiosInstance from './axiosInstance';

class CertificateService {
  async generateBulkCertificates(formData) {
    return axiosInstance.post('/certificates/generate-bulk', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async verifyCertificate(certificateId) {
    return axiosInstance.get(`/certificates/verify/${certificateId}`);
  }
}

export const certificateService = new CertificateService();
export default CertificateService;
