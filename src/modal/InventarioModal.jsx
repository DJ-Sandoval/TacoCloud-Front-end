import { useState, useEffect } from 'react';
import { useApi } from '../hooks/useApi';
import '../styles/Modals.css';

const InventarioModal = ({ show, onHide, inventario, onSave }) => {
  const [formData, setFormData] = useState({
    productoId: '',
    cantidad: '',
    cantidadMinima: '',
    cantidadMaxima: ''
  });
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [error, setError] = useState('');
  const [productosError, setProductosError] = useState('');

  const { fetchProductos } = useApi();

  useEffect(() => {
    if (show) {
      setLoadingProductos(true);
      setProductosError('');
      loadProductos();
      if (inventario) {
        setFormData({
          productoId: inventario.productoId || '',
          cantidad: inventario.cantidad || '',
          cantidadMinima: inventario.cantidadMinima || '',
          cantidadMaxima: inventario.cantidadMaxima || ''
        });
      } else {
        setFormData({
          productoId: '',
          cantidad: '',
          cantidadMinima: '',
          cantidadMaxima: ''
        });
      }
      setError('');
    }
  }, [show, inventario]);

  const loadProductos = async () => {
    try {
      setLoadingProductos(true);
      const response = await fetchProductos('?page=0&size=1000');
      if (!response.ok) {
        throw new Error(`Error ${response.status}: No se pudieron cargar los productos`);
      }
      const data = await response.json();
      setProductos(data.content || []);
      if (!data.content || data.content.length === 0) {
        setProductosError('No hay productos disponibles');
      }
    } catch (err) {
      console.error('Error loading productos:', err);
      setProductosError('Error al cargar los productos: ' + err.message);
    } finally {
      setLoadingProductos(false);
    }
  };

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
      // Validaciones
      if (!formData.productoId) {
        throw new Error('Debe seleccionar un producto');
      }
      if (parseInt(formData.cantidadMinima) >= parseInt(formData.cantidadMaxima)) {
        throw new Error('La cantidad mínima debe ser menor que la máxima');
      }
      if (parseInt(formData.cantidad) < 0) {
        throw new Error('La cantidad no puede ser negativa');
      }

      const inventarioData = {
        productoId: parseInt(formData.productoId),
        cantidad: parseInt(formData.cantidad),
        cantidadMinima: parseInt(formData.cantidadMinima),
        cantidadMaxima: parseInt(formData.cantidadMaxima)
      };

      await onSave(inventarioData);
      onHide();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getProductoNombre = (productoId) => {
    const producto = productos.find(p => p.id === parseInt(productoId));
    return producto ? producto.nombre : 'Producto no encontrado';
  };

  if (!show) return null;

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: '#1a3c34', color: 'white' }}>
            <h5 className="modal-title">
              <i className="fas fa-warehouse me-2"></i>
              {inventario ? 'Editar Inventario' : 'Nuevo Registro de Inventario'}
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

              <div className="row">
                <div className="col-12 mb-3">
                  <label htmlFor="productoId" className="form-label">
                    Producto <span className="text-danger">*</span>
                  </label>
                  {loadingProductos ? (
                    <div className="text-center">
                      <span className="spinner-border spinner-border-sm" role="status"></span>
                      Cargando productos...
                    </div>
                  ) : productosError ? (
                    <div className="alert alert-warning">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {productosError}
                    </div>
                  ) : (
                    <select
                      id="productoId"
                      name="productoId"
                      className="form-select"
                      value={formData.productoId}
                      onChange={handleChange}
                      required
                      disabled={!!inventario || loadingProductos}
                    >
                      <option value="">Seleccionar producto</option>
                      {productos.map(producto => (
                        <option key={producto.id} value={producto.id}>
                          {producto.nombre} - ${producto.precio || producto.precioUnitario}
                        </option>
                      ))}
                    </select>
                  )}
                  {inventario && (
                    <small className="text-muted">
                      Producto: {getProductoNombre(formData.productoId)}
                    </small>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="cantidad" className="form-label">
                    Cantidad Actual <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    className="form-control"
                    value={formData.cantidad}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label htmlFor="cantidadMinima" className="form-label">
                    Cantidad Mínima <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="cantidadMinima"
                    name="cantidadMinima"
                    className="form-control"
                    value={formData.cantidadMinima}
                    onChange={handleChange}
                    min="0"
                    required
                  />
                </div>

                <div className="col-12 mb-3">
                  <label htmlFor="cantidadMaxima" className="form-label">
                    Cantidad Máxima <span className="text-danger">*</span>
                  </label>
                  <input
                    type="number"
                    id="cantidadMaxima"
                    name="cantidadMaxima"
                    className="form-control"
                    value={formData.cantidadMaxima}
                    onChange={handleChange}
                    min="1"
                    required
                  />
                </div>

                {/* Información de stock */}
                {formData.cantidad && formData.cantidadMinima && formData.cantidadMaxima && (
                  <div className="col-12">
                    <div className="stock-info p-3 rounded" style={{backgroundColor: '#f8f9fa'}}>
                      <h6 className="mb-2">Resumen de Stock:</h6>
                      <div className="row text-center">
                        <div className="col-4">
                          <div className={`fw-bold ${
                            parseInt(formData.cantidad) <= parseInt(formData.cantidadMinima) ? 'text-danger' : 
                            parseInt(formData.cantidad) >= parseInt(formData.cantidadMaxima) ? 'text-warning' : 'text-success'
                          }`}>
                            {formData.cantidad}
                          </div>
                          <small className="text-muted">Actual</small>
                        </div>
                        <div className="col-4">
                          <div className="text-muted">{formData.cantidadMinima}</div>
                          <small className="text-muted">Mínimo</small>
                        </div>
                        <div className="col-4">
                          <div className="text-muted">{formData.cantidadMaxima}</div>
                          <small className="text-muted">Máximo</small>
                        </div>
                      </div>
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
                disabled={loading || loadingProductos}
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={loading || loadingProductos}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Guardando...
                  </>
                ) : (
                  <>
                    <i className="fas fa-save me-2"></i>
                    {inventario ? 'Actualizar' : 'Crear'}
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

export default InventarioModal;