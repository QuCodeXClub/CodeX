import axiosInstance from './axiosInstance';

class AdminService {
  async loginAdmin(email, password) {
    return axiosInstance.post('/admin/login', { email, password });
  }

  async verifyAdminOtp(email, otp) {
    return axiosInstance.post('/admin/verify-otp', { email, otp });
  }

  async logoutAdmin() {
    return axiosInstance.post('/admin/logout');
  }

  async getCurrentAdmin() {
    return axiosInstance.get('/admin/current');
  }

  async changeAdminPassword(oldPassword, newPassword) {
    return axiosInstance.post('/admin/change-password', { oldPassword, newPassword });
  }

  async getSessions() {
    return axiosInstance.get('/admin/sessions');
  }

  async killSession(sessionId) {
    return axiosInstance.delete(`/admin/sessions/${sessionId}`);
  }

  async updateAdminProfile(name, email) {
    return axiosInstance.patch('/admin/update-profile', { name, email });
  }

  async updateAdminAvatar(formData) {
    return axiosInstance.patch('/admin/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export const adminService = new AdminService();
export default AdminService;
