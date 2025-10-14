const ProductoViewModal = ({ show, onClose, producto }) => {
  if (!show || !producto) return null

  const calcularMargen = (precio, costo) => {
    return ((precio - costo) / costo * 100).toFixed(2)
  }

  const calcularGanancia = (precio, costo) => {
    return (precio - costo).toFixed(2)
  }

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-eye me-2 text-info"></i>
              Detalles del Producto
            </h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={onClose}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">ID del Producto</label>
                <div className="form-control bg-light">
                  {producto.id}
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Nombre</label>
                <div className="form-control bg-light">
                  {producto.nombre || 'No especificado'}
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold text-primary">Precio Unitario</label>
                <div className="form-control bg-light">
                  <span className="fw-bold text-success">
                    ${producto.precioUnitario?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold text-primary">Costo</label>
                <div className="form-control bg-light">
                  <span className="text-muted">
                    ${producto.costo?.toFixed(2) || '0.00'}
                  </span>
                </div>
              </div>
              
              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold text-primary">Margen de Ganancia</label>
                <div className="form-control bg-light">
                  <span className={`badge ${calcularMargen(producto.precioUnitario, producto.costo) > 50 ? 'bg-success' : 'bg-warning'} fs-6`}>
                    {calcularMargen(producto.precioUnitario, producto.costo)}%
                  </span>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Ganancia por Unidad</label>
                <div className="form-control bg-light">
                  <span className="fw-bold text-success">
                    ${calcularGanancia(producto.precioUnitario, producto.costo)}
                  </span>
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Negocio ID</label>
                <div className="form-control bg-light">
                  {producto.negocioId}
                </div>
              </div>
            </div>
            
            {/* Categorías del producto */}
            {producto.categorias && producto.categorias.length > 0 && (
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="text-muted mb-3">
                  <i className="fas fa-tags me-2"></i>
                  Categorías de este producto
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {producto.categorias.map((categoria) => (
                    <span key={categoria.id} className="badge bg-info fs-6">
                      {categoria.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Información adicional */}
            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="text-muted mb-3">
                <i className="fas fa-chart-line me-2"></i>
                Análisis de Rentabilidad
              </h6>
              <div className="row">
                <div className="col-md-4">
                  <small className="text-muted">Rentabilidad:</small>
                  <div className={`fw-bold ${calcularMargen(producto.precioUnitario, producto.costo) > 50 ? 'text-success' : 'text-warning'}`}>
                    {calcularMargen(producto.precioUnitario, producto.costo) > 50 ? 'Alta' : 'Media'}
                  </div>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Precio/Costo:</small>
                  <div className="fw-bold text-primary">
                    {(producto.precioUnitario / producto.costo).toFixed(2)}x
                  </div>
                </div>
                <div className="col-md-4">
                  <small className="text-muted">Recomendación:</small>
                  <div className="fw-bold text-success">
                    {calcularMargen(producto.precioUnitario, producto.costo) > 30 ? 'Óptimo' : 'Revisar'}
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
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductoViewModal