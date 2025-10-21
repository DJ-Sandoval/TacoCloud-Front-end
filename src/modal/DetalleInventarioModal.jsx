import '../styles/Modals.css';

const DetalleInventarioModal = ({ show, onHide, inventario }) => {
  if (!show || !inventario) return null;

  const getStockStatus = () => {
    if (inventario.cantidad <= inventario.cantidadMinima) {
      return { class: 'danger', text: 'Stock Bajo', icon: 'fa-exclamation-triangle' };
    } else if (inventario.cantidad >= inventario.cantidadMaxima) {
      return { class: 'warning', text: 'Sobre Stock', icon: 'fa-chart-line' };
    } else {
      return { class: 'success', text: 'Stock Normal', icon: 'fa-check-circle' };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <div className="modal fade show" style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header" style={{backgroundColor: '#1a3c34', color: 'white'}}>
            <h5 className="modal-title">
              <i className="fas fa-info-circle me-2"></i>
              Detalles de Inventario
            </h5>
            <button 
              type="button" 
              className="btn-close btn-close-white"
              onClick={onHide}
            ></button>
          </div>
          
          <div className="modal-body">
            <div className="row">
              <div className="col-12 text-center mb-4">
                <div className={`alert alert-${stockStatus.class}`} role="alert">
                  <i className={`fas ${stockStatus.icon} me-2`}></i>
                  <strong>{stockStatus.text}</strong>
                </div>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Producto</label>
                <p>{inventario.productoNombre}</p>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">ID Producto</label>
                <p>{inventario.productoId}</p>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Stock Actual</label>
                <div className="fs-4 fw-bold text-primary">{inventario.cantidad}</div>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Stock Mínimo</label>
                <div className="fs-5">{inventario.cantidadMinima}</div>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label fw-bold">Stock Máximo</label>
                <div className="fs-5">{inventario.cantidadMaxima}</div>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label fw-bold">Estado del Stock</label>
                <div className="progress" style={{height: '20px'}}>
                  <div 
                    className={`progress-bar bg-${stockStatus.class}`}
                    style={{
                      width: `${Math.min(100, (inventario.cantidad / inventario.cantidadMaxima) * 100)}%`
                    }}
                  >
                    {inventario.cantidad} / {inventario.cantidadMaxima}
                  </div>
                </div>
                <small className="text-muted">
                  {inventario.cantidad <= inventario.cantidadMinima ? 
                    `⚠️ Stock por debajo del mínimo (${inventario.cantidadMinima})` : 
                    inventario.cantidad >= inventario.cantidadMaxima ?
                    `📈 Stock por encima del máximo (${inventario.cantidadMaxima})` :
                    '✅ Stock dentro de los parámetros normales'
                  }
                </small>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Fecha de Creación</label>
                <p>{new Date(inventario.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label fw-bold">Última Actualización</label>
                <p>{new Date(inventario.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          
          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onHide}
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetalleInventarioModal;
