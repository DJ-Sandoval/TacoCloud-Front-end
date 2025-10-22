import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import Sidebar from './Sidebar'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../hooks/useApi'
import '../styles/Dashboard.css'

// Registrar componentes de Chart.js
ChartJS.register(ArcElement, Tooltip, Legend)

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [totalClientes, setTotalClientes] = useState(0)
  const [bajoStock, setBajoStock] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingBajoStock, setLoadingBajoStock] = useState(true)
  const { user, negocioId } = useAuth()
  const { fetchTotalClientes, fetchBajoStock } = useApi()
  const navigate = useNavigate()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  // Función para cargar el total de clientes
  const loadTotalClientes = async () => {
    try {
      setLoading(true)
      const response = await fetchTotalClientes()
      if (response.ok) {
        const data = await response.json()
        setTotalClientes(data.totalClientes || 0)
      } else {
        console.error('Error al cargar total de clientes')
        setTotalClientes(0)
      }
    } catch (error) {
      console.error('Error:', error)
      setTotalClientes(0)
    } finally {
      setLoading(false)
    }
  }

  // Función para cargar productos con bajo stock
  const loadBajoStock = async () => {
    try {
      setLoadingBajoStock(true)
      const response = await fetchBajoStock(0, 10)
      if (response.ok) {
        const data = await response.json()
        setBajoStock(data.content || [])
      } else {
        console.error('Error al cargar productos con bajo stock')
        setBajoStock([])
      }
    } catch (error) {
      console.error('Error:', error)
      setBajoStock([])
    } finally {
      setLoadingBajoStock(false)
    }
  }

  // Función para exportar a Excel
  const exportToExcel = () => {
    const dataToExport = bajoStock.map(item => ({
      'Producto': item.productoNombre,
      'Stock Actual': item.cantidad,
      'Stock Mínimo': item.cantidadMinima,
      'Diferencia': item.cantidadMinima - item.cantidad,
      'Estado': 'Stock Bajo'
    }))

    const headers = ['Producto', 'Stock Actual', 'Stock Mínimo', 'Diferencia', 'Estado']
    const csvContent = [
      headers.join(','),
      ...dataToExport.map(row => 
        headers.map(header => 
          `"${row[header] || ''}"`
        ).join(',')
      )
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `productos_bajo_stock_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Preparar datos para el gráfico de tarta
  const getChartData = () => {
    // Tomar solo los primeros 10 productos para el gráfico
    const top10 = bajoStock.slice(0, 10)
    
    return {
      labels: top10.map(item => item.productoNombre),
      datasets: [
        {
          data: top10.map(item => item.cantidadMinima - item.cantidad),
          backgroundColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF', '#7CFFB2', '#F465C7'
          ],
          borderColor: [
            '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
            '#FF9F40', '#FF6384', '#C9CBCF', '#7CFFB2', '#F465C7'
          ],
          borderWidth: 2,
          hoverOffset: 15
        }
      ]
    }
  }

  // Opciones del gráfico
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 12,
          font: {
            size: 11
          },
          padding: 15
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || ''
            const value = context.raw || 0
            const total = context.dataset.data.reduce((a, b) => a + b, 0)
            const percentage = Math.round((value / total) * 100)
            return `${label}: ${value} unidades (${percentage}%)`
          }
        }
      },
      title: {
        display: true,
        text: 'Top 10 Productos - Diferencia de Stock',
        font: {
          size: 14,
          weight: 'bold'
        }
      }
    },
    cutout: '50%'
  }

  useEffect(() => {
    loadTotalClientes()
    loadBajoStock()
  }, [negocioId])

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
                  Dashboard Principal
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
            <div className="welcome-section">
              <h2>Hola, {user?.username} 👋</h2>
              <p className="lead">Gestiona tu negocio de tacos de manera eficiente</p>
            </div>
            
            <div className="row mt-4">
              <div className="col-md-3 mb-4">
                <div className="stat-card" onClick={() => handleNavigation('/clientes')} style={{cursor: 'pointer'}}>
                  <div className="stat-icon customers">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info">
                    <h3>
                      {loading ? (
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Cargando...</span>
                        </div>
                      ) : (
                        totalClientes.toLocaleString()
                      )}
                    </h3>
                    <p>Clientes</p>
                  </div>
                </div>
              </div>
              
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

            {/* Nueva Sección: Gráfico y Tabla de Productos con Bajo Stock */}
            <div className="row mt-4">
              <div className="col-12">
                <div className="bajo-stock-section">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">
                      <i className="fas fa-exclamation-triangle text-warning me-2"></i>
                      Productos con Stock Bajo
                    </h4>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => handleNavigation('/inventario')}
                      >
                        <i className="fas fa-warehouse me-1"></i>
                        Ver Inventario Completo
                      </button>
                      <button 
                        className="btn btn-success btn-sm"
                        onClick={exportToExcel}
                        disabled={bajoStock.length === 0}
                      >
                        <i className="fas fa-file-excel me-1"></i>
                        Exportar a Excel
                      </button>
                    </div>
                  </div>

                  {loadingBajoStock ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p className="mt-2 text-muted">Cargando productos con bajo stock...</p>
                    </div>
                  ) : bajoStock.length === 0 ? (
                    <div className="text-center py-5 bg-light rounded">
                      <i className="fas fa-check-circle fa-3x text-success mb-3"></i>
                      <h5>¡Excelente! No hay productos con stock bajo</h5>
                      <p className="text-muted">Todos los productos tienen stock suficiente.</p>
                    </div>
                  ) : (
                    <>
                      {/* Gráfico de Tarta */}
                      <div className="row mb-4">
                        <div className="col-md-6">
                          <div className="chart-container">
                            <div className="chart-card">
                              <div className="chart-header">
                                <h5 className="chart-title">
                                  <i className="fas fa-chart-pie me-2"></i>
                                  Distribución de Stock Bajo
                                </h5>
                                <small className="text-muted">
                                  Top 10 productos por diferencia de stock
                                </small>
                              </div>
                              <div className="chart-wrapper">
                                <Doughnut data={getChartData()} options={chartOptions} />
                              </div>
                              <div className="chart-footer">
                                <small className="text-muted">
                                  Total diferencia: {bajoStock.slice(0, 10).reduce((sum, item) => sum + (item.cantidadMinima - item.cantidad), 0)} unidades
                                </small>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="col-md-6">
                          <div className="chart-summary">
                            <h6 className="summary-title">Resumen de Stock Bajo</h6>
                            <div className="summary-stats">
                              <div className="summary-item">
                                <span className="summary-label">Total productos con bajo stock:</span>
                                <span className="summary-value text-danger">{bajoStock.length}</span>
                              </div>
                              <div className="summary-item">
                                <span className="summary-label">Urgencia máxima:</span>
                                <span className="summary-value text-danger">
                                  {bajoStock.length > 0 
                                    ? Math.max(...bajoStock.map(item => item.cantidadMinima - item.cantidad))
                                    : 0
                                  } unidades
                                </span>
                              </div>
                              <div className="summary-item">
                                <span className="summary-label">Promedio de diferencia:</span>
                                <span className="summary-value text-warning">
                                  {bajoStock.length > 0 
                                    ? Math.round(bajoStock.reduce((sum, item) => sum + (item.cantidadMinima - item.cantidad), 0) / bajoStock.length)
                                    : 0
                                  } unidades
                                </span>
                              </div>
                            </div>
                            
                            <div className="summary-actions mt-3">
                              <button 
                                className="btn btn-warning btn-sm w-100"
                                onClick={() => handleNavigation('/inventario')}
                              >
                                <i className="fas fa-sync-alt me-1"></i>
                                Reabastecer Inventario
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Tabla de Productos */}
                      <div className="card">
                        <div className="card-body">
                          <div className="table-responsive">
                            <table className="table table-hover">
                              <thead>
                                <tr>
                                  <th>Producto</th>
                                  <th>Stock Actual</th>
                                  <th>Stock Mínimo</th>
                                  <th>Diferencia</th>
                                  <th>Estado</th>
                                  <th>Acción</th>
                                </tr>
                              </thead>
                              <tbody>
                                {bajoStock.map((producto) => (
                                  <tr key={producto.id} className="align-middle">
                                    <td>
                                      <div className="d-flex align-items-center">
                                        <div className="product-avatar me-3 bg-warning bg-opacity-10">
                                          <i className="fas fa-box text-warning"></i>
                                        </div>
                                        <div>
                                          <div className="fw-bold">{producto.productoNombre}</div>
                                          <small className="text-muted">ID: {producto.productoId}</small>
                                        </div>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="fw-bold text-danger">{producto.cantidad}</span>
                                    </td>
                                    <td>
                                      <span className="text-muted">{producto.cantidadMinima}</span>
                                    </td>
                                    <td>
                                      <span className="badge bg-danger">
                                        {producto.cantidadMinima - producto.cantidad} unidades
                                      </span>
                                    </td>
                                    <td>
                                      <span className="badge bg-warning text-dark">
                                        <i className="fas fa-exclamation-triangle me-1"></i>
                                        Stock Bajo
                                      </span>
                                    </td>
                                    <td>
                                      <button 
                                        className="btn btn-outline-primary btn-sm"
                                        onClick={() => handleNavigation('/inventario')}
                                        title="Ajustar stock"
                                      >
                                        <i className="fas fa-edit me-1"></i>
                                        Reabastecer
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                          
                          <div className="mt-3 text-center">
                            <small className="text-muted">
                              Mostrando {bajoStock.length} producto(s) con stock bajo
                            </small>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="row mt-4">
              <div className="col-12">
                <div className="quick-actions">
                  <h4>Acciones Rápidas</h4>
                  <div className="d-flex gap-3 flex-wrap">
                    <button className="quick-action-btn">
                      <i className="fas fa-cart-plus"></i>
                      Nueva Venta
                    </button>
                    <button 
                      className="quick-action-btn"
                      onClick={() => handleNavigation('/clientes')}
                    >
                      <i className="fas fa-users"></i>
                      Gestionar Clientes
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