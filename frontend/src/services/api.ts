import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Auth API calls
export const registerUser = async (formData: FormData) => {
  const response = await api.post('/auth/register', formData);
  return response.data;
};

export const loginUser = async (email: string, password: string) => {
  const response = await api.post('/auth/login', { email, password });
  return response.data;
};

export const logoutUser = async () => {
  const response = await api.get('/auth/logout');
  return response.data;
};

// User API calls
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Message API calls
export const getMessages = async (receiverId: string) => {
  const response = await api.get(`/message/get/${receiverId}`);
  return response.data;
};

export const sendMessage = async (receiverId: string, content: string) => {
  const response = await api.post(`/message/create/${receiverId}`, {
    content,
  });
  return response.data;
};

export default api;
