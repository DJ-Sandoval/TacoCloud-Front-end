import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const ClienteEditModal = ({ show, onClose, cliente, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    direccion: '',
    frecuente: false
  })
  const [loading, setLoading] = useState(false)
  const { negocioId } = useAuth()

  useEffect(() => {
    if (cliente) {
      setFormData({
        nombre: cliente.nombre || '',
        telefono: cliente.telefono || '',
        email: cliente.email || '',
        direccion: cliente.direccion || '',
        frecuente: cliente.frecuente || false
      })
    } else {
      setFormData({
        nombre: '',
        telefono: '',
        email: '',
        direccion: '',
        frecuente: false
      })
    }
  }, [cliente, show])

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let url, method

      if (cliente) {
        // Actualizar cliente existente
        url = `http://localhost:8085/api/clientes/${cliente.id}/negocio/${negocioId}`
        method = 'PUT'
      } else {
        // Crear nuevo cliente
        url = `http://localhost:8085/api/clientes/negocio/${negocioId}`
        method = 'POST'
      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const result = await response.json()
        onSave()
        onClose()
        alert(cliente ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error al guardar el cliente')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar el cliente')
    } finally {
      setLoading(false)
    }
  }

  if (!show) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className={`fas ${cliente ? 'fa-edit text-warning' : 'fa-plus text-success'} me-2`}></i>
              {cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
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
                    placeholder="Ingrese el nombre completo"
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="telefono" className="form-label">Teléfono</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Ej: +52 123 456 7890"
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="cliente@ejemplo.com"
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <label htmlFor="direccion" className="form-label">Dirección</label>
                  <input
                    type="text"
                    className="form-control"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Dirección completa"
                  />
                </div>
                
                <div className="col-12 mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="frecuente"
                      name="frecuente"
                      checked={formData.frecuente}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <label className="form-check-label fw-bold" htmlFor="frecuente">
                      <i className="fas fa-star me-2 text-warning"></i>
                      Marcar como cliente frecuente
                    </label>
                    <div className="form-text text-muted">
                      Los clientes frecuentes pueden recibir promociones especiales y descuentos.
                    </div>
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
                    <i className={`fas ${cliente ? 'fa-save' : 'fa-check'} me-2`}></i>
                    {cliente ? 'Actualizar' : 'Crear Cliente'}
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

export default ClienteEditModal