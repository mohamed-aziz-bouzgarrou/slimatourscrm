// services/authService.js
import api from '../config/axiosconfig'; // Import the custom Axios instance

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// register

export const registerUser = async (data) => {
  try {
    const response = await api.post('/auth/register',data);
    return response.data;
  } catch (error) {
    throw error;
  }
};