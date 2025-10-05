import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const ClienteModal = ({ show, onClose, cliente, onSave }) => {
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
  }, [cliente])

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
      const url = cliente 
        ? `http://localhost:8085/api/clientes/${cliente.id}`
        : 'http://localhost:8085/api/clientes'
      
      const method = cliente ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        negocioId: parseInt(negocioId)
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
        alert(cliente ? 'Cliente actualizado correctamente' : 'Cliente creado correctamente')
      } else {
        alert('Error al guardar el cliente')
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
              {cliente ? (cliente.id ? 'Editar Cliente' : 'Ver Cliente') : 'Nuevo Cliente'}
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
                  <label htmlFor="nombre" className="form-label">Nombre *</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                    disabled={loading || (cliente && !cliente.id)}
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
                    disabled={loading || (cliente && !cliente.id)}
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
                    disabled={loading || (cliente && !cliente.id)}
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
                    disabled={loading || (cliente && !cliente.id)}
                  />
                </div>
                
                <div className="col-md-6 mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="frecuente"
                      name="frecuente"
                      checked={formData.frecuente}
                      onChange={handleChange}
                      disabled={loading || (cliente && !cliente.id)}
                    />
                    <label className="form-check-label" htmlFor="frecuente">
                      Cliente Frecuente
                    </label>
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
                Cancelar
              </button>
              
              {(!cliente || cliente.id) && (
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
                    cliente ? 'Actualizar' : 'Crear Cliente'
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ClienteModal