import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../hooks/useApi'
import Sidebar from './Sidebar'
import ClienteModal from '../modal/ClienteModal'
import ClienteViewModal from '../modal/ClienteViewModal'
import ClienteEditModal from '../modal/ClienteEditModal'
import '../styles/Clientes.css'

const Clientes = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [clientes, setClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCliente, setSelectedCliente] = useState(null)
  const { user, negocioId } = useAuth()
  const { fetchFromNegocio } = useApi()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

 const fetchClientes = async () => {
  try {
    setLoading(true)
    const response = await fetch(`http://localhost:8085/api/clientes/negocio/${negocioId}?page=0&size=100`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      setClientes(data.content || [])
    } else {
      console.error('Error al cargar clientes')
      alert('Error al cargar la lista de clientes')
    }
  } catch (error) {
    console.error('Error:', error)
    alert('Error de conexión al cargar clientes')
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchClientes()
  }, [negocioId])

  const handleNuevoCliente = () => {
    setSelectedCliente(null)
    setShowEditModal(true)
  }

  const handleVerCliente = (cliente) => {
    setSelectedCliente(cliente)
    setShowViewModal(true)
  }

  const handleEditarCliente = (cliente) => {
    setSelectedCliente(cliente)
    setShowEditModal(true)
  }

  const handleEliminarCliente = async (cliente) => {
  if (window.confirm(`¿Estás seguro de eliminar al cliente ${cliente.nombre}?`)) {
    try {
      const response = await fetch(`http://localhost:8085/api/clientes/${cliente.id}/negocio/${negocioId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const result = await response.json()
        fetchClientes() // Recargar la lista
        alert(result.message || 'Cliente eliminado correctamente')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error al eliminar el cliente')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al eliminar el cliente')
    }
  }
}

  const exportToPDF = () => {
    alert('Exportando a PDF...')
    // Implementar lógica de exportación a PDF
  }

  const exportToExcel = () => {
    alert('Exportando a Excel...')
    // Implementar lógica de exportación a Excel
  }

  return (
    <div className="dashboard-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="dashboard-content">
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
                  Lista de Clientes
                </h1>
              </div>
              
              <div className="d-flex align-items-center">
                <button className="header-btn me-3">
                  <i className="fas fa-bell"></i>
                </button>
                
                <div className="user-badge">
                  <i className="fas fa-user-circle me-2"></i>
                  <span>{user?.username}</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="dashboard-main">
          <div className="container-fluid">
            {/* Header de acciones */}
            <div className="clientes-header">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h2>Gestión de Clientes</h2>
                  <p className="text-muted mb-0">Administra los clientes de tu negocio</p>
                </div>
                <div className="col-md-6 text-end">
                  <div className="btn-group me-2">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleNuevoCliente}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Nuevo Cliente
                    </button>
                  </div>
                  
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-outline-secondary dropdown-toggle"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="fas fa-download me-2"></i>
                      Exportar
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button className="dropdown-item" onClick={exportToPDF}>
                          <i className="fas fa-file-pdf me-2 text-danger"></i>
                          PDF
                        </button>
                      </li>
                      <li>
                        <button className="dropdown-item" onClick={exportToExcel}>
                          <i className="fas fa-file-excel me-2 text-success"></i>
                          Excel
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabla de clientes */}
            <div className="card mt-4">
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando clientes...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Teléfono</th>
                          <th>Email</th>
                          <th>Dirección</th>
                          <th>Frecuente</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {clientes.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              <i className="fas fa-users fa-2x text-muted mb-3"></i>
                              <p>No hay clientes registrados</p>
                              <button 
                                className="btn btn-primary"
                                onClick={handleNuevoCliente}
                              >
                                <i className="fas fa-plus me-2"></i>
                                Agregar Primer Cliente
                              </button>
                            </td>
                          </tr>
                        ) : (
                          clientes.map((cliente) => (
                            <tr key={cliente.id}>
                              <td>{cliente.id}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="avatar-circle me-3">
                                    {cliente.nombre ? cliente.nombre.charAt(0).toUpperCase() : 'C'}
                                  </div>
                                  {cliente.nombre || 'Sin nombre'}
                                </div>
                              </td>
                              <td>{cliente.telefono || '-'}</td>
                              <td>{cliente.email || '-'}</td>
                              <td>{cliente.direccion || '-'}</td>
                              <td>
                                <span className={`badge ${cliente.frecuente ? 'bg-success' : 'bg-secondary'}`}>
                                  {cliente.frecuente ? 'Sí' : 'No'}
                                </span>
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  <button
                                    className="btn btn-sm btn-outline-info"
                                    onClick={() => handleVerCliente(cliente)}
                                    title="Ver detalles"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => handleEditarCliente(cliente)}
                                    title="Editar"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleEliminarCliente(cliente)}
                                    title="Eliminar"
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>

        {/* Modal para visualizar cliente */}
        <ClienteViewModal 
          show={showViewModal}
          onClose={() => setShowViewModal(false)}
          cliente={selectedCliente}
        />

        {/* Modal para crear/editar cliente */}
        <ClienteEditModal 
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          cliente={selectedCliente}
          onSave={fetchClientes}
        />
      </div>
    </div>
  )
}

export default Clientes