import axiosInstance from './axiosInstance';

class QRService {
  async generateCustomQR(link) {
    return axiosInstance.post('/qr/generate', { link });
  }

  async getQRHistory() {
    return axiosInstance.get('/qr');
  }

  async deleteCustomQR(id) {
    return axiosInstance.delete(`/qr/${id}`);
  }
}

export const qrService = new QRService();
export default QRService;
