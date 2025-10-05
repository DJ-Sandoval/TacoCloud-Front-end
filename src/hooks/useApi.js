import { useAuth } from '../context/AuthContext';

export const useApi = () => {
  const { token, negocioId } = useAuth();

  const authenticatedFetch = async (url, options = {}) => {
    const config = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    // Agregar el token de autenticación si existe
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, config);
    return response;
  };

  // Función específica para endpoints que requieren negocioId
  const fetchFromNegocio = async (endpoint, options = {}) => {
    const url = `http://localhost:8085/api/${endpoint}/negocio/${negocioId}`;
    return authenticatedFetch(url, options);
  };

  return {
    authenticatedFetch,
    fetchFromNegocio
  };
};