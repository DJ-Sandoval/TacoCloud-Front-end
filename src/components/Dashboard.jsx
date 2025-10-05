import { useState } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import '../styles/Dashboard.css' // Opcional: para estilos adicionales

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, negocioId } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <div className="dashboard-content">
        {/* Header */}
        <header className="dashboard-header">
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <button 
                  className="sidebar-toggle-btn me-3 d-md-none"
                  onClick={toggleSidebar}
                >
                  <i className="fas fa-bars"></i>
                </button>
                <h1 className="dashboard-title mb-0">
                  Bienvenido a TacoCloud
                </h1>
              </div>
              
              <div className="d-flex align-items-center">
                {/* Notifications */}
                <button className="header-btn me-3">
                  <i className="fas fa-bell"></i>
                </button>
                
                {/* User info */}
                <div className="user-badge">
                  <i className="fas fa-user-circle me-2"></i>
                  <span>{user?.username}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="dashboard-main">
          <div className="container-fluid">
            <div className="welcome-section">
              <h2>Hola, {user?.username} 👋</h2>
              <p className="lead">Gestiona tu negocio de tacos de manera eficiente</p>
            </div>
            
            {/* Stats Cards */}
            <div className="row mt-4">
              <div className="col-md-3 mb-4">
                <div className="stat-card">
                  <div className="stat-icon sales">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="stat-info">
                    <h3>$0.00</h3>
                    <p>Ventas Hoy</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-4">
                <div className="stat-card">
                  <div className="stat-icon orders">
                    <i className="fas fa-receipt"></i>
                  </div>
                  <div className="stat-info">
                    <h3>0</h3>
                    <p>Pedidos Activos</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-4">
                <div className="stat-card">
                  <div className="stat-icon customers">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info">
                    <h3>0</h3>
                    <p>Clientes</p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-3 mb-4">
                <div className="stat-card">
                  <div className="stat-icon inventory">
                    <i className="fas fa-boxes"></i>
                  </div>
                  <div className="stat-info">
                    <h3>0</h3>
                    <p>Productos</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="quick-actions">
                  <h4>Acciones Rápidas</h4>
                  <div className="d-flex gap-3 flex-wrap">
                    <button className="quick-action-btn">
                      <i className="fas fa-cart-plus"></i>
                      Nueva Venta
                    </button>
                    <button className="quick-action-btn">
                      <i className="fas fa-users"></i>
                      Agregar Cliente
                    </button>
                    <button className="quick-action-btn">
                      <i className="fas fa-box-open"></i>
                      Agregar Producto
                    </button>
                    <button className="quick-action-btn">
                      <i className="fas fa-file-alt"></i>
                      Ver Reportes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Dashboard