import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const ProductoEditModal = ({ show, onClose, producto, categorias, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    precioUnitario: '',
    costo: '',
    categoriasIds: []
  })
  const [loading, setLoading] = useState(false)
  const { negocioId } = useAuth()

  useEffect(() => {
    if (producto) {
      setFormData({
        nombre: producto.nombre || '',
        precioUnitario: producto.precioUnitario || '',
        costo: producto.costo || '',
        categoriasIds: producto.categorias ? producto.categorias.map(cat => cat.id) : []
      })
    } else {
      setFormData({
        nombre: '',
        precioUnitario: '',
        costo: '',
        categoriasIds: []
      })
    }
  }, [producto, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleCategoriaChange = (categoriaId) => {
    setFormData(prev => {
      const categoriasIds = [...prev.categoriasIds]
      const index = categoriasIds.indexOf(categoriaId)
      
      if (index > -1) {
        categoriasIds.splice(index, 1)
      } else {
        categoriasIds.push(categoriaId)
      }
      
      return {
        ...prev,
        categoriasIds
      }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let url, method

      if (producto) {
        // Actualizar producto existente
        url = `http://localhost:8085/api/productos/${producto.id}/negocio/${negocioId}`
        method = 'PUT'
      } else {
        // Crear nuevo producto
        url = `http://localhost:8085/api/productos/negocio/${negocioId}`
        method = 'POST'
      }

      const payload = {
        ...formData,
        precioUnitario: parseFloat(formData.precioUnitario),
        costo: parseFloat(formData.costo)
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        onSave()
        onClose()
        alert(producto ? 'Producto actualizado correctamente' : 'Producto creado correctamente')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error al guardar el producto')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  const calcularMargen = () => {
    const precio = parseFloat(formData.precioUnitario) || 0
    const costo = parseFloat(formData.costo) || 0
    if (costo > 0) {
      return ((precio - costo) / costo * 100).toFixed(2)
    }
    return 0
  }

  if (!show) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className={`fas ${producto ? 'fa-edit text-warning' : 'fa-plus text-success'} me-2`}></i>
              {producto ? 'Editar Producto' : 'Nuevo Producto'}
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="Ingrese el nombre del producto"
                  />
                </div>
                
                <div className="col-md-3 mb-3">
                  <label htmlFor="precioUnitario" className="form-label">
                    Precio Unitario <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    id="precioUnitario"
                    name="precioUnitario"
                    value={formData.precioUnitario}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="0.00"
                  />
                </div>
                
                <div className="col-md-3 mb-3">
                  <label htmlFor="costo" className="form-label">
                    Costo <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    className="form-control"
                    id="costo"
                    name="costo"
                    value={formData.costo}
                    onChange={handleChange}
                    required
                    disabled={loading}
                    placeholder="0.00"
                  />
                </div>
                
                {/* Calculadora de margen */}
                <div className="col-12 mb-3">
                  <div className="card bg-light">
                    <div className="card-body py-2">
                      <div className="row">
                        <div className="col-md-4">
                          <small className="text-muted">Margen de Ganancia:</small>
                          <div className={`fw-bold ${calcularMargen() > 50 ? 'text-success' : 'text-warning'}`}>
                            {calcularMargen()}%
                          </div>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted">Ganancia por Unidad:</small>
                          <div className="fw-bold text-success">
                            ${((parseFloat(formData.precioUnitario) || 0) - (parseFloat(formData.costo) || 0)).toFixed(2)}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <small className="text-muted">Precio de Venta:</small>
                          <div className="fw-bold text-primary">
                            ${(parseFloat(formData.precioUnitario) || 0).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Selección de categorías */}
                <div className="col-12 mb-3">
                  <label className="form-label">Categorías</label>
                  <div className="border rounded p-3" style={{maxHeight: '200px', overflowY: 'auto'}}>
                    {categorias.length === 0 ? (
                      <p className="text-muted text-center mb-0">
                        No hay categorías disponibles. <br />
                        <small>Primero crea algunas categorías.</small>
                      </p>
                    ) : (
                      <div className="row">
                        {categorias.map((categoria) => (
                          <div key={categoria.id} className="col-md-6 mb-2">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`categoria-${categoria.id}`}
                                checked={formData.categoriasIds.includes(categoria.id)}
                                onChange={() => handleCategoriaChange(categoria.id)}
                                disabled={loading}
                              />
                              <label className="form-check-label" htmlFor={`categoria-${categoria.id}`}>
                                {categoria.nombre}
                              </label>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="form-text">
                    Selecciona las categorías a las que pertenece este producto
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={onClose}
                disabled={loading}
              >
                <i className="fas fa-times me-2"></i>
                Cancelar
              </button>
              
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className={`fas ${producto ? 'fa-save' : 'fa-check'} me-2`}></i>
                    {producto ? 'Actualizar' : 'Crear Producto'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductoEditModal