const ClienteViewModal = ({ show, onClose, cliente }) => {
  if (!show || !cliente) return null

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">
              <i className="fas fa-eye me-2 text-info"></i>
              Detalles del Cliente
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
                <label className="form-label fw-bold text-primary">ID del Cliente</label>
                <div className="form-control bg-light">
                  {cliente.id}
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Nombre</label>
                <div className="form-control bg-light">
                  {cliente.nombre || 'No especificado'}
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Teléfono</label>
                <div className="form-control bg-light">
                  {cliente.telefono || 'No especificado'}
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Email</label>
                <div className="form-control bg-light">
                  {cliente.email || 'No especificado'}
                </div>
              </div>
              
              <div className="col-12 mb-3">
                <label className="form-label fw-bold text-primary">Dirección</label>
                <div className="form-control bg-light" style={{minHeight: '80px'}}>
                  {cliente.direccion || 'No especificado'}
                </div>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold text-primary">Cliente Frecuente</label>
                <div className="form-control bg-light">
                  <span className={`badge ${cliente.frecuente ? 'bg-success' : 'bg-secondary'}`}>
                    {cliente.frecuente ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Información adicional si está disponible */}
            <div className="mt-4 p-3 bg-light rounded">
              <h6 className="text-muted mb-3">
                <i className="fas fa-info-circle me-2"></i>
                Información del Cliente
              </h6>
              <div className="row">
                <div className="col-md-6">
                  <small className="text-muted">Total de compras:</small>
                  <div className="fw-bold">0</div>
                </div>
                <div className="col-md-6">
                  <small className="text-muted">Última visita:</small>
                  <div className="fw-bold">No registrada</div>
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

export default ClienteViewModal