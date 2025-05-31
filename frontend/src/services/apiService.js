import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getEventos = async () => {
  const response = await axios.get(`${API_URL}/eventos`);
  return response.data;
};

export const addEvento = async (evento) => {
  const response = await axios.post(`${API_URL}/eventos`, evento);
  return response.data;
};

export const updateEvento = async (id, evento) => {
  const response = await axios.put(`${API_URL}/eventos/${id}`, evento);
  return response.data;
};

export const deleteEvento = async (id) => {
  await axios.delete(`${API_URL}/eventos/${id}`);
};

export const eliminarSuscripcionesDeUsuarios = async (eventoId) => {
  // Implementa esta función según la nueva API
};