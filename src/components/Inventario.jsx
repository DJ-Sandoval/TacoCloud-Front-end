import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import InventarioModal from '../modal/InventarioModal';
import AjustarStockModal from '../modal/AjustarStockModal';
import DetalleInventarioModal from '../modal/DetalleInventarioModal';
import '../styles/Inventario.css';

const Inventario = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [inventario, setInventario] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('todos');
  
  // Estados para modals
  const [showInventarioModal, setShowInventarioModal] = useState(false);
  const [showAjustarModal, setShowAjustarModal] = useState(false);
  const [showDetalleModal, setShowDetalleModal] = useState(false);
  const [selectedInventario, setSelectedInventario] = useState(null);

  const { fetchInventario } = useApi();
  const { negocioId } = useAuth();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const loadInventario = async (page = 0) => {
    try {
      setLoading(true);
      let endpoint = '';
      
      if (filterType === 'bajo-stock') {
        endpoint = 'bajo-stock';
      } else if (filterType === 'sobre-stock') {
        endpoint = 'sobre-stock';
      }

      // Construir URL con parámetros de paginación
      const url = endpoint ? 
        `${endpoint}?page=${page}&size=10` : 
        `?page=${page}&size=10`;

      const response = await fetchInventario(url);
      
      if (!response.ok) {
        throw new Error('Error al cargar el inventario');
      }
      
      const data = await response.json();
      setInventario(data.content);
      setTotalPages(data.totalPages);
      setCurrentPage(data.number);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventario();
  }, [filterType]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredInventario = inventario.filter(item =>
    item.productoNombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStockStatus = (item) => {
    if (item.cantidad <= item.cantidadMinima) {
      return 'bajo-stock';
    } else if (item.cantidad >= item.cantidadMaxima) {
      return 'sobre-stock';
    }
    return 'normal';
  };

  const getStockStatusText = (item) => {
    const status = getStockStatus(item);
    switch (status) {
      case 'bajo-stock':
        return 'Stock Bajo';
      case 'sobre-stock':
        return 'Sobre Stock';
      default:
        return 'Stock Normal';
    }
  };

  const getStockStatusClass = (item) => {
    const status = getStockStatus(item);
    switch (status) {
      case 'bajo-stock':
        return 'stock-bajo';
      case 'sobre-stock':
        return 'stock-sobre';
      default:
        return 'stock-normal';
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      loadInventario(newPage);
    }
  };

  const handleCreateInventario = async (inventarioData) => {
    try {
      const response = await fetchInventario('', {
        method: 'POST',
        body: JSON.stringify(inventarioData)
      });

      if (!response.ok) {
        throw new Error('Error al crear el registro de inventario');
      }

      await loadInventario(currentPage);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleUpdateInventario = async (inventarioData) => {
    try {
      const response = await fetchInventario(`${selectedInventario.id}`, {
        method: 'PUT',
        body: JSON.stringify(inventarioData)
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el registro de inventario');
      }

      await loadInventario(currentPage);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleAjustarStock = async (cantidad, motivo) => {
    try {
      const response = await fetchInventario(`${selectedInventario.id}/ajustar?cantidad=${cantidad}`, {
        method: 'PATCH'
      });

      if (!response.ok) {
        throw new Error('Error al ajustar el stock');
      }

      await loadInventario(currentPage);
    } catch (err) {
      throw new Error(err.message);
    }
  };

  const handleDeleteInventario = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de inventario?')) {
      try {
        const response = await fetchInventario(`${id}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Error al eliminar el registro de inventario');
        }

        await loadInventario(currentPage);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading && inventario.length === 0) {
    return (
      <div className="inventario-container">
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inventario-container">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="inventario-content">
        <header className="inventario-header">
          <div className="container-fluid">
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center">
                <button 
                  className="sidebar-toggle-btn me-3 d-md-none"
                  onClick={toggleSidebar}
                >
                  <i className="fas fa-bars"></i>
                </button>
                <h1 className="inventario-title mb-0">
                  <i className="fas fa-warehouse me-2"></i>
                  Gestión de Inventario
                </h1>
              </div>
              
              <div className="d-flex align-items-center">
                <button className="header-btn me-3">
                  <i className="fas fa-bell"></i>
                </button>
                
                <div className="user-badge">
                  <i className="fas fa-user-circle me-2"></i>
                  <span>Usuario</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="inventario-main">
          <div className="container-fluid">
            {/* Filtros y Búsqueda */}
            <div className="row mb-4">
              <div className="col-md-6">
                <div className="search-box">
                  <i className="fas fa-search search-icon"></i>
                  <input
                    type="text"
                    className="search-input"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="d-flex gap-3 justify-content-end">
                  <select 
                    className="form-select filter-select"
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <option value="todos">Todos los productos</option>
                    <option value="bajo-stock">Stock Bajo</option>
                    <option value="sobre-stock">Sobre Stock</option>
                  </select>
                  
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      setSelectedInventario(null);
                      setShowInventarioModal(true);
                    }}
                  >
                    <i className="fas fa-plus me-2"></i>
                    Nuevo Registro
                  </button>
                </div>
              </div>
            </div>

            {/* Alertas de Error */}
            {error && (
              <div className="alert alert-danger alert-dismissible fade show" role="alert">
                <i className="fas fa-exclamation-triangle me-2"></i>
                {error}
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setError('')}
                ></button>
              </div>
            )}

            {/* Tabla de Inventario */}
            <div className="card">
              <div className="card-body">
                {filteredInventario.length === 0 ? (
                  <div className="text-center py-5">
                    <i className="fas fa-box-open fa-3x text-muted mb-3"></i>
                    <h5>No se encontraron registros de inventario</h5>
                    <p className="text-muted">
                      {filterType !== 'todos' 
                        ? `No hay productos con ${filterType.replace('-', ' ')}`
                        : 'No hay productos en el inventario'
                      }
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Producto</th>
                            <th>Stock Actual</th>
                            <th>Mínimo</th>
                            <th>Máximo</th>
                            <th>Estado</th>
                            <th>Última Actualización</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredInventario.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <div className="product-avatar me-3">
                                    <i className="fas fa-box"></i>
                                  </div>
                                  <div>
                                    <div className="fw-bold">{item.productoNombre}</div>
                                    <small className="text-muted">ID: {item.productoId}</small>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <span className="fw-bold fs-5">{item.cantidad}</span>
                              </td>
                              <td>
                                <span className="text-muted">{item.cantidadMinima}</span>
                              </td>
                              <td>
                                <span className="text-muted">{item.cantidadMaxima}</span>
                              </td>
                              <td>
                                <span className={`badge ${getStockStatusClass(item)}`}>
                                  {getStockStatusText(item)}
                                </span>
                              </td>
                              <td>
                                <small className="text-muted">
                                  {new Date(item.updatedAt).toLocaleDateString()}
                                </small>
                              </td>
                              <td>
                                <div className="btn-group">
                                  <button 
                                    className="btn btn-sm btn-outline-primary"
                                    title="Ajustar stock"
                                    onClick={() => {
                                      setSelectedInventario(item);
                                      setShowAjustarModal(true);
                                    }}
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-info"
                                    title="Ver detalles"
                                    onClick={() => {
                                      setSelectedInventario(item);
                                      setShowDetalleModal(true);
                                    }}
                                  >
                                    <i className="fas fa-eye"></i>
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    title="Eliminar"
                                    onClick={() => handleDeleteInventario(item.id)}
                                  >
                                    <i className="fas fa-trash"></i>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                      <div className="d-flex justify-content-between align-items-center mt-4">
                        <div className="text-muted">
                          Mostrando página {currentPage + 1} de {totalPages}
                        </div>
                        <nav>
                          <ul className="pagination">
                            <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => handlePageChange(currentPage - 1)}
                              >
                                Anterior
                              </button>
                            </li>
                            
                            {[...Array(totalPages)].map((_, index) => (
                              <li 
                                key={index} 
                                className={`page-item ${currentPage === index ? 'active' : ''}`}
                              >
                                <button 
                                  className="page-link"
                                  onClick={() => handlePageChange(index)}
                                >
                                  {index + 1}
                                </button>
                              </li>
                            ))}
                            
                            <li className={`page-item ${currentPage === totalPages - 1 ? 'disabled' : ''}`}>
                              <button 
                                className="page-link"
                                onClick={() => handlePageChange(currentPage + 1)}
                              >
                                Siguiente
                              </button>
                            </li>
                          </ul>
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Resumen de Stock */}
            <div className="row mt-4">
              <div className="col-md-4">
                <div className="stat-card stock-summary">
                  <div className="stat-icon total">
                    <i className="fas fa-boxes"></i>
                  </div>
                  <div className="stat-info">
                    <h3>{inventario.length}</h3>
                    <p>Productos en Inventario</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card stock-summary">
                  <div className="stat-icon warning">
                    <i className="fas fa-exclamation-triangle"></i>
                  </div>
                  <div className="stat-info">
                    <h3>
                      {inventario.filter(item => getStockStatus(item) === 'bajo-stock').length}
                    </h3>
                    <p>Productos con Stock Bajo</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="stat-card stock-summary">
                  <div className="stat-icon success">
                    <i className="fas fa-chart-line"></i>
                  </div>
                  <div className="stat-info">
                    <h3>
                      {inventario.filter(item => getStockStatus(item) === 'sobre-stock').length}
                    </h3>
                    <p>Productos con Sobre Stock</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <InventarioModal
        show={showInventarioModal}
        onHide={() => setShowInventarioModal(false)}
        inventario={selectedInventario}
        onSave={selectedInventario ? handleUpdateInventario : handleCreateInventario}
      />

      <AjustarStockModal
        show={showAjustarModal}
        onHide={() => setShowAjustarModal(false)}
        inventario={selectedInventario}
        onAjustar={handleAjustarStock}
      />

      <DetalleInventarioModal
        show={showDetalleModal}
        onHide={() => setShowDetalleModal(false)}
        inventario={selectedInventario}
      />
    </div>
  );
};

export default Inventario;