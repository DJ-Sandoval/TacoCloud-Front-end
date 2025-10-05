import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout, negocioId } = useAuth();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    if (isOpen) {
      toggleSidebar();
    }
  };

  const menuItems = [
    'Cajas',
    'Clientes',
    'Categorías',
    'Productos',
    'Compras',
    'Pedidos',
    'Gastos',
    'Nueva Venta',
    'Historial Pedidos',
    'Historial Ventas',
    'Negocio',
    'Inventario',
    'Reportes',
    'Configuraciones',
  ];

  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
    >
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold">TacoCloud</h2>
        <button
          className="md:hidden"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
      
      {/* Información del negocio */}
      <div className="p-4 bg-gray-100 border-b">
        <p className="text-sm text-gray-600">Negocio ID: {negocioId}</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item, index) => (
            <li key={index}>
              <button
                className="w-full text-left p-2 rounded hover:bg-gray-200 transition-colors duration-200"
                onClick={() => {
                  // Aquí puedes agregar la lógica para navegar a cada sección
                  console.log(`Navegar a: ${item}`);
                  if (isOpen) {
                    toggleSidebar();
                  }
                }}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full p-4 border-t">
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="w-full text-left p-2 rounded hover:bg-gray-200 flex items-center justify-between transition-colors duration-200"
          >
            <span className="flex items-center">
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5.121 17.804A4 4 0 018 16h8a4 4 0 012.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {user?.username}
            </span>
            <svg
              className={`w-4 h-4 transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
          {isDropdownOpen && (
            <div className="mt-2 bg-white shadow-lg rounded border">
              <button
                className="block w-full text-left p-2 hover:bg-gray-200 transition-colors duration-200"
                onClick={() => {
                  // Navegar a configuración
                  if (isOpen) {
                    toggleSidebar();
                  }
                }}
              >
                Configuración
              </button>
              <button
                className="block w-full text-left p-2 hover:bg-gray-200 text-red-600 transition-colors duration-200"
                onClick={handleLogout}
              >
                Cerrar Sesión
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;