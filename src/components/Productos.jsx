
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'
import ProductoEditModal from '../modal/ProductoEditModal'
import ProductoViewModal from '../modal/ProductoViewModal'
import '../styles/Productos.css'

const Productos = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [productos, setProductos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState(null)
  const { user, negocioId } = useAuth()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const fetchProductos = async () => {
    if (!negocioId) {
      console.error('negocioId es null o undefined')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8085/api/productos/negocio/${negocioId}?page=0&size=100`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setProductos(data.content || [])
      } else {
        console.error('Error al cargar productos')
        alert('Error al cargar la lista de productos')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error de conexión al cargar productos')
    } finally {
      setLoading(false)
    }
  }

  const fetchCategorias = async () => {
    if (!negocioId) return

    try {
      const response = await fetch(`http://localhost:8085/api/categorias/negocio/${negocioId}?page=0&size=100`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setCategorias(data.content || [])
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    }
  }

  useEffect(() => {
    if (negocioId) {
      fetchProductos()
      fetchCategorias()
    }
  }, [negocioId])

  const handleNuevoProducto = () => {
    if (!negocioId) {
      alert('Error: No se pudo identificar el negocio. Por favor, inicie sesión nuevamente.')
      return
    }
    setSelectedProducto(null)
    setShowEditModal(true)
  }

  const handleVerProducto = (producto) => {
    setSelectedProducto(producto)
    setShowViewModal(true)
  }

  const handleEditarProducto = (producto) => {
    if (!negocioId) {
      alert('Error: No se pudo identificar el negocio. Por favor, inicie sesión nuevamente.')
      return
    }
    setSelectedProducto(producto)
    setShowEditModal(true)
  }

  const handleEliminarProducto = async (producto) => {
    if (!negocioId) {
      alert('Error: No se pudo identificar el negocio. Por favor, inicie sesión nuevamente.')
      return
    }

    if (window.confirm(`¿Estás seguro de eliminar el producto "${producto.nombre}"?`)) {
      try {
        const response = await fetch(`http://localhost:8085/api/productos/${producto.id}/negocio/${negocioId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        })
        
        if (response.ok) {
          fetchProductos()
          alert('Producto eliminado correctamente')
        } else {
          const errorData = await response.json()
          alert(errorData.message || 'Error al eliminar el producto')
        }
      } catch (error) {
        console.error('Error:', error)
        alert('Error al eliminar el producto')
      }
    }
  }

  const exportToPDF = () => {
    alert('Exportando a PDF...')
  }

  const exportToExcel = () => {
    alert('Exportando a Excel...')
  }

  const calcularMargen = (precio, costo) => {
    return ((precio - costo) / costo * 100).toFixed(2)
  }

  if (!negocioId) {
    return (
      <div className="dashboard-container">
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        <div className="dashboard-content">
          <div className="container-fluid mt-5">
            <div className="alert alert-danger text-center">
              <h4>Error de Configuración</h4>
              <p>No se pudo identificar el negocio. Por favor, cierre sesión y vuelva a iniciar.</p>
            </div>
          </div>
        </div>
      </div>
    )
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
                  Gestión de Productos
                </h1>
              </div>
              
              <div className="d-flex align-items-center">
                <div className="user-badge me-3">
                  <i className="fas fa-store me-2"></i>
                  Negocio: {negocioId}
                </div>
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
            <div className="productos-header">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h2>Gestión de Productos</h2>
                  <p className="text-muted mb-0">Administra el inventario de productos</p>
                </div>
                <div className="col-md-6 text-end">
                  <div className="btn-group me-2">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={handleNuevoProducto}
                    >
                      <i className="fas fa-plus me-2"></i>
                      Nuevo Producto
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

            {/* Tabla de productos */}
            <div className="card mt-4">
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando productos...</p>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th>Costo</th>
                          <th>Margen</th>
                          <th>Categorías</th>
                          <th>Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productos.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              <i className="fas fa-box-open fa-2x text-muted mb-3"></i>
                              <p>No hay productos registrados</p>
                              <button 
                                className="btn btn-primary"
                                onClick={handleNuevoProducto}
                              >
                                <i className="fas fa-plus me-2"></i>
                                Agregar Primer Producto
                              </button>
                            </td>
                          </tr>
                        ) : (
                          productos.map((producto) => (
                            <tr key={producto.id}>
                              <td>{producto.id}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="producto-icon me-3">
                                    <i className="fas fa-box"></i>
                                  </div>
                                  <strong>{producto.nombre}</strong>
                                </div>
                              </td>
                              <td>
                                <span className="fw-bold text-success">
                                  ${producto.precioUnitario.toFixed(2)}
                                </span>
                              </td>
                              <td>
                                <span className="text-muted">
                                  ${producto.costo.toFixed(2)}
                                </span>
                              </td>
                              <td>
                                <span className={`badge ${calcularMargen(producto.precioUnitario, producto.costo) > 50 ? 'bg-success' : 'bg-warning'}`}>
                                  {calcularMargen(producto.precioUnitario, producto.costo)}%
                                </span>
                              </td>
                              <td>
                                {producto.categorias && producto.categorias.length > 0 ? (
                                  <div className="d-flex flex-wrap gap-1">
                                    {producto.categorias.slice(0, 2).map((categoria) => (
                                      <span key={categoria.id} className="badge bg-info">
                                        {categoria.nombre}
                                      </span>
                                    ))}
                                    {producto.categorias.length > 2 && (
                                      <span className="badge bg-secondary">
                                        +{producto.categorias.length - 2}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-muted">Sin categorías</span>
                                )}
                              </td>
                              <td>
                                <div className="btn-group" role="group">
                                  <button
                                    className="btn btn-sm btn-outline-info"
                                    onClick={() => handleVerProducto(producto)}
                                    title="Ver detalles"
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-warning"
                                    onClick={() => handleEditarProducto(producto)}
                                    title="Editar"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleEliminarProducto(producto)}
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

        {/* Modal para visualizar producto */}
        <ProductoViewModal 
          show={showViewModal}
          onClose={() => setShowViewModal(false)}
          producto={selectedProducto}
        />

        {/* Modal para crear/editar producto */}
        <ProductoEditModal 
          show={showEditModal}
          onClose={() => setShowEditModal(false)}
          producto={selectedProducto}
          categorias={categorias}
          onSave={fetchProductos}
        />
      </div>
    </div>
  )
}

export default Productos