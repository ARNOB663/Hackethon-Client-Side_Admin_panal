import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Panel Auth
export const adminLogin = async (email: string, password: string) => {
  const response = await api.post('/panel/login', { email, password });
  return response.data;
};

export const adminRegister = async (email: string, password: string) => {
  const response = await api.post('/panel/register', { email, password });
  return response.data;
};

// Farmers
export const getFarmers = async () => {
  const response = await api.get('/panel/farmers');
  return response.data;
};

export const getFarmer = async (id: string) => {
  const response = await api.get(`/panel/farmers/${id}`);
  return response.data;
};

export const deleteFarmer = async (id: string) => {
  const response = await api.delete(`/panel/farmers/${id}`);
  return response.data;
};

export const suspendFarmer = async (id: string) => {
  const response = await api.patch(`/panel/farmers/${id}/suspend`);
  return response.data;
};

export const unsuspendFarmer = async (id: string) => {
  const response = await api.patch(`/panel/farmers/${id}/unsuspend`);
  return response.data;
};

// Crop Batches
export const getCropBatches = async () => {
  const response = await api.get('/panel/crops');
  return response.data;
};

export const getCropBatch = async (id: string) => {
  const response = await api.get(`/panel/crops/${id}`);
  return response.data;
};

export const getCropBatchesByFarmer = async (farmerId: string) => {
  const response = await api.get(`/panel/crops/farmer/${farmerId}`);
  return response.data;
};

export const updateCropBatch = async (id: string, data: {
  cropType?: string;
  estimatedWeightKg?: number;
  storageType?: string;
  notes?: string;
}) => {
  const response = await api.patch(`/panel/crops/${id}`, data);
  return response.data;
};

export const deleteCropBatch = async (id: string) => {
  const response = await api.delete(`/panel/crops/${id}`);
  return response.data;
};

export default api;
