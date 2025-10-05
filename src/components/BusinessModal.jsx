import { Modal, Button, Form } from 'react-bootstrap'

const BusinessModal = ({ show, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Negocio creado con éxito')
    onClose()
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Crear Negocio</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Nombre del Negocio</Form.Label>
            <Form.Control type="text" placeholder="Ingresa el nombre del negocio" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Descripción</Form.Label>
            <Form.Control as="textarea" rows={3} placeholder="Describe tu negocio" required />
          </Form.Group>
          <div className="d-grid">
            <Button variant="danger" type="submit">Agregar Negocio</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default BusinessModal
