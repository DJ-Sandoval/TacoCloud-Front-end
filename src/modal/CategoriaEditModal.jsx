import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const CategoriaEditModal = ({ show, onClose, categoria, onSave }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  })
  const [loading, setLoading] = useState(false)
  const { negocioId } = useAuth()

  useEffect(() => {
    if (categoria) {
      setFormData({
        nombre: categoria.nombre || '',
        descripcion: categoria.descripcion || ''
      })
    } else {
      setFormData({
        nombre: '',
        descripcion: ''
      })
    }
  }, [categoria, show])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      let url, method

      if (categoria) {
        // Actualizar categoría existente
        url = `http://localhost:8085/api/categorias/${categoria.id}/negocio/${negocioId}`
        method = 'PUT'
      } else {
        // Crear nueva categoría
        url = `http://localhost:8085/api/categorias/negocio/${negocioId}`
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
        onSave()
        onClose()
        alert(categoria ? 'Categoría actualizada correctamente' : 'Categoría creada correctamente')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Error al guardar la categoría')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Error al guardar la categoría')
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
              <i className={`fas ${categoria ? 'fa-edit text-warning' : 'fa-plus text-success'} me-2`}></i>
              {categoria ? 'Editar Categoría' : 'Nueva Categoría'}
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
                    placeholder="Ingrese el nombre de la categoría"
                  />
                </div>
                
                <div className="col-12 mb-3">
                  <label htmlFor="descripcion" className="form-label">Descripción</label>
                  <textarea
                    className="form-control"
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    disabled={loading}
                    placeholder="Descripción opcional de la categoría"
                    rows="3"
                  />
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
                    <i className={`fas ${categoria ? 'fa-save' : 'fa-check'} me-2`}></i>
                    {categoria ? 'Actualizar' : 'Crear Categoría'}
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

export default CategoriaEditModal