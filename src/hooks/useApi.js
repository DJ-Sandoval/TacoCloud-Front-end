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

    try {
      const response = await fetch(url, config);
      return response;
    } catch (error) {
      console.error('Fetch error:', error);
      throw error;
    }
  };

  // Función específica para endpoints de inventario
  const fetchInventario = async (endpoint = '', options = {}) => {
    // Separar path y query params del endpoint proporcionado
    let [path, queryParams] = endpoint.split('?');
    const query = queryParams ? `?${queryParams}` : '';
    const filters = ['bajo-stock', 'sobre-stock'];

    let url;
    if (!path) {
      // Para listados generales sin path específico
      url = `http://localhost:8085/api/inventario/negocio/${negocioId}${query}`;
    } else if (filters.includes(path)) {
      // Para filtros como bajo-stock o sobre-stock
      url = `http://localhost:8085/api/inventario/negocio/${negocioId}/${path}${query}`;
    } else {
      // Para operaciones por ID (update, delete, ajustar, etc.)
      url = `http://localhost:8085/api/inventario/${path}/negocio/${negocioId}${query}`;
    }
    
    return authenticatedFetch(url, options);
  };

  // Función específica para endpoints de productos
const fetchProductos = async (endpoint = '', options = {}) => {
  let [path, queryParams] = endpoint.split('?');
  const query = queryParams ? `?${queryParams}` : '';

  let url;
  if (!path) {
    url = `http://localhost:8085/api/productos/negocio/${negocioId}${query}`;
  } else {
    url = `http://localhost:8085/api/productos/${path}/negocio/${negocioId}${query}`;
  }
  return authenticatedFetch(url, options);
};

  const fetchClientes = async (endpoint = '', options = {}) => {
  let [path, queryParams] = endpoint.split('?');
  const query = queryParams ? `?${queryParams}` : '';

  let url;
  if (!path) {
    // Para listados generales
    url = `http://localhost:8085/api/clientes/negocio/${negocioId}${query}`;
  } else if (path.startsWith('negocio/')) {
    // Para endpoints que ya incluyen "negocio/" en el path
    url = `http://localhost:8085/api/clientes/${path}${query}`;
  } else {
    // Para operaciones por ID
    url = `http://localhost:8085/api/clientes/${path}/negocio/${negocioId}${query}`;
  }
  return authenticatedFetch(url, options);
};

// En useApi.js, agrega esta función específica:
const fetchTotalClientes = async () => {
  const url = `http://localhost:8085/api/clientes/negocio/${negocioId}/total`;
  return authenticatedFetch(url);
};

const fetchBajoStock = async (page = 0, size = 10) => {
  const url = `http://localhost:8085/api/inventario/negocio/${negocioId}/bajo-stock?page=${page}&size=${size}`;
  return authenticatedFetch(url);
};


  // Función genérica para otros endpoints
  const fetchFromNegocio = async (endpoint, options = {}) => {
    const url = `http://localhost:8085/api/${endpoint}/negocio/${negocioId}`;
    return authenticatedFetch(url, options);
  };

  return {
    authenticatedFetch,
    fetchInventario,
    fetchProductos,
    fetchFromNegocio,
    fetchClientes,
    fetchTotalClientes,
    fetchBajoStock
  };
};