import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../firebase'
import '../styles/Login.css'

export default function Login() {
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleGoogleLogin() {
    setLoading(true)
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/dashboard')
    } catch (err) {
      setError('Google sign-in failed. Please try again.')
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

        {error && <div className="login-error">{error}</div>}

        <div className="form-group">
          <label>Role</label>
          <select>
            <option value="pharmacist">Pharmacist</option>
            <option value="manager">Pharmaceutical Manager</option>
          </select>
        </div>

        <div className="login-divider"><span>sign in with</span></div>

        <button
          className="google-btn"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
          {loading ? 'Signing in...' : 'Continue with Google'}
        </button>

        <p className="login-footer">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  )
}