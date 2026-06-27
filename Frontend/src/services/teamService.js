import axiosInstance from './axiosInstance';

class TeamService {
  async getTeamMembers(params = {}) {
    return axiosInstance.get('/teams', { params });
  }

  async addTeamMember(formData) {
    return axiosInstance.post('/teams', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }

  async deleteTeamMember(id) {
    return axiosInstance.delete(`/teams/${id}`);
  }

  async updateTeamMember(id, formData) {
    return axiosInstance.patch(`/teams/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
}

export const teamService = new TeamService();
export default TeamService;
