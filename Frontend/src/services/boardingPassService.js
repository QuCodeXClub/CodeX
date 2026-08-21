import axiosInstance from "./axiosInstance";

class BoardingPassService {
  async verifyBoardingPass(boardingPassId) {
    return axiosInstance.get(`/boarding-passes/verify/${boardingPassId}`);
  }

  async generateBulkBoardingPasses(data) {
    // Assuming data is sent as JSON (not multipart/form-data) since there's no image upload needed here.
    return axiosInstance.post(`/boarding-passes/generate-bulk`, data);
  }

  async getAllBoardingPasses(params = {}) {
    return axiosInstance.get("/boarding-passes", { params });
  }
}

export const boardingPassService = new BoardingPassService();
export default BoardingPassService;
