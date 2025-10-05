import { Modal, Button, Form } from 'react-bootstrap'

const RegisterModal = ({ show, onClose }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    alert('Usuario registrado con éxito')
    onClose()
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton className="bg-danger text-white">
        <Modal.Title>Registrar Usuario</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Usuario</Form.Label>
            <Form.Control type="text" placeholder="Ingresa un usuario" required />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" placeholder="Ingresa una contraseña" required />
          </Form.Group>
          <div className="d-grid">
            <Button variant="danger" type="submit">Registrar</Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}

export default RegisterModal
