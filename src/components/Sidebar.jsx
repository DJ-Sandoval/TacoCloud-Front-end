import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css'; // Crearemos este archivo CSS

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
    { name: 'Cajas', icon: 'fas fa-box' },
    { name: 'Clientes', icon: 'fas fa-users' },
    { name: 'Categorías', icon: 'fas fa-tags' },
    { name: 'Productos', icon: 'fas fa-box-open' },
    { name: 'Compras', icon: 'fas fa-shopping-cart' },
    { name: 'Pedidos', icon: 'fas fa-receipt' },
    { name: 'Gastos', icon: 'fas fa-money-bill-wave' },
    { name: 'Nueva Venta', icon: 'fas fa-cart-plus' },
    { name: 'Historial Pedidos', icon: 'fas fa-history' },
    { name: 'Historial Ventas', icon: 'fas fa-chart-line' },
    { name: 'Negocio', icon: 'fas fa-store' },
    { name: 'Inventario', icon: 'fas fa-warehouse' },
    { name: 'Reportes', icon: 'fas fa-file-alt' },
    { name: 'Configuraciones', icon: 'fas fa-cog' },
  ];

  return (
    <>
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="sidebar-overlay"
          onClick={toggleSidebar}
        />
      )}
      
      <div
        className={`sidebar ${isOpen ? 'sidebar-open' : 'sidebar-closed'}`}
      >
        {/* Brand Section */}
        <div className="sidebar-brand">
          <i className="fas fa-cloud-meatball"></i>
          <span>TacoCloud</span>
          <button
            className="sidebar-close-btn d-md-none"
            onClick={toggleSidebar}
            aria-label="Close sidebar"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Negocio Info */}
        <div className="negocio-info">
          <div className="negocio-id">
            <i className="fas fa-store me-2"></i>
            Negocio ID: {negocioId}
          </div>
          <div className="user-welcome">
            <i className="fas fa-user me-2"></i>
            Hola, {user?.username}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="sidebar-nav">
          <ul className="sidebar-menu">
            {menuItems.map((item, index) => (
              <li key={index} className="sidebar-menu-item">
                <button
                  className="sidebar-menu-link"
                  onClick={() => {
                    console.log(`Navegar a: ${item.name}`);
                    if (isOpen) {
                      toggleSidebar();
                    }
                  }}
                >
                  <i className={item.icon}></i>
                  <span>{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Section */}
        <div className="sidebar-user-section">
          <div className="user-dropdown">
            <button
              onClick={toggleDropdown}
              className="user-dropdown-btn"
            >
              <div className="user-avatar">
                <i className="fas fa-user-circle"></i>
              </div>
              <div className="user-info">
                <div className="user-name">{user?.username}</div>
                <div className="user-role">Administrador</div>
              </div>
              <i className={`dropdown-arrow ${isDropdownOpen ? 'rotated' : ''}`}>
                <i className="fas fa-chevron-down"></i>
              </i>
            </button>
            
            {isDropdownOpen && (
              <div className="user-dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    console.log('Ir a configuración');
                    if (isOpen) {
                      toggleSidebar();
                    }
                  }}
                >
                  <i className="fas fa-cog me-2"></i>
                  Configuración
                </button>
                <button
                  className="dropdown-item logout-item"
                  onClick={handleLogout}
                >
                  <i className="fas fa-sign-out-alt me-2"></i>
                  Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;