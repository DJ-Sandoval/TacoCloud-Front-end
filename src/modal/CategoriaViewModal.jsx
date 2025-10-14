const CategoriaViewModal = ({ show, onClose, categoria }) => {
  if (!show || !categoria) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-eye me-2 text-info"></i>
              Detalles de la Categoría
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
                <label className="form-label fw-bold text-primary">ID de la Categoría</label>
                <div className="form-control bg-light">
                  {categoria.id}
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Nombre</label>
                <div className="form-control bg-light">
                  {categoria.nombre || 'No especificado'}
                </div>
              </div>
              
              <div className="col-12 mb-3">
                <label className="form-label fw-bold text-primary">Descripción</label>
                <div className="form-control bg-light" style={{minHeight: '80px'}}>
                  {categoria.descripcion || 'No especificado'}
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Negocio ID</label>
                <div className="form-control bg-light">
                  {categoria.negocioId}
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Total de Productos</label>
                <div className="form-control bg-light">
                  <span className="badge bg-primary fs-6">
                    {categoria.productos?.length || 0} productos
                  </span>
                </div>
              </div>
            </div>
            
            {/* Lista de productos si está disponible */}
            {categoria.productos && categoria.productos.length > 0 && (
              <div className="mt-4 p-3 bg-light rounded">
                <h6 className="text-muted mb-3">
                  <i className="fas fa-boxes me-2"></i>
                  Productos en esta categoría
                </h6>
                <div className="row">
                  {categoria.productos.map((producto) => (
                    <div key={producto.id} className="col-md-6 mb-2">
                      <div className="card">
                        <div className="card-body py-2">
                          <h6 className="card-title mb-1">{producto.nombre}</h6>
                          <p className="card-text text-muted mb-1">
                            Precio: ${producto.precioUnitario}
                          </p>
                          <small className="text-muted">
                            Costo: ${producto.costo}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

export default CategoriaViewModal