import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const { user, logout, negocioId } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    if (isOpen) {
      toggleSidebar();
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isOpen) {
      toggleSidebar();
    }
  };

  const handleAboutClick = () => {
    setShowAboutModal(true);
    if (isOpen) {
      toggleSidebar();
    }
  };

  const menuItems = [
    { name: 'Cajas', icon: 'fas fa-box', path: '/cajas' },
    { name: 'Clientes', icon: 'fas fa-users', path: '/clientes' },
    { name: 'Categorías', icon: 'fas fa-tags', path: '/categorias' },
    { name: 'Productos', icon: 'fas fa-box-open', path: '/productos' },
    { name: 'Compras', icon: 'fas fa-shopping-cart', path: '/compras' },
    { name: 'Pedidos', icon: 'fas fa-receipt', path: '/pedidos' },
    { name: 'Gastos', icon: 'fas fa-money-bill-wave', path: '/gastos' },
    { name: 'Nueva Venta', icon: 'fas fa-cart-plus', path: '/nueva-venta' },
    { name: 'Historial Pedidos', icon: 'fas fa-history', path: '/historial-pedidos' },
    { name: 'Historial Ventas', icon: 'fas fa-chart-line', path: '/historial-ventas' },
    { name: 'Negocio', icon: 'fas fa-store', path: '/negocio' },
    { name: 'Inventario', icon: 'fas fa-warehouse', path: '/inventario' },
    { name: 'Reportes', icon: 'fas fa-file-alt', path: '/reportes' },
    { name: 'Configuraciones', icon: 'fas fa-cog', path: '/configuraciones' },
    { name: 'Acerca de', icon: 'fas fa-info-circle', path: '#', action: handleAboutClick },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleMenuItemClick = (item) => {
    if (item.action) {
      item.action();
    } else {
      handleNavigation(item.path);
    }
  };

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
                  className={`sidebar-menu-link ${isActive(item.path) ? 'active' : ''}`}
                  onClick={() => handleMenuItemClick(item)}
                >
                  <i className={item.icon}></i>
                  <span>{item.name}</span>
                  {isActive(item.path) && <div className="active-indicator"></div>}
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
                  onClick={() => handleNavigation('/configuracion')}
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

      {/* Modal Acerca de */}
      {showAboutModal && (
        <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header" style={{backgroundColor: '#1a3c34', color: 'white'}}>
                <h5 className="modal-title">
                  <i className="fas fa-info-circle me-2"></i>
                  Acerca de
                </h5>
                <button 
                  type="button" 
                  className="btn-close btn-close-white"
                  onClick={() => setShowAboutModal(false)}
                ></button>
              </div>
              <div className="modal-body text-center">
                <div className="mb-4">
                  <i className="fas fa-cloud-meatball" style={{fontSize: '3rem', color: '#1a3c34'}}></i>
                </div>
                <h4 className="mb-3" style={{color: '#1a3c34'}}>TaqueSys Cloud v.25</h4>
                <p className="lead mb-4">Sistema de gestión para taquerías</p>
                
                <div className="border-top pt-3">
                  <h6 className="mb-3">Desarrollado por:</h6>
                  <div className="row">
                    <div className="col-6">
                      <div className="p-3 border rounded">
                        <i className="fas fa-user-tie mb-2" style={{fontSize: '1.5rem', color: '#f4c430'}}></i>
                        <p className="mb-0 fw-bold">Ing. Armando Sandoval</p>
                        <small className="text-muted">Desarrollador</small>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="p-3 border rounded">
                        <i className="fas fa-user-graduate mb-2" style={{fontSize: '1.5rem', color: '#f4c430'}}></i>
                        <p className="mb-0 fw-bold">Ing. Valeria Sofia</p>
                        <small className="text-muted">Desarrolladora</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn" 
                  style={{backgroundColor: '#1a3c34', color: 'white'}}
                  onClick={() => setShowAboutModal(false)}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;