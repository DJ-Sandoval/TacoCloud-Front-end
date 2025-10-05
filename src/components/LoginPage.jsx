import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import RegisterModal from './RegisterModal'
import BusinessModal from './BusinessModal'
import '../styles/login.css'

const LoginPage = () => {
  const [showRegister, setShowRegister] = useState(false)
  const [showBusiness, setShowBusiness] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:8085/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        // Login exitoso
        login(
          { userId: data.userId, username: data.username },
          data.token,
          data.negocios
        )
      } else {
        setError(data.message || 'Error en el login')
      }
    } catch (error) {
      setError('Error de conexión: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-body">
      <div className="login-card">
        <h2>Bienvenido a TacoCloud Login</h2>
        
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Usuario</label>
            <input 
              type="text" 
              className="form-control" 
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Ingresa tu usuario" 
              required 
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña" 
              required 
              disabled={loading}
            />
          </div>
          <div className="d-grid mb-3">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        <div className="d-flex justify-content-between">
          <button 
            className="btn btn-link link-secondary p-0" 
            onClick={() => setShowRegister(true)}
            disabled={loading}
          >
            Registrar Usuario
          </button>
          <button 
            className="btn btn-link link-secondary p-0" 
            onClick={() => setShowBusiness(true)}
            disabled={loading}
          >
            Crear Negocio
          </button>
        </div>
      </div>

      <RegisterModal show={showRegister} onClose={() => setShowRegister(false)} />
      <BusinessModal show={showBusiness} onClose={() => setShowBusiness(false)} />
    </div>
  )
}

export default LoginPage