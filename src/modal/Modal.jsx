const Modal = ({ show, onClose, title, children, size = 'lg' }) => {
  if (!show) return null

  const modalSizeClass = {
    sm: 'modal-sm',
    md: 'modal-md',
    lg: 'modal-lg',
    xl: 'modal-xl'
  }[size]

  return (
    <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className={`modal-dialog ${modalSizeClass}`}>
        <div className="modal-content">
          <div className="modal-header" style={{ backgroundColor: '#1a3c34', color: 'white' }}>
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Modal