import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Register.css'

const BRANCHES = ["CBD Branch", "Westlands Branch", "Karen Branch"]

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  role: '',
  branch: '',
}

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false) // Added loading state
  const [success, setSuccess] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate() {
    const e = {}
    if (!form.fullName.trim()) e.fullName = 'Full name is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address'
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    else if (!/^\+?[\d\s\-]{10,15}$/.test(form.phone)) e.phone = 'Enter a valid phone number'
    if (!form.password) e.password = 'Password is required'
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password'
    else if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    if (!form.role) e.role = 'Please select a role'
    if (!form.branch) e.branch = 'Please select a branch'
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
      // 1. Create the user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        form.email, 
        form.password
      )
      const user = userCredential.user

      // 2. Store additional info in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        role: form.role,
        branch: form.branch,
        createdAt: new Date().toISOString()
      })

      setSuccess(true)
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      // Handle Firebase specific errors (e.g., email already exists)
      if (err.code === 'auth/email-already-in-use') {
        setErrors({ email: 'This email is already registered.' })
      } else {
        setErrors({ server: 'Failed to create account. Please try again.' })
      }
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-logo">💊</div>
        <h1 className="register-title">PharmTrack</h1>
        <p className="register-sub">Create your account</p>

        {success && (
          <div className="register-success">
            ✅ Account created! Redirecting to login...
          </div>
        )}
        
        {errors.server && <div className="register-error">{errors.server}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Kelly Wambugu"
              disabled={loading}
            />
            {errors.fullName && <span className="form-error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@pharmacy.com"
              disabled={loading}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="e.g. +254 712 345 678"
              disabled={loading}
            />
            {errors.phone && <span className="form-error">{errors.phone}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                value={form.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                disabled={loading}
              />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Role</label>
              <select name="role" value={form.role} onChange={handleChange} disabled={loading}>
                <option value="">-- Select Role --</option>
                <option value="pharmacist">Pharmacist</option>
                <option value="manager">Pharmaceutical Manager</option>
              </select>
              {errors.role && <span className="form-error">{errors.role}</span>}
            </div>
            <div className="form-group">
              <label>Branch</label>
              <select name="branch" value={form.branch} onChange={handleChange} disabled={loading}>
                <option value="">-- Select Branch --</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              {errors.branch && <span className="form-error">{errors.branch}</span>}
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="register-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  )
}