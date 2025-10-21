import { useState, useEffect } from 'react';
import '../styles/Modals.css';

const AjustarStockModal = ({ show, onHide, inventario, onAjustar }) => {
  const [formData, setFormData] = useState({
    tipoAjuste: 'sumar', // 'sumar' o 'restar'
    cantidad: '',
    motivo: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (show) {
      setFormData({
        tipoAjuste: 'sumar',
        cantidad: '',
        motivo: ''
      });
      setError('');
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const cantidad = parseInt(formData.cantidad);
      
      if (!cantidad || cantidad <= 0) {
        throw new Error('La cantidad debe ser un número positivo');
      }

      // Calcular la cantidad final
      const cantidadFinal = formData.tipoAjuste === 'sumar' ? cantidad : -cantidad;

      // Validar que no quede stock negativo
      const nuevoStock = inventario.cantidad + cantidadFinal;
      if (nuevoStock < 0) {
        throw new Error('No se puede tener stock negativo');
      }

      await onAjustar(cantidadFinal, formData.motivo);
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calcularNuevoStock = () => {
    if (!formData.cantidad || !inventario) return null;
    
    const cantidad = parseInt(formData.cantidad);
    const ajuste = formData.tipoAjuste === 'sumar' ? cantidad : -cantidad;
    return inventario.cantidad + ajuste;
  };

  const getStockStatus = (nuevoStock) => {
    if (nuevoStock <= inventario.cantidadMinima) {
      return { class: 'text-danger', text: 'STOCK BAJO' };
    } else if (nuevoStock >= inventario.cantidadMaxima) {
      return { class: 'text-warning', text: 'SOBRE STOCK' };
    } else {
      return { class: 'text-success', text: 'STOCK NORMAL' };
    }
  };

  if (!show || !inventario) return null;

  const nuevoStock = calcularNuevoStock();
  const stockStatus = nuevoStock !== null ? getStockStatus(nuevoStock) : null;

  return (
    <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header" style={{backgroundColor: '#1a3c34', color: 'white'}}>
            <h5 className="modal-title">
              <i className="fas fa-edit me-2"></i>
              Ajustar Stock
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={onHide}
              disabled={loading}
            ></button>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  {error}
                </div>
              )}

              {/* Información del producto */}
              <div className="product-info mb-4 p-3 rounded" style={{backgroundColor: '#f8f9fa'}}>
                <h6 className="mb-2">{inventario.productoNombre}</h6>
                <div className="row text-center">
                  <div className="col-4">
                    <div className="fw-bold text-primary">{inventario.cantidad}</div>
                    <small className="text-muted">Stock Actual</small>
                  </div>
                  <div className="col-4">
                    <div className="text-muted">{inventario.cantidadMinima}</div>
                    <small className="text-muted">Mínimo</small>
                  </div>
                  <div className="col-4">
                    <div className="text-muted">{inventario.cantidadMaxima}</div>
                    <small className="text-muted">Máximo</small>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-12 mb-3">
                  <label className="form-label">Tipo de Ajuste</label>
                  <div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipoAjuste"
                        id="sumar"
                        value="sumar"
                        checked={formData.tipoAjuste === 'sumar'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="sumar">
                        <i className="fas fa-plus-circle text-success me-1"></i>
                        Sumar Stock
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tipoAjuste"
                        id="restar"
                        value="restar"
                        checked={formData.tipoAjuste === 'restar'}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="restar">
                        <i className="fas fa-minus-circle text-danger me-1"></i>
                        Restar Stock
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="cantidad" className="form-label">
                    Cantidad a {formData.tipoAjuste === 'sumar' ? 'sumar' : 'restar'} <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    className="form-control"
                    value={formData.cantidad}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="motivo" className="form-label">
                    Motivo del ajuste
                  </label>
                  <textarea
                    id="motivo"
                    name="motivo"
                    className="form-control"
                    rows="3"
                    value={formData.motivo}
                    onChange={handleChange}
                    placeholder="Ej: Ajuste por inventario físico, venta, compra, etc."
                  ></textarea>
                </div>

                {/* Previsualización del nuevo stock */}
                {nuevoStock !== null && (
                  <div className="col-12">
                    <div className="stock-preview p-3 rounded border">
                      <h6 className="mb-2">Previsualización:</h6>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>Stock actual: <strong>{inventario.cantidad}</strong></span>
                        <i className="fas fa-arrow-right mx-2 text-muted"></i>
                        <span className={stockStatus.class}>
                          Nuevo stock: <strong>{nuevoStock}</strong>
                        </span>
                      </div>
                      {stockStatus && (
                        <div className={`text-center mt-2 p-1 rounded ${stockStatus.class.replace('text', 'bg')}-light`}>
                          <small className={stockStatus.class}>
                            <i className="fas fa-info-circle me-1"></i>
                            {stockStatus.text}
                          </small>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="modal-footer">
              <button 
                type="button" 
                className="btn btn-secondary"
                onClick={onHide}
                disabled={loading}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || !formData.cantidad}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Ajustando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-check me-2"></i>
                    Aplicar Ajuste
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AjustarStockModal;