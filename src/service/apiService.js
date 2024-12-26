import axios from 'axios';

const apiService = axios.create({
    baseURL: 'http://localhost:8080/api',
});

export const fetchSkillSuggestions = (query) => {
    return apiService.get(`/suggestions?query=${query}`);
  };
  

export const addUserSkill = (userId, skill) => {
    return apiService.post(`/users/${userId}/skills`, skill);
};

export const removeUserSkill = (userId, skillId) => {
    return apiService.delete(`/users/${userId}/skills/${skillId}`);
};

export default apiService;
