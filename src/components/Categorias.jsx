import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import CategoriaEditModal from '../modal/CategoriaEditModal'
import CategoriaViewModal from '../modal/CategoriaViewModal'
import '../styles/Categorias.css'

const Categorias = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedCategoria, setSelectedCategoria] = useState(null)
  const { user, negocioId } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const fetchCategorias = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8085/api/categorias/negocio/${negocioId}?page=0&size=100`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCategorias(data.content || [])
      } else {
        console.error('Error al cargar categorías')
        alert('Error al cargar la lista de categorías')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión al cargar categorías')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategorias()
  }, [negocioId])

  const handleNuevaCategoria = () => {
    setSelectedCategoria(null)
    setShowEditModal(true)
  }

  const handleVerCategoria = (categoria) => {
    setSelectedCategoria(categoria)
    setShowViewModal(true)
  }

  const handleEditarCategoria = (categoria) => {
    setSelectedCategoria(categoria)
    setShowEditModal(true)
  }

  const handleEliminarCategoria = async (categoria) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoria.nombre}"?`)) {
      try {
        const response = await fetch(`http://localhost:8085/api/categorias/${categoria.id}/negocio/${negocioId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          fetchCategorias()
          alert('Categoría eliminada correctamente')
        } else {
          const errorData = await response.json()
          alert(errorData.message || 'Error al eliminar la categoría')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al eliminar la categoría')
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
                  Gestión de Categorías
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
            <div className="categorias-header">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h2>Gestión de Categorías</h2>
                  <p className="text-muted mb-0">Organiza tus productos por categorías</p>
                </div>
                <div className="col-md-6 text-end">
                  <div className="btn-group me-2">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleNuevaCategoria}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Nueva Categoría
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

            {/* Tabla de categorías */}
            <div className="card mt-4">
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando categorías...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Descripción</th>
                          <th>Productos</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {categorias.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="text-center py-4">
                              <i className="fas fa-tags fa-2x text-muted mb-3"></i>
                              <p>No hay categorías registradas</p>
                              <button 
                                className="btn btn-primary"
                                onClick={handleNuevaCategoria}
                              >
                                <i className="fas fa-plus me-2"></i>
                                Crear Primera Categoría
                              </button>
                            </td>
                          </tr>
                        ) : (
                          categorias.map((categoria) => (
                            <tr key={categoria.id}>
                              <td>{categoria.id}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="categoria-icon me-3">
                                    <i className="fas fa-tag"></i>
                                  </div>
                                  <strong>{categoria.nombre}</strong>
                                </div>
                              </td>
                              <td>
                                {categoria.descripcion || (
                                  <span className="text-muted">Sin descripción</span>
                                )}
                              </td>
                              <td>
                                <span className="badge bg-primary">
                                  {categoria.productos?.length || 0} productos
                                </span>
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  <button
                                    className="btn btn-sm btn-outline-info"
                                    onClick={() => handleVerCategoria(categoria)}
                                    title="Ver detalles"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => handleEditarCategoria(categoria)}
                                    title="Editar"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleEliminarCategoria(categoria)}
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

        {/* Modal para visualizar categoría */}
        <CategoriaViewModal 
          show={showViewModal}
          onClose={() => setShowViewModal(false)}
          categoria={selectedCategoria}
        />

        {/* Modal para crear/editar categoría */}
        <CategoriaEditModal 
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          categoria={selectedCategoria}
          onSave={fetchCategorias}
        />
      </div>
    </div>
  )
}

export default Categorias