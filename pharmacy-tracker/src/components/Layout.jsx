import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import '../styles/Layout.css'

const navItems = [
  { path: '/dashboard', label: ' Dashboard' },
  { path: '/drugs', label: ' Drug Catalog' },
  { path: '/stock-in', label: ' Stock In' },
  { path: '/inventory', label: ' Inventory' },
  { path: '/disposal', label: ' Disposal' },
  { path: '/reports', label: ' Reports' },
]

export default function Layout() {
  const navigate = useNavigate()

  function handleLogout() {
    navigate('/login')
  }

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>PharmTrack</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button className="logout-btn" onClick={handleLogout}> Logout</button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  )
}