class AdminService {
  async loginAdmin(email, password) {
    // MOCKED: Bypass login
    return { success: true, data: { message: "Mock OTP Sent" } };
  }

  async verifyAdminOtp(email, otp) {
    // MOCKED: Bypass OTP
    return { success: true, data: { user: { name: "Admin", email: "admin@codex.com" } } };
  }

  async logoutAdmin() {
    return { success: true };
  }

  async getCurrentAdmin() {
    // MOCKED: Return fake admin user to stay logged in
    return { success: true, data: { name: "Admin", email: "admin@codex.com" } };
  }

  async requestPasswordChange(oldPassword) {
    return { success: true };
  }

  async changeAdminPassword(otp, newPassword) {
    return { success: true };
  }

  async getSessions() {
    return { success: true, data: [] };
  }

  async killSession(sessionId) {
    return { success: true };
  }

  async updateAdminProfile(name, email) {
    return { success: true };
  }

  async updateAdminAvatar(formData) {
    return { success: true };
  }

  async updateProfile(formData) {
    return { success: true };
  }

  async getBlocklist(params = {}) {
    return axiosInstance.get("/admin/blocklist", { params });
  }

  async getBlocklistStats() {
    return axiosInstance.get("/admin/blocklist/stats");
  }

  async addBlockedEmail(data) {
    return axiosInstance.post("/admin/blocklist", data);
  }

  async removeBlockedEmail(id) {
    return axiosInstance.delete(`/admin/blocklist/${id}`);
  }

  async getBackgroundJobs(params = {}) {
    return axiosInstance.get("/admin/jobs", { params });
  }

  async getJobStats() {
    return axiosInstance.get("/admin/jobs/stats");
  }

  async retryJob(id) {
    return axiosInstance.post(`/admin/jobs/${id}/retry`);
  }

  async deleteJob(id) {
    return axiosInstance.delete(`/admin/jobs/${id}`);
  }

  async clearCompletedJobs() {
    return axiosInstance.delete("/admin/jobs/clear-completed");
  }

  async getAnnouncementsHistory(params = {}) {
    return axiosInstance.get("/admin/announcements-history", { params });
  }
}

export const adminService = new AdminService();
export default AdminService;
