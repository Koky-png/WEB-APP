import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import '../styles/Login.css'

const EMPTY_FORM = { email: '', password: '', role: 'pharmacist' }

export default function Login() {
  const navigate = useNavigate()
  
  // State management
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Update state on input change and clear specific errors
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  // Validation logic
  function validate() {
    const e = {}
    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address'
    }

    if (!form.password) {
      e.password = 'Password is required'
    } else if (form.password.length < 6) {
      e.password = 'Password must be at least 6 characters'
    }

    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setLoading(true)
    try {
      // TODO: Replace with your actual Firebase/API login call
      // e.g., await signInWithEmailAndPassword(auth, form.email, form.password)
      setSuccess(true)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setErrors({ server: 'Invalid email or password' })
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    setLoading(true)
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/dashboard')
    } catch (err) {
      setErrors({ server: 'Google sign-in failed. Please try again.' })
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">💊</div>
        <h1 className="login-title">PharmTrack</h1>
        <p className="login-sub">Sign in to your account</p>

        {/* Global/Server Error Message */}
        {errors.server && <div className="login-error">{errors.server}</div>}
        {success && <div className="login-success">Login successful! Redirecting...</div>}

        <form onSubmit={handleSubmit} className="form-group">
          <label>Email</label>
          <input 
            type="text" 
            name="email"
            value={form.email}
            onChange={handleChange}
            className={errors.email ? 'input-error' : ''}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}

          <label>Role</label>
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="pharmacist">Pharmacist</option>
            <option value="manager">Pharmaceutical Manager</option>
          </select>

          <label>Password</label>
          <input 
            type="password" 
            name="password"
            value={form.password}
            onChange={handleChange}
            className={errors.password ? 'input-error' : ''}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <div className="login-divider"><span>sign in with</span></div>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          Continue with Google
        </button>

        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}