class CertificateService {
  async generateBulkCertificates(formData) {
    return { data: { message: "Mock certificates generated successfully!" } };
  }

  async verifyCertificate(certificateId) {
    return {
      success: true,
      data: {
        studentName: "Abhiraj Chaubey",
        eventName: "Q Hackathon 2026",
        position: "Winner",
        certificateId: certificateId || "CERT-12345",
        issuedAt: new Date().toISOString(),
        qrCodeImage: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MockQR",
        signatureImage: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Signature_Mock.png",
        coordinatorName: "Jane Smith",
        academicYear: "2025-26"
      }
    };
  }

  async getLatestSignature() {
    return {
      data: {
        url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Signature_Mock.png",
        uploadedBy: "Admin",
        createdAt: new Date().toISOString()
      }
    };
  }

  async getAllCertificates(params = {}) {
    return axiosInstance.get("/certificates", { params });
  }
}

export const certificateService = new CertificateService();
export default CertificateService;
