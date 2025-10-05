import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [negocioId, setNegocioId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay datos de autenticación en localStorage al cargar la app
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    const storedNegocioId = localStorage.getItem('negocioId');

    if (storedUser && storedToken && storedNegocioId) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      setNegocioId(storedNegocioId);
    }
    setLoading(false);
  }, []);

  const login = (userData, authToken, negocios) => {
    // Seleccionar el primer negocio por defecto (puedes modificar esto para que el usuario elija)
    const selectedNegocioId = negocios.length > 0 ? negocios[0].id : null;
    
    setUser(userData);
    setToken(authToken);
    setNegocioId(selectedNegocioId);

    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
    localStorage.setItem('negocioId', selectedNegocioId);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setNegocioId(null);

    // Limpiar localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('negocioId');
  };

  const value = {
    user,
    token,
    negocioId,
    login,
    logout,
    isAuthenticated: !!user && !!token && !!negocioId,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};