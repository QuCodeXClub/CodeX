class CertificateService {
  async generateBulkCertificates(formData) {
    return { data: { message: "Mock certificates generated successfully!" } };
  }

  async verifyCertificate(certificateId) {
    return {
      success: true,
      data: {
        studentName: "Abhiraj Chaubey",
        studentEmail: "abhiraj@example.com",
        eventName: "Q Hackathon 2026",
        eventDate: new Date("2026-08-07").toISOString(),
        coordinatorName: "Jane Smith",
        signatureImage: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Signature_Mock.png",
        certificateId: certificateId || "CERT-12345",
        position: "Winner",
        qrCodeImage: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=MockQR",
        issuedAt: new Date().toISOString(),
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
