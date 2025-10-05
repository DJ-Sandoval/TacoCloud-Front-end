import { useState } from 'react'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, negocioId } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Main content */}
      <div className="flex-grow-1">
        {/* Navbar superior */}
        <nav className="navbar navbar-light bg-light border-bottom">
          <div className="container-fluid">
            <button 
              className="navbar-toggler d-md-none" 
              type="button"
              onClick={toggleSidebar}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="navbar-brand">
              Bienvenido, {user?.username}
            </div>
            
            <div className="d-flex align-items-center">
              <span className="me-3 text-muted">
                Negocio ID: {negocioId}
              </span>
            </div>
          </div>
        </nav>

        {/* Contenido principal */}
        <main className="p-4">
          <div className="container-fluid">
            <h1>Dashboard Principal</h1>
            <p>Bienvenido al sistema de gestión de TacoCloud</p>
            
            {/* Aquí puedes agregar más componentes del dashboard */}
            <div className="row mt-4">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Ventas Hoy</h5>
                    <p className="card-text">$0.00</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Pedidos Activos</h5>
                    <p className="card-text">0</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Clientes</h5>
                    <p className="card-text">0</p>
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